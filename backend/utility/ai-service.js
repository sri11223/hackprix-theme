// AI Service - Server-side Gemini API integration
// Keeps API key on backend, never exposed to frontend
const dotenv = require('dotenv');
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt, options = {}) {
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key not configured - AI features disabled');
        return null;
    }

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: 1,
                topP: 1,
                maxOutputTokens: options.maxTokens || 2048,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');
    return text;
}

function parseJSON(text) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    if (start === -1 || end === 0) throw new Error('No JSON found in response');
    return JSON.parse(text.slice(start, end));
}

// Evaluate startup pitch readiness
async function evaluatePitchReadiness(pitchData) {
    const prompt = `You are an expert startup pitch evaluator and VC analyst. Evaluate this startup pitch:

Company: ${pitchData.companyName || 'Unknown'}
Idea: ${pitchData.idea || pitchData.description}
Business Model: ${pitchData.businessModel || 'Not specified'}
Market Size: ${pitchData.marketSize || 'Not specified'}
Stage: ${pitchData.stage || 'Not specified'}
Team Size: ${pitchData.teamSize || 'Not specified'}
Funding Ask: ${pitchData.fundingAsk || 'Not specified'}

Return ONLY valid JSON:
{
  "readinessScore": <number 0-100>,
  "investabilityScore": <number 0-100>,
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "recommendations": ["<rec1>", "<rec2>", "<rec3>"],
  "pitchQuality": {
    "clarity": <number 0-10>,
    "marketFit": <number 0-10>,
    "teamCredibility": <number 0-10>,
    "financialViability": <number 0-10>,
    "scalability": <number 0-10>
  },
  "verdict": "<one-sentence verdict>",
  "comparableCompanies": ["<company1>", "<company2>"]
}`;

    const result = await callGemini(prompt);
    return parseJSON(result);
}

// Analyze market signals for a startup domain
async function analyzeMarketSignals(marketData) {
    const prompt = `You are a market intelligence analyst. Analyze market signals for this startup:

Domain: ${marketData.domain || marketData.industry}
Business Idea: ${marketData.idea}
Target Market: ${marketData.targetMarket || 'Global'}
Competition Level: ${marketData.competition || 'Unknown'}

Return ONLY valid JSON:
{
  "marketScore": <number 0-100>,
  "signals": {
    "demand": {"score": <0-10>, "trend": "rising|stable|declining", "insight": "<text>"},
    "competition": {"score": <0-10>, "trend": "rising|stable|declining", "insight": "<text>"},
    "timing": {"score": <0-10>, "trend": "early|optimal|late", "insight": "<text>"},
    "investment_climate": {"score": <0-10>, "trend": "hot|warm|cold", "insight": "<text>"}
  },
  "riskScore": <number 0-100>,
  "successProbability": <number 0-100>,
  "potentialFailures": ["<risk1>", "<risk2>", "<risk3>"],
  "mitigationStrategies": ["<strategy1>", "<strategy2>", "<strategy3>"],
  "timelineProjection": "<text>",
  "recommendation": "<invest|watch|avoid>"
}`;

    const result = await callGemini(prompt);
    return parseJSON(result);
}

// Real-time pitch feedback (lightweight, for WebSocket speed)
async function quickPitchFeedback(statement) {
    const prompt = `As a VC analyst, give instant feedback on this pitch statement in under 50 words. Rate confidence 1-10.

"${statement}"

Return ONLY JSON: {"score": <1-10>, "feedback": "<brief feedback>", "suggestion": "<one improvement>"}`;

    const result = await callGemini(prompt, { temperature: 0.5, maxTokens: 256 });
    return parseJSON(result);
}

module.exports = {
    callGemini,
    evaluatePitchReadiness,
    analyzeMarketSignals,
    quickPitchFeedback,
};
