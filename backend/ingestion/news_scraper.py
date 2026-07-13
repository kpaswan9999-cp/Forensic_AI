import feedparser
import httpx
from datetime import datetime
from loguru import logger
from tenacity import retry, stop_after_attempt, wait_exponential
from bs4 import BeautifulSoup
from .models import RawDocument, SourceType, CredibilityTier


RSS_FEEDS = {
    "reuters": {
        "url": "https://feeds.reuters.com/reuters/topNews",
        "tier": CredibilityTier.HIGH
    },
    "bbc": {
        "url": "http://feeds.bbci.co.uk/news/rss.xml",
        "tier": CredibilityTier.HIGH
    },
    "ap": {
        "url": "https://feeds.apnews.com/apnews/topnews",
        "tier": CredibilityTier.HIGH
    },
    "guardian": {
        "url": "https://www.theguardian.com/world/rss",
        "tier": CredibilityTier.HIGH
    },
    "npr": {
        "url": "https://feeds.npr.org/1001/rss.xml",
        "tier": CredibilityTier.HIGH
    }
}


class NewsIngestionPipeline:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    async def fetch_rss(
        self, source_name: str, config: dict
    ) -> list[RawDocument]:
        """Fetch and parse RSS feed."""
        try:
            feed = feedparser.parse(config["url"])
            documents = []

            for entry in feed.entries[:20]:  # limit per feed
                # Parse publish date
                pub_date = datetime.now()
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    pub_date = datetime(*entry.published_parsed[:6])

                # Clean content
                content = entry.get("summary", "")
                if content:
                    soup = BeautifulSoup(content, "html.parser")
                    content = soup.get_text(separator=" ").strip()

                if len(content) < 50:
                    continue

                doc = RawDocument(
                    content=content,
                    source=source_name,
                    url=entry.get("link", ""),
                    published_at=pub_date,
                    source_type=SourceType.NEWS,
                    credibility_tier=config["tier"],
                    title=entry.get("title", ""),
                    metadata={"feed_url": config["url"]}
                )
                documents.append(doc)

            logger.info(
                f"Fetched {len(documents)} articles from {source_name}"
            )
            return documents

        except Exception as e:
            logger.error(f"Error fetching {source_name}: {e}")
            return []

    async def fetch_newsapi(
        self, api_key: str, query: str = "breaking news"
    ) -> list[RawDocument]:
        """Fetch from NewsAPI."""
        try:
            response = await self.client.get(
                "https://newsapi.org/v2/everything",
                params={
                    "q": query,
                    "language": "en",
                    "sortBy": "publishedAt",
                    "pageSize": 50,
                    "apiKey": api_key
                }
            )
            data = response.json()
            documents = []

            for article in data.get("articles", []):
                content = article.get("content") or article.get("description", "")
                if not content or len(content) < 50:
                    continue

                doc = RawDocument(
                    content=content,
                    source=article.get("source", {}).get("name", "unknown"),
                    url=article.get("url", ""),
                    published_at=datetime.fromisoformat(
                        article.get("publishedAt", datetime.now().isoformat())
                        .replace("Z", "+00:00")
                    ),
                    source_type=SourceType.NEWS,
                    credibility_tier=CredibilityTier.MEDIUM,
                    title=article.get("title", ""),
                    author=article.get("author", "")
                )
                documents.append(doc)

            return documents

        except Exception as e:
            logger.error(f"NewsAPI error: {e}")
            return []

    async def ingest_all_rss(self) -> list[RawDocument]:
        """Fetch all configured RSS feeds."""
        all_docs = []
        for source_name, config in RSS_FEEDS.items():
            docs = await self.fetch_rss(source_name, config)
            all_docs.extend(docs)
        return all_docs

    async def close(self):
        await self.client.aclose()
