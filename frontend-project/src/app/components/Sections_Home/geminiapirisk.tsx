// components/GeminiRiskAnalyzer.tsx
'use client';
import { useState } from 'react';

const GEMINI_API_KEY = 'AIzaSyCBSdffvU2-Kbx-Pj-nSlC6pHEgS_bnH30';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

type RiskAnalysis = {
  riskScore: number;
  potentialFailures: string[];
  mitigationStrategies: string[];
  successProbability: number;
  comparativeAnalysis: {
    sectorAverage: number;
    competitorComparison: string;
    marketFit: string;
  };
  timelineProjection: string;
};

export default function GeminiRiskAnalyzer() {
  const [formData, setFormData] = useState({
    businessIdea: '',
    businessModel: '',
    marketSize: '',
    competition: '',
    teamExperience: '',
    fundingStatus: '',
    financialProjections: ''
  });
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const analyzeWithGemini = async () => {
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      // Prepare the prompt for Gemini
      const prompt = `
        Analyze this startup and provide a detailed risk assessment in JSON format:
        
        Business Idea: ${formData.businessIdea}
        Business Model: ${formData.businessModel}
        Market Size: ${formData.marketSize}
        Competition: ${formData.competition}
        Team Experience: ${formData.teamExperience}
        Funding Status: ${formData.fundingStatus}
        Financial Projections: ${formData.financialProjections}

        Return a JSON response with these fields:
        {
          "riskScore": number (1-10),
          "potentialFailures": string[] (top 3 risks),
          "mitigationStrategies": string[] (top 3 recommendations),
          "successProbability": number (0-100),
          "comparativeAnalysis": {
            "sectorAverage": number,
            "competitorComparison": string,
            "marketFit": string
          },
          "timelineProjection": string
        }

        Only return valid JSON, no additional text.
      `;

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      // Extract the JSON response from Gemini's text
      const responseText = data.candidates[0].content.parts[0].text;
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      const jsonResponse = responseText.slice(jsonStart, jsonEnd);
      
      const result = JSON.parse(jsonResponse);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze startup. Please try again.');
      console.error('Gemini API error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        Gemini AI Startup Risk Analyzer
      </h1>
      
      {/* Input Form */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Idea *
          </label>
          <textarea
            name="businessIdea"
            value={formData.businessIdea}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Describe your business idea..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Model *
            </label>
            <input
              type="text"
              name="businessModel"
              value={formData.businessModel}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="How will you make money?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Market Size *
            </label>
            <input
              type="text"
              name="marketSize"
              value={formData.marketSize}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Estimated market size (e.g., $1B)"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Competition Analysis *
          </label>
          <textarea
            name="competition"
            value={formData.competition}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={2}
            placeholder="Who are your main competitors?"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Experience *
            </label>
            <input
              type="text"
              name="teamExperience"
              value={formData.teamExperience}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Team's relevant experience"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funding Status *
            </label>
            <input
              type="text"
              name="fundingStatus"
              value={formData.fundingStatus}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Current funding stage/amount"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Financial Projections
          </label>
          <textarea
            name="financialProjections"
            value={formData.financialProjections}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={2}
            placeholder="Revenue projections, burn rate, etc."
          />
        </div>

        <button
          onClick={analyzeWithGemini}
          disabled={loading || !formData.businessIdea || !formData.businessModel}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing with Model...
            </span>
          ) : 'Analyze Startup Risk'}
        </button>
      </div>

      {/* Results Section */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Gemini AI Analysis Results</h2>
          
          {/* Risk Score Card */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Overall Risk Assessment</h3>
            <div className="flex items-center space-x-4">
              <div className={`text-5xl font-bold ${
                analysis.riskScore <= 3 ? 'text-green-600' : 
                analysis.riskScore <= 7 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysis.riskScore}
                <span className="text-2xl text-gray-500">/10</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {analysis.riskScore <= 3 ? 'Low Risk' : 
                   analysis.riskScore <= 7 ? 'Medium Risk' : 'High Risk'} Startup
                </p>
                <p className="text-lg">
                  Success Probability: <span className="font-bold">{analysis.successProbability}%</span>
                </p>
              </div>
            </div>
          </div>

          {/* Comparative Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Market Fit</h3>
              <p className="text-lg">{analysis.comparativeAnalysis.marketFit}</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Sector Average</h3>
              <p className="text-lg">{analysis.comparativeAnalysis.sectorAverage}% success rate</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Competitor Comparison</h3>
              <p className="text-lg">{analysis.comparativeAnalysis.competitorComparison}</p>
            </div>
          </div>

          {/* Potential Failures */}
          <div className="border rounded-lg p-4 bg-red-50">
            <h3 className="font-semibold text-red-800 mb-2">Top Risks Identified</h3>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.potentialFailures.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>

          {/* Mitigation Strategies */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-800 mb-2">Recommended Mitigations</h3>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.mitigationStrategies.map((strategy, i) => (
                <li key={i}>{strategy}</li>
              ))}
            </ul>
          </div>

          {/* Timeline Projection */}
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="font-semibold text-green-800 mb-2">Projected Timeline</h3>
            <p>{analysis.timelineProjection}</p>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>Analysis powered by Google's Gemini AI. Results are AI-generated and should be validated with human experts.</p>
      </div>
    </div>
  );
}