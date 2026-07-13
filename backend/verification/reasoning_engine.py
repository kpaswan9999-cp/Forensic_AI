import json
from enum import Enum
from pydantic import BaseModel
from typing import Optional
from backend.extraction.claim_extractor import ExtractedClaim
from backend.retrieval.hybrid_retriever import HybridRetrievalEngine
from google import genai
import os


class Verdict(str, Enum):
    TRUE = "TRUE"
    FALSE = "FALSE"
    MISLEADING = "MISLEADING"
    PARTIALLY_TRUE = "PARTIALLY_TRUE"
    UNVERIFIABLE = "UNVERIFIABLE"
    DISPUTED = "DISPUTED"


class VerificationResult(BaseModel):
    claim: str
    verdict: Verdict
    credibility_score: float  # 0-100
    confidence: float         # 0-1

    supporting_evidence: list[dict]
    contradicting_evidence: list[dict]

    reasoning_chain: list[str]  # Step-by-step logic
    key_contradictions: list[str]

    source_analysis: dict
    temporal_analysis: dict

    summary: str
    citations: list[str]
    corrected_claim: Optional[str] = None


class VerificationEngine:
    def __init__(self, retrieval_engine: HybridRetrievalEngine):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = None
        self.retrieval = retrieval_engine

    async def verify_claim(self, claim: ExtractedClaim) -> VerificationResult:
        if not self.client:
            raise Exception("GEMINI_API_KEY not provided for VerificationEngine")

        # Step 1: Retrieve evidence
        evidence = self.retrieval.retrieve(claim.claim_text)

        if not evidence:
            return self._build_unverifiable_result(claim)

        # Step 2: LLM-powered reasoning with Gemini
        verdict_analysis = await self._reason_over_evidence(claim=claim, evidence=evidence)

        verdict = Verdict(verdict_analysis.get("verdict", "UNVERIFIABLE"))

        supporting_indices = verdict_analysis.get("supporting_evidence_indices", [])
        contradicting_indices = verdict_analysis.get("contradicting_evidence_indices", [])

        supporting = [evidence[i] for i in supporting_indices if i < len(evidence)]
        contradicting = [evidence[i] for i in contradicting_indices if i < len(evidence)]

        credibility_score = self._calculate_credibility_score(
            supporting=supporting,
            contradicting=contradicting,
            verdict=verdict.value
        )

        return VerificationResult(
            claim=claim.claim_text,
            verdict=verdict,
            credibility_score=credibility_score,
            confidence=verdict_analysis.get("confidence", 0.5),
            supporting_evidence=supporting,
            contradicting_evidence=contradicting,
            reasoning_chain=verdict_analysis.get("reasoning_steps", []),
            key_contradictions=verdict_analysis.get("key_contradictions", []),
            source_analysis=self._analyze_sources(evidence),
            temporal_analysis=self._temporal_check(evidence),
            summary=verdict_analysis.get("summary", ""),
            citations=self._extract_citations(supporting[:3]),
            corrected_claim=verdict_analysis.get("corrected_claim", None)
        )

    def _build_unverifiable_result(self, claim: ExtractedClaim) -> VerificationResult:
        return VerificationResult(
            claim=claim.claim_text,
            verdict=Verdict.UNVERIFIABLE,
            credibility_score=50.0,
            confidence=0.0,
            supporting_evidence=[],
            contradicting_evidence=[],
            reasoning_chain=["No evidence retrieved."],
            key_contradictions=[],
            source_analysis={},
            temporal_analysis={},
            summary="No evidence found in registers.",
            citations=[],
            corrected_claim=None
        )

    async def _reason_over_evidence(
        self, claim: ExtractedClaim, evidence: list[dict]
    ) -> dict:

        formatted_evidence = "\n".join([
            f"[{i}] {e['source']} (Score: {e.get('final_score', 0):.2f}): {e['content']}"
            for i, e in enumerate(evidence)
        ])

        prompt = f"""
        You are an expert fact-checker and forensic analyst.
        Your job is to carefully analyze evidence and determine the truthfulness of claims.

        Be skeptical. Look for:
        - Statistical manipulation
        - Missing context
        - Source bias
        - Temporal mismatch
        - Quote distortion

        CLAIM TO VERIFY:
        "{claim.claim_text}"
        Attributed to: {claim.attributed_to}
        Time reference: {claim.temporal_reference}

        RETRIEVED EVIDENCE:
        {formatted_evidence}

        Analyze this claim step by step and return JSON with:
        - verdict: TRUE, FALSE, MISLEADING, PARTIALLY_TRUE, UNVERIFIABLE, or DISPUTED
        - confidence: float between 0.0 and 1.0
        - reasoning_steps: list of strings (step-by-step analysis)
        - summary: one paragraph explanation
        - supporting_evidence_indices: list of integers
        - contradicting_evidence_indices: list of integers
        - key_contradictions: list of strings
        - corrected_claim: string (provide the true and corrected claim with factual details, required only if the verdict is FALSE, MISLEADING, or PARTIALLY_TRUE. If the claim is TRUE, return empty string or null)
        """

        response = self.client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )
        content = response.text
        return json.loads(content) if content else {}

    def _calculate_credibility_score(
        self, supporting: list[dict], contradicting: list[dict], verdict: str
    ) -> float:

        base_scores = {
            "TRUE": 85.0,
            "PARTIALLY_TRUE": 60.0,
            "MISLEADING": 30.0,
            "FALSE": 10.0,
            "DISPUTED": 45.0,
            "UNVERIFIABLE": 50.0
        }

        score = base_scores.get(verdict, 50.0)

        if supporting:
            avg_cred = sum(
                s.get("final_score", 0.5) for s in supporting
            ) / len(supporting)
            score += (avg_cred - 0.5) * 20

        score -= len(contradicting) * 3
        return max(0.0, min(100.0, score))

    def _analyze_sources(self, evidence: list[dict]) -> dict:
        sources = [e.get("source", "unknown") for e in evidence]
        return {
            "total_sources": len(sources),
            "unique_sources": len(set(sources))
        }

    def _temporal_check(self, evidence: list[dict]) -> dict:
        return {"notes": "Temporal analysis not fully implemented."}

    def _extract_citations(self, evidence: list[dict]) -> list[str]:
        return [e.get("url", "No URL provided") for e in evidence]
