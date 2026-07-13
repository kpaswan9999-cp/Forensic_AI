from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from enum import Enum


class SourceType(str, Enum):
    NEWS = "news"
    SOCIAL = "social"
    FACTCHECK = "factcheck"
    REFERENCE = "reference"
    REPORT = "report"


class CredibilityTier(int, Enum):
    HIGH = 1      # Reuters, BBC, AP, Government
    MEDIUM = 2    # Wikipedia, blogs with reputation
    LOW = 3       # Social media, anonymous sources


@dataclass
class RawDocument:
    content: str
    source: str
    url: str
    published_at: datetime
    source_type: SourceType
    credibility_tier: CredibilityTier
    title: Optional[str] = None
    author: Optional[str] = None
    language: str = "en"
    metadata: dict = field(default_factory=dict)
