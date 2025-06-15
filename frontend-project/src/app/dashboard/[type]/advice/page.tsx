'use client';
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AdvicePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI career advisor. I can help you with:\n- Career planning\n- Resume reviews\n- Interview preparation\n- Skill development\n\nWhat would you like to discuss?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };

  // Sample AI responses based on keywords (replace with actual AI integration)
  const getAIResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('resume')) {
      return "Here are some tips for your resume:\n1. Keep it concise and well-structured\n2. Highlight quantifiable achievements\n3. Use action verbs\n4. Tailor it to each job application\n5. Include relevant keywords\n\nWould you like me to review your resume in detail?";
    }
    
    if (lowerMessage.includes('interview')) {
      return "To prepare for interviews:\n1. Research the company thoroughly\n2. Practice common questions\n3. Prepare STAR method responses\n4. Have questions ready for the interviewer\n5. Review the job description\n\nWould you like to do a mock interview?";
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
      return "Based on current market trends, these skills are in high demand:\n1. AI/Machine Learning\n2. Cloud Computing\n3. Data Analysis\n4. Full Stack Development\n5. DevOps\n\nWhich area interests you most?";
    }

    return "I can help you with career planning, resume reviews, interview preparation, and skill development. What specific aspect would you like to focus on?";
  };

  return (
    <div className="h-[calc(100vh-10rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Career Advisor</h1>
        <p className="text-gray-600">Get personalized career guidance and advice</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm h-[calc(100%-6rem)] flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for career advice..."
              className="flex-1 p-3 border rounded-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
