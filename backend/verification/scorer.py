from backend.verification.reasoning_engine import VerificationResult

class ForensicScorer:
    def compute_full_report_score(
        self, 
        results: list[VerificationResult]
    ) -> dict:
        
        if not results:
            return {"overall_score": 0, "verdict": "UNVERIFIABLE"}
        
        scores = [r.credibility_score for r in results]
        verdicts = [r.verdict.value for r in results]
        
        overall_score = sum(scores) / len(scores)
        
        # Verdict distribution
        verdict_counts = {}
        for v in verdicts:
            verdict_counts[v] = verdict_counts.get(v, 0) + 1
        
        # Risk flags
        risk_flags = []
        if overall_score < 30:
            risk_flags.append("HIGH MISINFORMATION RISK")
        if "FALSE" in verdicts:
            risk_flags.append("CONTAINS VERIFIED FALSE CLAIMS")
        if "MISLEADING" in verdicts:
            risk_flags.append("CONTAINS MISLEADING CONTENT")
        
        return {
            "overall_credibility_score": round(overall_score, 2),
            "claims_analyzed": len(results),
            "verdict_distribution": verdict_counts,
            "risk_flags": risk_flags,
            "reliability_grade": self._score_to_grade(overall_score),
            # Instead of full detailed objects, we might want to return dicts or just the score.
            # We will handle formatting in the main API layer.
        }
    
    def _score_to_grade(self, score: float) -> str:
        if score >= 85: return "A - Highly Credible"
        elif score >= 70: return "B - Generally Credible"
        elif score >= 55: return "C - Mixed Credibility"
        elif score >= 40: return "D - Low Credibility"
        else: return "F - High Risk / Likely False"
