// app/analyzer/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { API_ENDPOINTS, getAuthHeaders } from '@/lib/api-config';

export default function AnalyzerPage() {
  const [idea, setIdea] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    setLoading(true);
    setError('');
    const token = Cookies.get('token') || '';

    try {
      // 1. Pitch readiness evaluation via backend AI
      const evalRes = await fetch(API_ENDPOINTS.AI.EVALUATE_PITCH_SYNC, {
        method: 'POST',
        headers: getAuthHeaders(token),
        credentials: 'include',
        body: JSON.stringify({ idea, description: idea }),
      });
      if (!evalRes.ok) throw new Error('Pitch evaluation failed');
      const evalData = await evalRes.json();
      setEvaluation(evalData);

      // 2. Market signal analysis via backend AI
      const marketRes = await fetch(API_ENDPOINTS.AI.MARKET_ANALYSIS_SYNC, {
        method: 'POST',
        headers: getAuthHeaders(token),
        credentials: 'include',
        body: JSON.stringify({ idea, domain: 'technology' }),
      });
      if (!marketRes.ok) throw new Error('Market analysis failed');
      const marketData = await marketRes.json();
      setMarketAnalysis(marketData);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const ScoreBar = ({ label, score, max = 100 }: { label: string; score: number; max?: number }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-indigo-600 font-bold">{score}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${(score / max) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">Startup Idea Analyzer</h1>
      <p className="text-gray-500">AI-powered pitch readiness and market signal evaluation</p>

      <textarea
        className="w-full border p-4 rounded-lg h-40 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Describe your startup idea in detail..."
        value={idea} onChange={e => setIdea(e.target.value)}
      />

      <button
        onClick={analyze}
        disabled={!idea.trim() || loading}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {loading ? 'Analyzing with AI...' : 'Analyze Idea'}
      </button>

      {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}

      {!loading && evaluation && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">Pitch Readiness</h2>
          <ScoreBar label="Readiness Score" score={evaluation.readinessScore} />
          <ScoreBar label="Investability Score" score={evaluation.investabilityScore} />
          {evaluation.pitchQuality && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <ScoreBar label="Clarity" score={evaluation.pitchQuality.clarity} max={10} />
              <ScoreBar label="Market Fit" score={evaluation.pitchQuality.marketFit} max={10} />
              <ScoreBar label="Team Credibility" score={evaluation.pitchQuality.teamCredibility} max={10} />
              <ScoreBar label="Financial Viability" score={evaluation.pitchQuality.financialViability} max={10} />
              <ScoreBar label="Scalability" score={evaluation.pitchQuality.scalability} max={10} />
            </div>
          )}
          <p className="text-lg font-medium text-gray-800 bg-indigo-50 p-3 rounded-lg">{evaluation.verdict}</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
              <ul className="text-sm space-y-1">{evaluation.strengths?.map((s: string, i: number) => <li key={i} className="text-gray-600">+ {s}</li>)}</ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-2">Weaknesses</h3>
              <ul className="text-sm space-y-1">{evaluation.weaknesses?.map((w: string, i: number) => <li key={i} className="text-gray-600">- {w}</li>)}</ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Recommendations</h3>
              <ul className="text-sm space-y-1">{evaluation.recommendations?.map((r: string, i: number) => <li key={i} className="text-gray-600">→ {r}</li>)}</ul>
            </div>
          </div>
        </motion.div>
      )}

      {!loading && marketAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">Market Signals</h2>
          <div className="grid grid-cols-2 gap-4">
            <ScoreBar label="Market Score" score={marketAnalysis.marketScore} />
            <ScoreBar label="Success Probability" score={marketAnalysis.successProbability} />
            <ScoreBar label="Risk Score" score={marketAnalysis.riskScore} />
          </div>
          {marketAnalysis.signals && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {Object.entries(marketAnalysis.signals).map(([key, val]: [string, any]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                    <span className={`text-sm px-2 py-0.5 rounded ${val.trend === 'rising' || val.trend === 'hot' || val.trend === 'optimal' ? 'bg-green-100 text-green-700' : val.trend === 'declining' || val.trend === 'cold' || val.trend === 'late' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{val.trend}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{val.insight}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <div className="flex-1 bg-orange-50 p-3 rounded-lg">
              <h3 className="font-semibold text-orange-700 mb-2">Risks</h3>
              <ul className="text-sm space-y-1">{marketAnalysis.potentialFailures?.map((r: string, i: number) => <li key={i} className="text-gray-600">⚠ {r}</li>)}</ul>
            </div>
            <div className="flex-1 bg-green-50 p-3 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Mitigations</h3>
              <ul className="text-sm space-y-1">{marketAnalysis.mitigationStrategies?.map((s: string, i: number) => <li key={i} className="text-gray-600">✓ {s}</li>)}</ul>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Recommendation: <span className="font-bold uppercase text-indigo-600">{marketAnalysis.recommendation}</span></p>
        </motion.div>
      )}
    </div>
  );
}
