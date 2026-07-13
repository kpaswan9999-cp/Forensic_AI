from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
from datetime import datetime

from backend.extraction.claim_extractor import ClaimExtractor, ExtractedClaim
from backend.retrieval.vector_store import ForensicVectorStore
from backend.retrieval.hybrid_retriever import HybridRetrievalEngine
from backend.verification.reasoning_engine import VerificationEngine, VerificationResult, Verdict
from backend.verification.scorer import ForensicScorer
from backend.ingestion.models import RawDocument, SourceType, CredibilityTier

app = FastAPI(
    title="AI Forensic Investigator API (Lite)",
    description="API for fact checking and verifying claims (No-Docker Mode)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

extractor = None
vector_store = None
retrieval_engine = None
verification_engine = None
scorer = None
has_openai_key = False

@app.on_event("startup")
async def startup_event():
    global extractor, vector_store, retrieval_engine, verification_engine, scorer, has_openai_key
    
    key = os.getenv("GEMINI_API_KEY")
    if key and key != "your_gemini_key_here":
        has_openai_key = True
        
    try:
        extractor = ClaimExtractor()
        vector_store = ForensicVectorStore()
        
        # Seed the memory store with dummy facts for testing!
        dummy_docs = [
            RawDocument(
                content="The Bureau of Labor Statistics reported today that the unemployment rate is currently at 3.7%.",
                source="apnews.com",
                url="https://apnews.com",
                published_at=datetime.now(),
                source_type=SourceType.NEWS,
                credibility_tier=CredibilityTier.HIGH
            ),
            RawDocument(
                content="The president signed the new infrastructure bill on Monday morning at the White House.",
                source="reuters.com",
                url="https://reuters.com",
                published_at=datetime.now(),
                source_type=SourceType.NEWS,
                credibility_tier=CredibilityTier.HIGH
            )
        ]
        vector_store.index_documents(dummy_docs)
        print(f"Seeded vector store with {len(dummy_docs)} documents.")
        
        retrieval_engine = HybridRetrievalEngine(vector_store)
        verification_engine = VerificationEngine(retrieval_engine)
        scorer = ForensicScorer()
        
        print(f"Successfully initialized all engines. Using Real AI: {has_openai_key}")
    except Exception as e:
        print(f"Warning: Failed to initialize some engines: {e}")


class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    overall_score: float
    grade: str
    risk_flags: List[str]
    claims_analyzed: int
    verdict_distribution: Dict[str, int]
    detailed_results: List[Any]


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest):
    if not request.text or len(request.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
        
    try:
        # Mock mode if no real OpenAI key
        if not has_openai_key:
            return _mock_analyze_response(request.text)
            
        # Step 1: Extract claims
        claims = await extractor.extract_claims(request.text)
        
        if not claims:
            return AnalyzeResponse(
                overall_score=0.0,
                grade="UNVERIFIABLE",
                risk_flags=["NO_CLAIMS_FOUND"],
                claims_analyzed=0,
                verdict_distribution={},
                detailed_results=[]
            )
            
        # Step 2: Verify each claim
        verification_results = []
        for claim in claims:
            if claim.is_verifiable:
                result = await verification_engine.verify_claim(claim)
                verification_results.append(result)
                
        # Step 3: Compute overall report score
        report = scorer.compute_full_report_score(verification_results)
        
        return AnalyzeResponse(
            overall_score=report["overall_credibility_score"],
            grade=report["reliability_grade"],
            risk_flags=report["risk_flags"],
            claims_analyzed=report["claims_analyzed"],
            verdict_distribution=report["verdict_distribution"],
            detailed_results=[r.dict() for r in verification_results]
        )
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

def _mock_analyze_response(text: str) -> AnalyzeResponse:
    import random
    
    # We create a random mock result based on the text just to show the API working natively
    score = random.randint(10, 95)
    grade = "A" if score > 80 else "B" if score > 60 else "C" if score > 40 else "D"
    
    mock_claim = VerificationResult(
        claim=text[:50] + "...",
        verdict=Verdict.PARTIALLY_TRUE,
        credibility_score=score,
        confidence=0.8,
        supporting_evidence=[],
        contradicting_evidence=[],
        reasoning_chain=["(MOCK DATA - No API Key) The system analyzed the text.", "Found partial evidence."],
        key_contradictions=[],
        source_analysis={},
        temporal_analysis={},
        summary="This is a dynamically generated MOCK response because no OpenAI API key was found in the .env file. The backend successfully received your input: " + text[:50],
        citations=[]
    )
    
    report = scorer.compute_full_report_score([mock_claim])
    return AnalyzeResponse(
        overall_score=report["overall_credibility_score"],
        grade=report["reliability_grade"],
        risk_flags=report["risk_flags"],
        claims_analyzed=report["claims_analyzed"],
        verdict_distribution=report["verdict_distribution"],
        detailed_results=[mock_claim.dict()]
    )

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
