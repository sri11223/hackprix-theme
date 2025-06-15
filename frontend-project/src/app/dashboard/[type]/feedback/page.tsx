// app/analyzer/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const GEMINI_API_KEY = 'AIzaSyCBSdffvU2-Kbx-Pj-nSlC6pHEgS_bnH30';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, topK: 1, topP: 1, maxOutputTokens: 1024 }
    }),
  });
  const json = await res.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export default function AnalyzerPage() {
  const [idea, setIdea] = useState('');
  const [similarJSON, setSimilarJSON] = useState('');
  const [analysisJSON, setAnalysisJSON] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    // 1. Find similar companies
    const simPrompt = `
Given the startup idea:
"${idea}"

List in JSON:
{ "similar_companies": [ { "name":"", "description":"", "similarity_percentage":0, "key_differences":"" } ... ] }
Return only JSON.
`;
    const sim = await callGemini(simPrompt);
    setSimilarJSON(sim.trim());

    // 2. Analyze idea
    const anaPrompt = `
Startup idea:
"${idea}"

Format output as JSON:
{ "uniqueness_score":, "market_potential_score":, "technical_feasibility_score":, "overall_confidence_score":,
  "explanation":"", "strengths":[...], "challenges":[...], "recommendations":[...] }
Return only JSON.
`;
    const ana = await callGemini(anaPrompt);
    setAnalysisJSON(ana.trim());
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">🚀 Startup Idea Analyzer</h1>

      <textarea
        className="w-full border p-4 rounded-lg h-40"
        placeholder="Describe your startup idea..."
        value={idea} onChange={e => setIdea(e.target.value)}
      />

      <button
        onClick={analyze}
        disabled={!idea.trim() || loading}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing…' : 'Analyze Idea'}
      </button>

      {!loading && similarJSON && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-semibold">🏢 Similar Companies</h2>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">{similarJSON}</pre>
        </motion.div>
      )}

      {!loading && analysisJSON && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-semibold">📊 Idea Analysis</h2>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">{analysisJSON}</pre>
        </motion.div>
      )}
    </div>
  );
}
