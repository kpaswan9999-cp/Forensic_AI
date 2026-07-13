from .vector_store import ForensicVectorStore

class HybridRetrievalEngine:
    def __init__(self, vector_store: ForensicVectorStore):
        self.vector_store = vector_store
        
        self.source_credibility_scores = {
            "reuters": 0.95,
            "bbc": 0.92,
            "ap": 0.94,
            "wikipedia": 0.80,
            "snopes": 0.88,
            "twitter": 0.30,
            "reddit": 0.25,
            "unknown": 0.10
        }
    
    def retrieve(self, claim: str, top_k: int = 10) -> list[dict]:
        
        # Stage 1: Basic text retrieval (replacing semantic search in Lite version)
        semantic_results = self.vector_store.semantic_search(
            query=claim,
            top_k=50
        )
        
        if not semantic_results:
            return []
        
        # Stage 2: Source credibility weighting (Skipping cross-encoder for Lite version)
        for result in semantic_results:
            source = result["source"].lower()
            
            cred_score = 0.10
            for key, score in self.source_credibility_scores.items():
                if key in source:
                    cred_score = score
                    break
                    
            # In lite version, result["score"] is the overlap score
            result["final_score"] = (
                result["score"] * 0.6 + 
                cred_score * 0.4
            )
        
        # Stage 3: Sort by final score
        sorted_results = sorted(
            semantic_results,
            key=lambda x: x["final_score"],
            reverse=True
        )
        
        return sorted_results[:top_k]
