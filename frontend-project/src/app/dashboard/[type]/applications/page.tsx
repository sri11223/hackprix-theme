'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: 'PENDING' | 'REVIEWING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  appliedDate: string;
  lastUpdate: string;
  nextStep?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Sample applications data (replace with API call)
  const sampleApplications: Application[] = [
    {
      id: '1',
      jobTitle: 'Senior Full Stack Developer',
      company: 'TechStart AI',
      status: 'INTERVIEW',
      appliedDate: '2023-06-10',
      lastUpdate: '2023-06-14',
      nextStep: 'Technical Interview on June 16'
    },
    {
      id: '2',
      jobTitle: 'Product Manager',
      company: 'CloudSecure',
      status: 'PENDING',
      appliedDate: '2023-06-13',
      lastUpdate: '2023-06-13'
    },
    // Add more sample applications
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications(sampleApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800';
      case 'INTERVIEW':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' ? true : app.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Applications</h1>
        <p className="text-gray-600">Track your job applications and interviews</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {['All', 'Pending', 'Reviewing', 'Interview', 'Accepted'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status.toLowerCase())}
            className={`p-4 rounded-lg text-center transition-colors ${
              filter === status.toLowerCase() 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white hover:bg-indigo-50'
            }`}
          >
            <div className="font-medium">{status}</div>
            <div className="text-2xl font-bold mt-2">
              {status === 'All' 
                ? applications.length 
                : applications.filter(app => app.status === status.toUpperCase()).length}
            </div>
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-8">Loading applications...</div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map(application => (
            <div key={application.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{application.jobTitle}</h2>
                  <p className="text-gray-600">{application.company}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Applied:</span>{' '}
                  <span className="text-gray-700">{application.appliedDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Update:</span>{' '}
                  <span className="text-gray-700">{application.lastUpdate}</span>
                </div>
              </div>

              {application.nextStep && (
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
                  Next Step: {application.nextStep}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
