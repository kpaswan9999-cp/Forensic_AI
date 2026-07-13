import praw
import tweepy
from datetime import datetime
from loguru import logger
from .models import RawDocument, SourceType, CredibilityTier
import os


class SocialMediaIngestion:
    def __init__(self):
        self._init_reddit()
        self._init_twitter()

    def _init_reddit(self):
        try:
            client_id = os.getenv("REDDIT_CLIENT_ID")
            client_secret = os.getenv("REDDIT_CLIENT_SECRET")
            if client_id and client_secret:
                self.reddit = praw.Reddit(
                    client_id=client_id,
                    client_secret=client_secret,
                    user_agent="AIForensicInvestigator/1.0"
                )
            else:
                self.reddit = None
                logger.warning("Reddit API credentials not found.")
        except Exception as e:
            logger.warning(f"Reddit init failed: {e}")
            self.reddit = None

    def _init_twitter(self):
        try:
            bearer_token = os.getenv("TWITTER_BEARER_TOKEN")
            if bearer_token:
                self.twitter = tweepy.Client(
                    bearer_token=bearer_token
                )
            else:
                self.twitter = None
                logger.warning("Twitter API credentials not found.")
        except Exception as e:
            logger.warning(f"Twitter init failed: {e}")
            self.twitter = None

    def fetch_reddit_posts(
        self,
        subreddits: list[str] = ["worldnews", "news"],
        limit: int = 50
    ) -> list[RawDocument]:
        """Fetch trending Reddit posts."""
        if not self.reddit:
            return []

        documents = []
        for subreddit_name in subreddits:
            try:
                subreddit = self.reddit.subreddit(subreddit_name)
                for post in subreddit.hot(limit=limit):
                    content = f"{post.title}. {post.selftext}"
                    if len(content.strip()) < 30:
                        continue

                    doc = RawDocument(
                        content=content[:2000],
                        source=f"reddit/{subreddit_name}",
                        url=f"https://reddit.com{post.permalink}",
                        published_at=datetime.fromtimestamp(
                            post.created_utc
                        ),
                        source_type=SourceType.SOCIAL,
                        credibility_tier=CredibilityTier.LOW,
                        title=post.title,
                        metadata={
                            "upvotes": post.score,
                            "comments": post.num_comments,
                            "subreddit": subreddit_name
                        }
                    )
                    documents.append(doc)

            except Exception as e:
                logger.error(f"Reddit error for r/{subreddit_name}: {e}")

        logger.info(f"Fetched {len(documents)} Reddit posts")
        return documents

    def fetch_tweets(
        self,
        query: str = "breaking news -is:retweet lang:en",
        max_results: int = 100
    ) -> list[RawDocument]:
        """Fetch recent tweets."""
        if not self.twitter:
            return []

        documents = []
        try:
            tweets = self.twitter.search_recent_tweets(
                query=query,
                max_results=min(max_results, 100),
                tweet_fields=["created_at", "author_id", "public_metrics"]
            )

            if not tweets.data:
                return []

            for tweet in tweets.data:
                if len(tweet.text) < 50:
                    continue

                metrics = tweet.public_metrics or {}
                doc = RawDocument(
                    content=tweet.text,
                    source="twitter",
                    url=f"https://twitter.com/i/web/status/{tweet.id}",
                    published_at=tweet.created_at or datetime.now(),
                    source_type=SourceType.SOCIAL,
                    credibility_tier=CredibilityTier.LOW,
                    metadata={
                        "retweets": metrics.get("retweet_count", 0),
                        "likes": metrics.get("like_count", 0),
                        "replies": metrics.get("reply_count", 0)
                    }
                )
                documents.append(doc)

        except Exception as e:
            logger.error(f"Twitter fetch error: {e}")

        logger.info(f"Fetched {len(documents)} tweets")
        return documents
