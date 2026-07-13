import json
from pydantic import BaseModel
from typing import Optional
import os
from google import genai


class ExtractedClaim(BaseModel):
    claim_text: str
    attributed_to: Optional[str]
    entities: list[str]
    temporal_reference: Optional[str]
    claim_type: str  # statistical | event | quote | prediction
    is_verifiable: bool
    confidence: float


class ClaimExtractor:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = None

    async def extract_claims(self, text: str) -> list[ExtractedClaim]:
        if not self.client:
            raise Exception("GEMINI_API_KEY not provided for ClaimExtractor")

        prompt = f"""
        Analyze the following text and extract all verifiable factual claims.

        For each claim, identify:
        1. The specific claim being made
        2. Who/what it's attributed to
        3. Named entities involved
        4. Any temporal references
        5. Type of claim (statistical/event/quote/prediction)
        6. Whether it's verifiable

        Text: {text}

        Return ONLY valid JSON with a single key "claims" containing a list of objects.
        Each object must have:
        - claim_text (string)
        - attributed_to (string or null)
        - entities (list of strings)
        - temporal_reference (string or null)
        - claim_type (string)
        - is_verifiable (boolean)
        - confidence (float 0.0 to 1.0)
        """

        response = self.client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )
        content = response.text
        if not content:
            return []

        claims_data = json.loads(content)
        claims = [ExtractedClaim(**claim) for claim in claims_data.get("claims", [])]
        return claims
