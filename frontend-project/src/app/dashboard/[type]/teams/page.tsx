'use client';
import { useState } from 'react';

interface Team {
  id: string;
  startupName: string;
  logo: string;
  role: string;
  description: string;
  requirements: string[];
  equity: string;
  stage: string;
  location: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      startupName: 'TechStart AI',
      logo: '🤖',
      role: 'Lead Developer',
      description: 'Join our core team to build the next generation AI platform...',
      requirements: ['5+ years in full-stack', 'AI/ML experience', 'Team leadership'],
      equity: '2-3%',
      stage: 'Seed',
      location: 'Remote'
    },
    {
      id: '2',
      startupName: 'GreenEnergy',
      logo: '🌱',
      role: 'Technical Co-Founder',
      description: 'Looking for a technical co-founder to revolutionize renewable energy...',
      requirements: ['Clean tech background', 'Architecture skills', 'Startup experience'],
      equity: '15-20%',
      stage: 'Pre-seed',
      location: 'San Francisco'
    }
  ]);

  const [filter, setFilter] = useState('all');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Join Startup Teams</h1>
        <p className="text-gray-600">Find co-founding and early team opportunities</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select 
          className="p-3 border rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="cofounder">Co-Founder</option>
          <option value="tech">Technical</option>
          <option value="business">Business</option>
        </select>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{team.logo}</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{team.startupName}</h2>
                  <p className="text-indigo-600 font-medium">{team.role}</p>
                </div>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Apply
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">{team.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Requirements</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {team.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Equity: </span>
                    <span className="text-gray-600">{team.equity}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Stage: </span>
                    <span className="text-gray-600">{team.stage}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Location: </span>
                    <span className="text-gray-600">{team.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {team.stage}
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {team.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
