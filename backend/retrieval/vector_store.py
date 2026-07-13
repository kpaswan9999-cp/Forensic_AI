import os
import uuid
from backend.ingestion.models import RawDocument

class ForensicVectorStore:
    def __init__(self):
        self.documents = []
        
    def index_documents(self, documents: list[RawDocument]):
        for doc in documents:
            self.documents.append({
                "id": str(uuid.uuid4()),
                "content": doc.content,
                "source": doc.source,
                "url": doc.url,
                "published_at": doc.published_at.isoformat(),
                "source_type": doc.source_type.value,
                "credibility_tier": doc.credibility_tier.value
            })
    
    def semantic_search(
        self, 
        query: str, 
        top_k: int = 20,
        credibility_filter: int = None
    ) -> list[dict]:
        
        # LITE MOCK VERSION: Simple word overlap instead of real vector search
        query_words = set(query.lower().split())
        
        results = []
        for doc in self.documents:
            if credibility_filter and doc["credibility_tier"] > credibility_filter:
                continue
                
            doc_words = set(doc["content"].lower().split())
            overlap = len(query_words.intersection(doc_words))
            
            # Very basic scoring
            score = overlap / len(query_words) if len(query_words) > 0 else 0
            
            if score > 0:
                results.append({
                    "content": doc["content"],
                    "source": doc["source"],
                    "url": doc["url"],
                    "score": score,
                    "credibility_tier": doc["credibility_tier"],
                    "published_at": doc["published_at"]
                })
                
        # Sort by score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]
