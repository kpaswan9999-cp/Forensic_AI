import feedparser
import httpx
import os
from datetime import datetime
from loguru import logger
from .models import RawDocument, SourceType, CredibilityTier


class FactCheckFetcher:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)

    async def fetch_snopes(self) -> list[RawDocument]:
        """Fetch latest Snopes fact checks via RSS."""
        feed_url = "https://www.snopes.com/feed/"
        documents = []
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:20]:
                pub_date = datetime.now()
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    pub_date = datetime(*entry.published_parsed[:6])

                content = entry.get("summary", "")
                if not content:
                    continue

                doc = RawDocument(
                    content=content,
                    source="snopes",
                    url=entry.get("link", ""),
                    published_at=pub_date,
                    source_type=SourceType.FACTCHECK,
                    credibility_tier=CredibilityTier.HIGH,
                    title=entry.get("title", "")
                )
                documents.append(doc)

            logger.info(f"Fetched {len(documents)} fact checks from Snopes")
        except Exception as e:
            logger.error(f"Snopes fetch error: {e}")
            
        return documents

    async def fetch_claimbuster(self, text: str) -> dict:
        """Fetch fact check score for a text from ClaimBuster."""
        api_key = os.getenv("CLAIMBUSTERS_API_KEY")
        if not api_key:
            logger.warning("ClaimBusters API key not found")
            return {}

        try:
            url = f"https://idir.uta.edu/claimbuster/api/v2/score/text/{text}"
            response = await self.client.get(
                url,
                headers={"x-api-key": api_key}
            )
            return response.json()
        except Exception as e:
            logger.error(f"ClaimBuster fetch error: {e}")
            return {}

    async def close(self):
        await self.client.aclose()
