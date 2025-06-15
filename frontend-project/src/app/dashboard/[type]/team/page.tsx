'use client';
import { useState } from 'react';
import { 
  FiUsers, FiPieChart, FiActivity, FiAward, FiClock, FiCheckCircle, 
  FiGitBranch, FiTrendingUp, FiBarChart2, FiCalendar, FiMail, FiMapPin,
  FiDollarSign, FiLayers, FiTarget, FiStar, FiCoffee, FiGlobe
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface TeamMember {
  id: string;
  name: string;
  role: string;
  domain: string;
  status: 'active' | 'on-leave' | 'part-time' | 'contractor';
  avatar: string;
  joinedDate: string;
  contributions: number;
  skills: string[];
  currentProjects: {
    name: string;
    progress: number;
    deadline?: string;
  }[];
  bio: string;
  location: string;
  email: string;
  salary?: string;
  satisfactionScore?: number;
  lastContribution?: string;
  coreValues: string[];
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  domains: { name: string; count: number; color: string }[];
  recentActivity: { member: string; action: string; time: string; icon: string }[];
  projectStatus: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  skillDistribution: { name: string; count: number }[];
  hiringNeeds: { domain: string; positions: number }[];
}

const TeamDashboard = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'domains' | 'activity' | 'projects' | 'hiring'>('members');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');



  

 

const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alex Chen',
      role: 'CEO & Founder',
      domain: 'Leadership',
      status: 'active',
      avatar: '/avatars/alex.jpg',
      joinedDate: '2022-01-15',
      contributions: 142,
      skills: ['Strategy', 'Fundraising', 'Product Vision', 'Public Speaking'],
      currentProjects: [
        { name: 'Company Strategy', progress: 85 },
        { name: 'Investor Relations', progress: 70, deadline: '2023-09-30' }
      ],
      bio: 'Serial entrepreneur with 10+ years in tech startups. Passionate about building products that solve real problems. Previously founded two successful SaaS companies.',
      location: 'San Francisco, CA',
      email: 'alex@startup.com',
      salary: '$180,000',
      satisfactionScore: 4.8,
      lastContribution: '2023-08-15',
      coreValues: ['Innovation', 'Transparency', 'Customer Focus']
    },
    {
      id: '2',
      name: 'Samira Khan',
      role: 'CTO',
      domain: 'Engineering',
      status: 'active',
      avatar: '/avatars/samira.jpg',
      joinedDate: '2022-03-10',
      contributions: 218,
      skills: ['System Architecture', 'AI/ML', 'DevOps', 'Python', 'Kubernetes'],
      currentProjects: [
        { name: 'Platform Architecture', progress: 65 },
        { name: 'Tech Hiring', progress: 40, deadline: '2023-10-15' },
        { name: 'AI Integration', progress: 30 }
      ],
      bio: 'Former Google engineer with deep expertise in scalable systems and machine learning applications. Holds PhD in Computer Science from Stanford.',
      location: 'New York, NY',
      email: 'samira@startup.com',
      salary: '$165,000',
      satisfactionScore: 4.9,
      lastContribution: '2023-08-18',
      coreValues: ['Technical Excellence', 'Mentorship', 'Continuous Learning']
    },
    {
      id: '3',
      name: 'Jamal Williams',
      role: 'Lead Designer',
      domain: 'Product Design',
      status: 'active',
      avatar: '/avatars/jamal.jpg',
      joinedDate: '2022-02-28',
      contributions: 176,
      skills: ['UX Research', 'UI Design', 'Prototyping', 'Figma', 'User Testing'],
      currentProjects: [
        { name: 'New Dashboard', progress: 90 },
        { name: 'Design System', progress: 75, deadline: '2023-09-15' }
      ],
      bio: 'Design thinker focused on creating intuitive user experiences that drive engagement. Previously led design at Airbnb and Pinterest.',
      location: 'Remote',
      email: 'jamal@startup.com',
      salary: '$145,000',
      satisfactionScore: 4.7,
      lastContribution: '2023-08-17',
      coreValues: ['User Empathy', 'Beautiful Simplicity', 'Collaboration']
    },
    {
      id: '4',
      name: 'Elena Rodriguez',
      role: 'Marketing Lead',
      domain: 'Growth',
      status: 'active',
      avatar: '/avatars/elena.jpg',
      joinedDate: '2022-04-05',
      contributions: 89,
      skills: ['Digital Marketing', 'Content Strategy', 'Branding', 'SEO', 'Social Media'],
      currentProjects: [
        { name: 'Launch Campaign', progress: 55, deadline: '2023-09-01' },
        { name: 'Social Media', progress: 80 }
      ],
      bio: 'Growth marketer with a track record of scaling startups through creative campaigns. Increased previous company revenue by 300% in 18 months.',
      location: 'Austin, TX',
      email: 'elena@startup.com',
      salary: '$135,000',
      satisfactionScore: 4.5,
      lastContribution: '2023-08-16',
      coreValues: ['Data-Driven', 'Creativity', 'Results']
    },
    {
      id: '5',
      name: 'David Park',
      role: 'Senior Developer',
      domain: 'Engineering',
      status: 'part-time',
      avatar: '/avatars/david.jpg',
      joinedDate: '2022-05-20',
      contributions: 64,
      skills: ['Frontend', 'React', 'TypeScript', 'GraphQL', 'Jest'],
      currentProjects: [
        { name: 'Customer Portal', progress: 45, deadline: '2023-10-30' }
      ],
      bio: 'Frontend specialist who loves building polished, performant user interfaces. Contributes to open source in spare time.',
      location: 'Seattle, WA',
      email: 'david@startup.com',
      salary: '$120,000 (80%)',
      satisfactionScore: 4.6,
      lastContribution: '2023-08-14',
      coreValues: ['Code Quality', 'Accessibility', 'Teamwork']
    },
    {
      id: '6',
      name: 'Priya Patel',
      role: 'Data Scientist',
      domain: 'Engineering',
      status: 'contractor',
      avatar: '/avatars/priya.jpg',
      joinedDate: '2023-01-10',
      contributions: 42,
      skills: ['Python', 'Pandas', 'SQL', 'Machine Learning', 'Data Visualization'],
      currentProjects: [
        { name: 'Analytics Dashboard', progress: 60 },
        { name: 'Recommendation Engine', progress: 25 }
      ],
      bio: 'Data science consultant specializing in predictive analytics. Works with multiple startups to implement data-driven solutions.',
      location: 'Boston, MA',
      email: 'priya@contractor.com',
      salary: '$150/hr',
      lastContribution: '2023-08-12',
      coreValues: ['Insightful', 'Precise', 'Efficient']
    }
  ];

  const teamStats: TeamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    domains: [
      { name: 'Engineering', count: 3, color: '#6366F1' },
      { name: 'Product Design', count: 1, color: '#EC4899' },
      { name: 'Growth', count: 1, color: '#10B981' },
      { name: 'Leadership', count: 1, color: '#F59E0B' }
    ],
    recentActivity: [
      { member: 'Samira Khan', action: 'Deployed new API version to production', time: '2 hours ago', icon: 'git-merge' },
      { member: 'Jamal Williams', action: 'Completed user testing with 20 participants', time: '5 hours ago', icon: 'users' },
      { member: 'Elena Rodriguez', action: 'Launched new marketing campaign across 3 channels', time: '1 day ago', icon: 'trending-up' },
      { member: 'Alex Chen', action: 'Closed $5M Series A funding round', time: '3 days ago', icon: 'dollar-sign' },
      { member: 'David Park', action: 'Implemented new accessibility features', time: '4 days ago', icon: 'accessibility' },
      { member: 'Priya Patel', action: 'Delivered analytics report to leadership', time: '1 week ago', icon: 'bar-chart' }
    ],
    projectStatus: {
      completed: 2,
      inProgress: 7,
      notStarted: 3
    },
    skillDistribution: [
      { name: 'Frontend', count: 2 },
      { name: 'Backend', count: 3 },
      { name: 'Design', count: 1 },
      { name: 'Marketing', count: 1 },
      { name: 'Data Science', count: 1 },
      { name: 'Leadership', count: 1 }
    ],
    hiringNeeds: [
      { domain: 'Engineering', positions: 2 },
      { domain: 'Customer Support', positions: 1 },
      { domain: 'Product Management', positions: 1 }
    ]
  };

  const projectStatusData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [teamStats.projectStatus.completed, teamStats.projectStatus.inProgress, teamStats.projectStatus.notStarted],
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
        borderWidth: 0
      }
    ]
  };

  const skillDistributionData = {
    labels: teamStats.skillDistribution.map(skill => skill.name),
    datasets: [
      {
        data: teamStats.skillDistribution.map(skill => skill.count),
        backgroundColor: [
          '#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'
        ],
        borderWidth: 0
      }
    ]
  };    

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'contractor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <FiCheckCircle className="mr-1" />;
      case 'on-leave': return <FiClock className="mr-1" />;
      case 'part-time': return <FiActivity className="mr-1" />;
      case 'contractor': return <FiGitBranch className="mr-1" />;
      default: return <FiUsers className="mr-1" />;
    }
  };

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case 'git-merge': return <FiGitBranch className="mr-2 text-indigo-500" />;
      case 'users': return <FiUsers className="mr-2 text-pink-500" />;
      case 'trending-up': return <FiTrendingUp className="mr-2 text-green-500" />;
      case 'dollar-sign': return <FiDollarSign className="mr-2 text-amber-500" />;
      case 'accessibility': return <FiTarget className="mr-2 text-blue-500" />;
      case 'bar-chart': return <FiBarChart2 className="mr-2 text-purple-500" />;
      default: return <FiActivity className="mr-2 text-gray-500" />;
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Dream Team</h1>
          <p className="text-lg text-gray-600 mt-2">
            The brilliant minds building the future of our startup
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* ... (keep the same stats cards implementation) */}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 flex justify-between items-center">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('members')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'members' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiUsers className="mr-2" /> Team Members
              </button>
              <button
                onClick={() => setActiveTab('domains')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'domains' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiPieChart className="mr-2" /> Domains
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'activity' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiActivity className="mr-2" /> Activity
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'projects' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiLayers className="mr-2" /> Projects
              </button>
              <button
                onClick={() => setActiveTab('hiring')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'hiring' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FiTarget className="mr-2" /> Hiring
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'members' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    whileHover={{ y: -4 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start mb-4">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          {getStatusIcon(member.status)}
                          {member.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm flex items-center">
                        <FiMapPin className="mr-2 text-gray-400" />
                        {member.location}
                      </p>
                      <p className="text-sm flex items-center">
                        <FiMail className="mr-2 text-gray-400" />
                        {member.email}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'domains' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Domain Distribution</h3>
                  <Pie data={{
                    labels: teamStats.domains.map(d => d.name),
                    datasets: [{
                      data: teamStats.domains.map(d => d.count),
                      backgroundColor: teamStats.domains.map(d => d.color),
                      borderWidth: 0
                    }]
                  }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Skill Distribution</h3>
                  <Bar data={skillDistributionData} />
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                {teamStats.recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-4 bg-gray-50 rounded-lg"
                  >
                    {getActivityIcon(activity.icon)}
                    <div>
                      <p className="text-sm font-medium">{activity.member}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Status</h3>
                  <Pie data={projectStatusData} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Active Projects</h3>
                  <Bar data={skillDistributionData} />
                </div>
              </div>
            )}

            {activeTab === 'hiring' && (
              <div className="space-y-4">
                {teamStats.hiringNeeds.map((need, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{need.domain}</h4>
                    <p className="text-sm text-gray-600">
                      {need.positions} position{need.positions > 1 ? 's' : ''} needed
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
