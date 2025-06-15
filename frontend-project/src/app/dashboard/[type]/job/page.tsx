'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiBriefcase, FiUser, FiMail, FiMessageSquare, 
  FiStar, FiFilter, FiX, FiPlus, FiCheck, FiExternalLink,
  FiBookmark, FiShare2, FiDollarSign, FiMapPin, FiClock
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  avatar: string;
  university: string;
  major: string;
  skills: string[];
  experience: string;
  location: string;
  availability: string;
  rating: number;
  projects: {
    title: string;
    description: string;
  }[];
  bio: string;
  contact: string;
}

interface JobPosting {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  salary: string;
  postedDate: string;
  applications: number;
  status: 'open' | 'closed';
}

const TalentHub = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'students' | 'jobs' | 'messages'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: '',
    availability: '',
    rating: 0
  });
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    skillsRequired: [] as string[],
    location: '',
    type: 'internship' as 'full-time' | 'part-time' | 'internship' | 'contract',
    salary: ''
  });
  const [message, setMessage] = useState('');

  // Sample data
  const students: Student[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: '/avatars/student1.jpg',
      university: 'Stanford University',
      major: 'Computer Science',
      skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
      experience: '2 years',
      location: 'San Francisco, CA',
      availability: 'Immediate',
      rating: 4.8,
      projects: [
        {
          title: 'AI Chatbot for Education',
          description: 'Developed a chatbot using NLP to assist students with coursework'
        },
        {
          title: 'E-commerce Platform',
          description: 'Full-stack development of a sustainable fashion marketplace'
        }
      ],
      bio: 'Passionate full-stack developer with focus on AI applications. Looking for impactful internship opportunities.',
      contact: 'alex.j@stanford.edu'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      avatar: '/avatars/student2.jpg',
      university: 'MIT',
      major: 'Data Science',
      skills: ['Python', 'SQL', 'TensorFlow', 'Data Visualization'],
      experience: '1.5 years',
      location: 'Boston, MA',
      availability: 'Summer 2023',
      rating: 4.6,
      projects: [
        {
          title: 'Predictive Analytics for Healthcare',
          description: 'Developed models to predict patient readmission rates'
        }
      ],
      bio: 'Data science enthusiast with healthcare domain expertise. Strong statistical modeling background.',
      contact: 'mgarcia@mit.edu'
    },
    {
      id: '3',
      name: 'Jamal Williams',
      avatar: '/avatars/student3.jpg',
      university: 'Howard University',
      major: 'UX Design',
      skills: ['Figma', 'User Research', 'Prototyping', 'UI/UX'],
      experience: '3 years',
      location: 'Remote',
      availability: 'Part-time',
      rating: 4.9,
      projects: [
        {
          title: 'Accessibility Redesign',
          description: 'Improved accessibility for a major news platform'
        },
        {
          title: 'Mobile Banking App',
          description: 'Designed intuitive financial management app'
        }
      ],
      bio: 'User-centered designer focused on inclusive design principles. Available for freelance or part-time roles.',
      contact: 'jamalw@howard.edu'
    },
    {
      id: '4',
      name: 'Priya Patel',
      avatar: '/avatars/student4.jpg',
      university: 'University of Texas',
      major: 'Business Analytics',
      skills: ['Excel', 'Tableau', 'SQL', 'Market Research'],
      experience: '1 year',
      location: 'Austin, TX',
      availability: 'Immediate',
      rating: 4.5,
      projects: [
        {
          title: 'Startup Market Analysis',
          description: 'Conducted competitive analysis for edtech startup'
        }
      ],
      bio: 'Analytical thinker with strong business acumen. Seeking internship to apply data skills in real-world settings.',
      contact: 'priya.p@utexas.edu'
    }
  ];

  const jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Frontend Developer Intern',
      description: 'Join our team to build beautiful user interfaces for our SaaS platform. Work with React and TypeScript.',
      skillsRequired: ['React', 'TypeScript', 'CSS'],
      location: 'Remote',
      type: 'internship',
      salary: '$25/hr',
      postedDate: '2023-08-01',
      applications: 12,
      status: 'open'
    },
    {
      id: '2',
      title: 'Data Science Part-time',
      description: 'Help analyze user behavior data to improve our recommendation algorithms.',
      skillsRequired: ['Python', 'Pandas', 'SQL'],
      location: 'San Francisco, CA',
      type: 'part-time',
      salary: '$30/hr',
      postedDate: '2023-07-25',
      applications: 8,
      status: 'open'
    },
    {
      id: '3',
      title: 'UX Design Contractor',
      description: 'Redesign our mobile app interface to improve user engagement.',
      skillsRequired: ['Figma', 'User Research', 'UI/UX'],
      location: 'Remote',
      type: 'contract',
      salary: '$45/hr',
      postedDate: '2023-08-10',
      applications: 5,
      status: 'open'
    }
  ];

  // Filtered data
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.major.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkills = filters.skills.length === 0 || 
      filters.skills.every(skill => student.skills.includes(skill));
    
    const matchesLocation = filters.location === '' || 
      student.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesAvailability = filters.availability === '' || 
      student.availability.toLowerCase().includes(filters.availability.toLowerCase());
    
    const matchesRating = student.rating >= filters.rating;
    
    return matchesSearch && matchesSkills && matchesLocation && 
           matchesAvailability && matchesRating;
  });

  const filteredJobs = jobPostings.filter(job => {
    return job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           job.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Skill suggestions based on input
  const allSkills = Array.from(new Set(students.flatMap(student => student.skills)));
  const [skillInput, setSkillInput] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  useEffect(() => {
    if (skillInput.length > 1) {
      setSuggestedSkills(
        allSkills.filter(skill => 
          skill.toLowerCase().includes(skillInput.toLowerCase()) && 
          !filters.skills.includes(skill)
        ).slice(0, 5)
      );
    } else {
      setSuggestedSkills([]);
    }
  }, [skillInput, filters.skills]);

  // Form handlers
  const handleAddSkill = (skill: string) => {
    if (!filters.skills.includes(skill)) {
      setFilters({...filters, skills: [...filters.skills, skill]});
    }
    setSkillInput('');
    setSuggestedSkills([]);
  };

  const handleRemoveSkill = (skill: string) => {
    setFilters({...filters, skills: filters.skills.filter(s => s !== skill)});
  };

  const handlePostJob = () => {
    if (!newJob.title || !newJob.description || newJob.skillsRequired.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const job: JobPosting = {
      id: `job-${Date.now()}`,
      title: newJob.title,
      description: newJob.description,
      skillsRequired: newJob.skillsRequired,
      location: newJob.location,
      type: newJob.type,
      salary: newJob.salary,
      postedDate: new Date().toISOString(),
      applications: 0,
      status: 'open'
    };

    jobPostings.unshift(job);
    setShowJobForm(false);
    setNewJob({
      title: '',
      description: '',
      skillsRequired: [],
      location: '',
      type: 'internship',
      salary: ''
    });
    toast.success('Job posted successfully!');
    setActiveTab('jobs');
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success(`Message sent to ${selectedStudent?.name}`);
    setMessage('');
    setSelectedStudent(null);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 Startup Talent Hub</h1>
          <p className="text-lg text-gray-600">
            Connect with top student talent and grow your startup team
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'students' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiUser className="mr-2" /> Find Students ({students.length})
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'jobs' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiBriefcase className="mr-2" /> Job Postings ({jobPostings.length})
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'messages' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiMail className="mr-2" /> Messages
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={activeTab === 'students' ? "Search students by name, skills, or university..." : "Search jobs by title or skills..."}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FiX className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {activeTab === 'students' && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <FiFilter />
                  Filters
                  {filters.skills.length > 0 || filters.location || filters.availability || filters.rating > 0 ? (
                    <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                      {[filters.skills.length, filters.location ? 1 : 0, filters.availability ? 1 : 0, filters.rating > 0 ? 1 : 0].reduce((a, b) => a + b, 0)}
                    </span>
                  ) : null}
                </button>
              )}

              {activeTab === 'jobs' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowJobForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <FiPlus /> Post New Job
                </motion.button>
              )}
            </div>

            {/* Filter Panel */}
            {showFilters && activeTab === 'students' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 p-4 rounded-lg mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Add skills..."
                        className="pl-3 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                      />
                      {suggestedSkills.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                          {suggestedSkills.map(skill => (
                            <div 
                              key={skill}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleAddSkill(skill)}
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {filters.skills.map(skill => (
                        <span 
                          key={skill} 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                          <button 
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 text-indigo-600 hover:text-indigo-900"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="Filter by location..."
                      className="pl-3 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                    <select
                      className="pl-3 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={filters.availability}
                      onChange={(e) => setFilters({...filters, availability: e.target.value})}
                    >
                      <option value="">Any availability</option>
                      <option value="immediate">Immediate</option>
                      <option value="summer">Summer 2023</option>
                      <option value="part-time">Part-time</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setFilters({...filters, rating: star})}
                          className={`${star <= filters.rating ? 'text-amber-400' : 'text-gray-300'}`}
                        >
                          <FiStar className="h-5 w-5" />
                        </button>
                      ))}
                      {filters.rating > 0 && (
                        <button
                          onClick={() => setFilters({...filters, rating: 0})}
                          className="ml-2 text-sm text-gray-500"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Content Area */}
            {activeTab === 'students' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'} Found
                  </h2>
                  <div className="text-sm text-gray-500">
                    Sorted by: <span className="font-medium">Relevance</span>
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilters({
                          skills: [],
                          location: '',
                          availability: '',
                          rating: 0
                        });
                      }}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredStudents.map((student, index) => (
                        <motion.div
                          key={student.id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -5 }}
                          className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-5">
                            <div className="flex items-start space-x-4">
                              <img
                                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
                                src={student.avatar}
                                alt={student.name}
                              />
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                                <p className="text-sm text-indigo-600">{student.major}</p>
                                <p className="text-xs text-gray-500 mt-1">{student.university}</p>
                                <div className="flex items-center mt-1">
                                  <FiStar className="h-4 w-4 text-amber-400" />
                                  <span className="text-sm text-gray-700 ml-1">{student.rating}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Location</span>
                                <span className="text-gray-700">{student.location}</span>
                              </div>
                              <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-500">Availability</span>
                                <span className="text-gray-700">{student.availability}</span>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h4 className="text-xs font-medium text-gray-500 mb-1">TOP SKILLS</h4>
                              <div className="flex flex-wrap gap-1">
                                {student.skills.slice(0, 3).map(skill => (
                                  <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {skill}
                                  </span>
                                ))}
                                {student.skills.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    +{student.skills.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mt-6 flex justify-between">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="text-sm text-indigo-600 hover:text-indigo-800"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setActiveTab('messages');
                                }}
                                className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                              >
                                <FiMail className="mr-1" /> Contact
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Posted
                  </h2>
                  <div className="text-sm text-gray-500">
                    Sorted by: <span className="font-medium">Newest First</span>
                  </div>
                </div>

                {filteredJobs.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or post a new job</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {filteredJobs.map((job, index) => (
                        <motion.div
                          key={job.id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                          className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-5">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                                <div className="flex items-center mt-1 space-x-4">
                                  <span className="flex items-center text-sm text-gray-500">
                                    <FiMapPin className="mr-1" /> {job.location}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-500">
                                    <FiDollarSign className="mr-1" /> {job.salary}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-500">
                                    <FiClock className="mr-1" /> {new Date(job.postedDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {job.status === 'open' ? 'Open' : 'Closed'}
                              </span>
                            </div>

                            <div className="mt-4">
                              <p className="text-sm text-gray-700">{job.description}</p>
                            </div>

                            <div className="mt-4">
                              <h4 className="text-xs font-medium text-gray-500 mb-1">REQUIRED SKILLS</h4>
                              <div className="flex flex-wrap gap-1">
                                {job.skillsRequired.map(skill => (
                                  <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mt-6 flex justify-between items-center">
                              <div className="text-sm text-gray-500">
                                {job.applications} {job.applications === 1 ? 'application' : 'applications'}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setSelectedJob(job)}
                                  className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                  View Details
                                </button>
                                <button className="text-sm text-gray-500 hover:text-gray-700">
                                  <FiExternalLink />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Your Messages</h3>
                <p className="mt-1 text-sm text-gray-500">Connect with potential candidates here</p>
                <button
                  onClick={() => setActiveTab('students')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                  Browse Students
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-6">
                  <img
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                    <p className="text-lg text-indigo-600">{selectedStudent.major}</p>
                    <p className="text-sm text-gray-500">{selectedStudent.university}</p>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(selectedStudent.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-2 text-gray-700">{selectedStudent.rating}</span>
                      </div>
                      <span className="mx-3 text-gray-300">|</span>
                      <span className="text-gray-700">{selectedStudent.experience} experience</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FiMapPin className="mr-1" /> {selectedStudent.location}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1" /> Available: {selectedStudent.availability}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700">{selectedStudent.bio}</p>

                  <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Projects</h3>
                  <div className="space-y-4">
                    {selectedStudent.projects.map((project, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Contact</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-700">{selectedStudent.contact}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Send Message</p>
                        <textarea
                          className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                          rows={3}
                          placeholder="Write your message here..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={handleSendMessage}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900 p-2 hover:bg-blue-100 rounded flex items-center">
                        <FiBookmark className="mr-2" /> Save to Shortlist
                      </button>
                      <button className="w-full text-left text-sm text-blue-700 hover:text-blue-900 p-2 hover:bg-blue-100 rounded flex items-center">
                        <FiShare2 className="mr-2" /> Share Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Job Posting Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Post a New Job</h2>
                <button
                  onClick={() => setShowJobForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. Frontend Developer Intern"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description*</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={4}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills*</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Add required skills..."
                      className="pl-3 pr-4 py-2 w-full border border-gray-300 rounded-lg"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && skillInput.trim() && !newJob.skillsRequired.includes(skillInput)) {
                          setNewJob({...newJob, skillsRequired: [...newJob.skillsRequired, skillInput]});
                          setSkillInput('');
                        }
                      }}
                    />
                    {suggestedSkills.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                        {suggestedSkills.map(skill => (
                          <div 
                            key={skill}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              if (!newJob.skillsRequired.includes(skill)) {
                                setNewJob({...newJob, skillsRequired: [...newJob.skillsRequired, skill]});
                              }
                              setSkillInput('');
                            }}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newJob.skillsRequired.map(skill => (
                      <span 
                        key={skill} 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                        <button 
                          onClick={() => setNewJob({...newJob, skillsRequired: newJob.skillsRequired.filter(s => s !== skill)})}
                          className="ml-1 text-indigo-600 hover:text-indigo-900"
                        >
                          <FiX className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="e.g. Remote, San Francisco, etc."
                      value={newJob.location}
                      onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={newJob.type}
                      onChange={(e) => setNewJob({...newJob, type: e.target.value as any})}
                    >
                      <option value="internship">Internship</option>
                      <option value="part-time">Part-time</option>
                      <option value="full-time">Full-time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary/Compensation</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="e.g. $20/hr, $50k/year, etc."
                      value={newJob.salary}
                      onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowJobForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePostJob}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Post Job
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="flex items-center text-sm text-gray-500">
                      <FiMapPin className="mr-1" /> {selectedJob.location}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <FiDollarSign className="mr-1" /> {selectedJob.salary}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1" /> {new Date(selectedJob.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Job Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedJob.description}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skillsRequired.map(skill => (
                    <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Job Type</h4>
                  <p className="text-gray-900 capitalize">{selectedJob.type}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Applications</h4>
                  <p className="text-gray-900">{selectedJob.applications}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <p className="text-gray-900 capitalize">{selectedJob.status}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  View Applicants
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TalentHub;