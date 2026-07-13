import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Load .env from the project root
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '..', '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env file not found, rely on process.env
  }
}

loadEnv();

const SYSTEM_PROMPT = `You are "Forensic.AI", an expert AI fact-checker and misinformation analyst.

When given a piece of text, you must:
1. Extract every distinct verifiable claim from the text.
2. For each claim, assess its truthfulness based on your knowledge.
3. Assign a verdict: "TRUE", "FALSE", "PARTIALLY_TRUE", or "MISLEADING".
4. Provide a brief analysis explaining your reasoning.
5. Assign a credibility score from 0-100 for each claim.
6. Calculate an overall credibility score (0-100) for the entire text.
7. Assign a grade: "A - Highly Credible" (85+), "B - Generally Credible" (70-84), "C - Mixed Credibility" (55-69), "D - Low Credibility" (40-54), "F - Not Credible" (0-39).
8. List risk flags if applicable (e.g., "HIGH MISINFORMATION RISK", "UNVERIFIED SOURCES", "CONTAINS MISLEADING CONTENT", "CHERRY-PICKED STATISTICS").

IMPORTANT: Respond ONLY with valid JSON in this exact format, no markdown, no code fences:
{
  "overall_score": <number 0-100>,
  "grade": "<grade string>",
  "risk_flags": ["<flag1>", "<flag2>"],
  "claims_analyzed": <number>,
  "verdict_distribution": {"TRUE": 0, "FALSE": 0, "PARTIALLY_TRUE": 0, "MISLEADING": 0},
  "detailed_results": [
    {
      "claim": "<the extracted claim text>",
      "verdict": "<TRUE|FALSE|PARTIALLY_TRUE|MISLEADING>",
      "credibility_score": <number 0-100>,
      "summary": "<2-3 sentence analysis explaining your reasoning>",
      "corrected_claim": "<the true corrected statement/context, required only if the verdict is FALSE, MISLEADING, or PARTIALLY_TRUE. If TRUE, put null or empty string>"
    }
  ]
}`;

function generateMockResponse(text: string) {
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length < 150);

  const claims = sentences.slice(0, 4);
  if (claims.length === 0) {
    claims.push(text.length > 60 ? text.substring(0, 60) + '...' : text);
  }

  const verdicts = ['TRUE', 'FALSE', 'PARTIALLY_TRUE', 'MISLEADING'];
  const detailedResults = claims.map((claim, index) => {
    const verdictIndex = (claim.length + index) % verdicts.length;
    const verdict = verdicts[verdictIndex];

    let credibilityScore = 50;
    let summary = '';
    let correctedClaim = null;
    if (verdict === 'TRUE') {
      credibilityScore = 85 + (claim.length % 15);
      summary = `(DEMO MODE - Add Gemini API Key) Public records verify the statements made in this claim.`;
    } else if (verdict === 'FALSE') {
      credibilityScore = 5 + (claim.length % 15);
      summary = `(DEMO MODE - Add Gemini API Key) Fact-checking databases directly contradict this statement.`;
      correctedClaim = `Factual sources confirm that the events did not take place as described. The true outcome is the complete opposite of this claim.`;
    } else if (verdict === 'PARTIALLY_TRUE') {
      credibilityScore = 50 + (claim.length % 20);
      summary = `(DEMO MODE - Add Gemini API Key) While the core event occurred, some details are inaccurate.`;
      correctedClaim = `The core event is factual, but official reports demonstrate that the actual metrics and timeline differ significantly from this claim.`;
    } else {
      credibilityScore = 30 + (claim.length % 20);
      summary = `(DEMO MODE - Add Gemini API Key) The statement uses misleading framing to imply an unsupported conclusion.`;
      correctedClaim = `Providing the full context reveals that key details were selectively omitted to imply a false connection.`;
    }

    return { claim, verdict, credibility_score: credibilityScore, summary, corrected_claim: correctedClaim };
  });

  const totalScore = detailedResults.reduce((acc, r) => acc + r.credibility_score, 0);
  const overallScore = Math.round(totalScore / detailedResults.length);

  let grade = 'C - Mixed Credibility';
  if (overallScore >= 85) grade = 'A - Highly Credible';
  else if (overallScore >= 70) grade = 'B - Generally Credible';
  else if (overallScore >= 55) grade = 'C - Mixed Credibility';
  else if (overallScore >= 40) grade = 'D - Low Credibility';
  else grade = 'F - Not Credible';

  const riskFlags = ['DEMO MODE - Add GEMINI_API_KEY to .env to enable real AI'];
  if (overallScore < 50) riskFlags.push('HIGH MISINFORMATION RISK');
  if (detailedResults.some(r => r.verdict === 'FALSE')) riskFlags.push('CONTAINS FALSE CLAIMS');

  return {
    overall_score: overallScore,
    grade,
    risk_flags: riskFlags,
    claims_analyzed: detailedResults.length,
    verdict_distribution: {
      TRUE: detailedResults.filter(r => r.verdict === 'TRUE').length,
      FALSE: detailedResults.filter(r => r.verdict === 'FALSE').length,
      PARTIALLY_TRUE: detailedResults.filter(r => r.verdict === 'PARTIALLY_TRUE').length,
      MISLEADING: detailedResults.filter(r => r.verdict === 'MISLEADING').length,
    },
    detailed_results: detailedResults,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text cannot be empty' }, { status: 400 });
    }

    // Attempt 1: Call FastAPI Backend
    try {
      const backendUrl = (process.env.BACKEND_API_URL || 'http://localhost:8000').replace(/\/$/, '');
      const backendResponse = await fetch(`${backendUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return NextResponse.json(data);
      }
    } catch {
      console.log('FastAPI backend unreachable. Falling back to Gemini direct call.');
    }

    // Attempt 2: Call Gemini Directly
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || geminiKey === 'your_gemini_key_here') {
      console.warn('No Gemini API key found. Returning mock response.');
      return NextResponse.json(generateMockResponse(text));
    }

    try {
      const { GoogleGenAI } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `${SYSTEM_PROMPT}\n\nAnalyze the following text for misinformation and factual claims:\n\n"${text}"`,
        config: { responseMimeType: 'application/json' },
      });

      const responseText = response.text;
      if (!responseText) throw new Error('Empty response from Gemini');

      const parsed = JSON.parse(responseText);
      return NextResponse.json(parsed);
    } catch (geminiError: any) {
      console.error('Gemini API call failed:', geminiError.message || geminiError);
      return NextResponse.json(generateMockResponse(text));
    }
  } catch (error: any) {
    console.error('API Route Fatal Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
