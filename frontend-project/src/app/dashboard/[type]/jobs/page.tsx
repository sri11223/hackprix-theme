'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useSocket } from '@/hooks/useSocket';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  skills: string[];
  description: string;
  posted: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    experience: '',
    salary: ''
  });

  const socket = useSocket();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    // Listen for real-time job updates
    socket?.on('jobAdded', (newJob: Job) => {
      setJobs(prevJobs => [...prevJobs, newJob]);
    });

    socket?.on('jobUpdated', (updatedJob: Job) => {
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === updatedJob.id ? updatedJob : job
      ));
    });

    socket?.on('jobRemoved', (jobId: string) => {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    });

    return () => {
      socket?.off('jobAdded');
      socket?.off('jobUpdated');
      socket?.off('jobRemoved');
    };
  }, [socket]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !filters.type || job.type.toLowerCase() === filters.type.toLowerCase();
    const matchesSalary = !filters.salary || matchesSalaryRange(job.salary, filters.salary);

    return matchesSearch && matchesType && matchesSalary;
  });

  const matchesSalaryRange = (salary: string, filter: string) => {
    const salaryNum = parseInt(salary.replace(/[^0-9]/g, ''));
    switch (filter) {
      case '0-50':
        return salaryNum <= 50000;
      case '50-100':
        return salaryNum > 50000 && salaryNum <= 100000;
      case '100+':
        return salaryNum > 100000;
      default:
        return true;
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({ jobId })
      });

      if (!response.ok) throw new Error('Failed to apply for job');
      
      // Show success message
      // TODO: Add a toast notification here
      
    } catch (error) {
      console.error('Error applying for job:', error);
      // Show error message
      // TODO: Add a toast notification here
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Your Next Role</h1>
        <p className="text-gray-600">Discover opportunities at fast-growing startups</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search jobs..."
          className="flex-grow p-3 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="p-3 border rounded-lg"
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">Job Type</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
        </select>
        <select 
          className="p-3 border rounded-lg"
          value={filters.experience}
          onChange={(e) => setFilters({...filters, experience: e.target.value})}
        >
          <option value="">Experience</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
        </select>
        <select 
          className="p-3 border rounded-lg"
          value={filters.salary}
          onChange={(e) => setFilters({...filters, salary: e.target.value})}
        >
          <option value="">Salary Range</option>
          <option value="0-50">$0 - $50k</option>
          <option value="50-100">$50k - $100k</option>
          <option value="100+">$100k+</option>
        </select>
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="text-center py-8">Loading jobs...</div>
      ) : (
        <div className="grid gap-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                  <p className="text-gray-600">{job.company} • {job.location}</p>
                </div>
                <button 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  onClick={() => handleApply(job.id)}
                >
                  Apply
                </button>
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm mr-2">
                  {job.type}
                </span>
                <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {job.salary}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-600">{job.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Posted {job.posted}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
