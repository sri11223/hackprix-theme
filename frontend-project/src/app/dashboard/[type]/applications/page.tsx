'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Briefcase, CalendarCheck, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

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
    {
      id: '3',
      jobTitle: 'UI/UX Designer',
      company: 'Creative Box',
      status: 'REVIEWING',
      appliedDate: '2023-06-01',
      lastUpdate: '2023-06-11',
      nextStep: 'Portfolio review in progress'
    },
    {
      id: '4',
      jobTitle: 'DevOps Engineer',
      company: 'InfraFlow Inc.',
      status: 'REJECTED',
      appliedDate: '2023-05-20',
      lastUpdate: '2023-06-02'
    },
    {
      id: '5',
      jobTitle: 'Machine Learning Engineer',
      company: 'DataCrux',
      status: 'ACCEPTED',
      appliedDate: '2023-05-15',
      lastUpdate: '2023-06-01',
      nextStep: 'Offer Letter Sent'
    },
    {
      id: '6',
      jobTitle: 'Business Analyst',
      company: 'BizMetrics Inc.',
      status: 'REVIEWING',
      appliedDate: '2023-06-02',
      lastUpdate: '2023-06-07',
      nextStep: 'HR reviewing background information'
    },
    {
      id: '7',
      jobTitle: 'Front-End Developer',
      company: 'PixelPro',
      status: 'PENDING',
      appliedDate: '2023-06-11',
      lastUpdate: '2023-06-11'
    },
    {
      id: '8',
      jobTitle: 'Technical Writer',
      company: 'DocuChain',
      status: 'REJECTED',
      appliedDate: '2023-05-22',
      lastUpdate: '2023-06-01'
    },
    {
      id: '9',
      jobTitle: 'Cloud Architect',
      company: 'SkyHigh Systems',
      status: 'ACCEPTED',
      appliedDate: '2023-05-10',
      lastUpdate: '2023-06-05',
      nextStep: 'Contract Negotiation Phase'
    },
    {
      id: '10',
      jobTitle: 'Data Analyst',
      company: 'InsightIQ',
      status: 'INTERVIEW',
      appliedDate: '2023-06-05',
      lastUpdate: '2023-06-12',
      nextStep: 'Final Interview on June 20'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setApplications(sampleApplications);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWING': return 'bg-blue-100 text-blue-800';
      case 'INTERVIEW': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => filter === 'all' ? true : app.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Application Dashboard</h1>
        <p className="text-gray-600">Monitor the status and journey of your job applications</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {['All', 'Pending', 'Reviewing', 'Interview', 'Accepted'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status.toLowerCase())}
            className={`p-4 rounded-xl shadow-sm border transition-colors text-sm font-medium text-center ${filter === status.toLowerCase() ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 hover:bg-indigo-50'}`}
          >
            <div className="mb-1 flex items-center justify-center gap-2">
              {status === 'All' && <Eye size={18} />}
              {status === 'Pending' && <Clock size={18} />}
              {status === 'Reviewing' && <Briefcase size={18} />}
              {status === 'Interview' && <CalendarCheck size={18} />}
              {status === 'Accepted' && <CheckCircle size={18} />}
              <span>{status}</span>
            </div>
            <div className="text-xl font-bold">
              {status === 'All'
                ? applications.length
                : applications.filter(app => app.status === status.toUpperCase()).length}
            </div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading applications...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No applications found for this filter.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredApplications.map(application => (
            <div key={application.id} className="bg-white border p-6 rounded-xl shadow hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{application.jobTitle}</h2>
                  <p className="text-gray-500">{application.company}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div><strong>Applied:</strong> {application.appliedDate}</div>
                <div><strong>Last Update:</strong> {application.lastUpdate}</div>
                {application.nextStep && (
                  <div className="mt-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    <strong>Next Step:</strong> {application.nextStep}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
