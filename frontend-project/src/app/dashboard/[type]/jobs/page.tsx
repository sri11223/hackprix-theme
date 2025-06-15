"use client";
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  skills: string[];
  description: string;
  fullDescription: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
}

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  resume: File | null;
  coverLetter: string;
  portfolioUrl: string;
  linkedInUrl: string;
}


  // (Same staticJobs array as you posted, truncated here for brevity)
const staticJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Innovators Inc.',
    location: 'San Francisco, CA (Remote)',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    description: 'We are looking for an experienced frontend developer to join our team.',
    fullDescription: 'As a Senior Frontend Developer at Tech Innovators, you will be responsible for building and maintaining our web applications using modern technologies. You will work closely with our design and backend teams to create seamless user experiences.',
    requirements: [
      '5+ years of experience with React',
      'Strong TypeScript skills',
      'Experience with state management (Redux, Context API)',
      'Familiarity with testing frameworks (Jest, Cypress)'
    ],
    benefits: [
      'Competitive salary and equity',
      'Fully remote work',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      'Professional development budget'
    ],
    postedAt: '2023-05-15'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Creative Minds Agency',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    salary: '$90,000 - $110,000',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research'],
    description: 'Join our design team to create beautiful and functional interfaces.',
    fullDescription: 'As a UX/UI Designer at Creative Minds, you will be responsible for the entire design process from research to high-fidelity prototypes. You will collaborate with product managers and developers to deliver exceptional user experiences.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Portfolio showcasing your work',
      'Experience with design systems',
      'Knowledge of accessibility standards'
    ],
    benefits: [
      'Flexible work arrangements',
      'Annual bonus',
      '401(k) matching',
      'Monthly wellness stipend'
    ],
    postedAt: '2023-06-01'
  },
  // Add 8 more jobs with similar structure
  {
    id: '3',
    title: 'Backend Engineer (Node.js)',
    company: 'Data Systems Ltd.',
    location: 'Remote',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    skills: ['Node.js', 'Express', 'MongoDB', 'AWS'],
    description: 'Looking for a backend engineer to build scalable APIs and services.',
    fullDescription: 'As a Backend Engineer, you will design and implement robust APIs, optimize database performance, and ensure system reliability. You will work with our DevOps team to deploy and monitor services in production.',
    requirements: [
      '4+ years of Node.js experience',
      'Strong database design skills',
      'Experience with cloud platforms (AWS, GCP)',
      'Knowledge of microservices architecture'
    ],
    benefits: [
      'Fully remote work',
      'Stock options',
      'Generous equipment budget',
      'Annual company retreat'
    ],
    postedAt: '2023-06-10'
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'Growth Startups',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    skills: ['Product Strategy', 'Roadmapping', 'Agile', 'User Stories'],
    description: 'Lead product development for our SaaS platform.',
    fullDescription: 'As a Product Manager, you will define product vision, gather requirements, and work with cross-functional teams to deliver value to our customers. You will analyze market trends and user feedback to prioritize features.',
    requirements: [
      '3+ years in product management',
      'Experience with SaaS products',
      'Strong analytical skills',
      'Excellent communication skills'
    ],
    benefits: [
      'Performance bonuses',
      'Flexible PTO',
      'Parental leave',
      'Learning budget'
    ],
    postedAt: '2023-06-05'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Cloud Solutions',
    location: 'Remote',
    type: 'Contract',
    salary: '$80 - $100/hr',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    description: 'Help us build and maintain our cloud infrastructure.',
    fullDescription: 'As a DevOps Engineer, you will automate our deployment pipelines, monitor system health, and implement security best practices. You will work closely with development teams to optimize performance and reliability.',
    requirements: [
      '3+ years of DevOps experience',
      'Strong scripting skills (Bash, Python)',
      'Experience with container orchestration',
      'Knowledge of infrastructure as code'
    ],
    benefits: [
      'Flexible hours',
      'Long-term contract',
      'Remote work'
    ],
    postedAt: '2023-06-12'
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'AI Research Labs',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    skills: ['Python', 'Machine Learning', 'Pandas', 'TensorFlow'],
    description: 'Join our AI research team to build innovative models.',
    fullDescription: 'As a Data Scientist, you will research and implement machine learning models, analyze large datasets, and collaborate with product teams to deploy solutions. You will stay current with the latest advancements in AI.',
    requirements: [
      'PhD or MS in Computer Science or related field',
      '2+ years of ML experience',
      'Strong Python skills',
      'Publications in relevant conferences'
    ],
    benefits: [
      'Research-focused environment',
      'Conference travel budget',
      'Cutting-edge hardware',
      'Collaboration with academia'
    ],
    postedAt: '2023-06-08'
  },
  {
    id: '7',
    title: 'Marketing Specialist',
    company: 'Digital Growth',
    location: 'Chicago, IL (Hybrid)',
    type: 'Full-time',
    salary: '$70,000 - $90,000',
    skills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics'],
    description: 'Drive our digital marketing efforts and growth strategies.',
    fullDescription: 'As a Marketing Specialist, you will develop and execute digital marketing campaigns, analyze performance metrics, and optimize our online presence. You will work with creative teams to produce engaging content.',
    requirements: [
      '2+ years of digital marketing experience',
      'Google Analytics certification',
      'Content creation skills',
      'Data-driven mindset'
    ],
    benefits: [
      'Performance bonuses',
      'Hybrid work model',
      'Professional development',
      'Team events'
    ],
    postedAt: '2023-06-15'
  },
  {
    id: '8',
    title: 'Customer Success Manager',
    company: 'SaaS Solutions',
    location: 'Remote',
    type: 'Full-time',
    salary: '$75,000 - $95,000',
    skills: ['Customer Support', 'CRM', 'Onboarding', 'Retention'],
    description: 'Help our customers succeed with our products.',
    fullDescription: 'As a Customer Success Manager, you will onboard new clients, provide training and support, and identify opportunities for account growth. You will be the bridge between customers and our product team.',
    requirements: [
      '3+ years in customer success',
      'Experience with SaaS products',
      'Excellent communication skills',
      'Problem-solving attitude'
    ],
    benefits: [
      'Remote work',
      'Uncapped commissions',
      'Quarterly bonuses',
      'Flexible schedule'
    ],
    postedAt: '2023-06-03'
  },
  {
    id: '9',
    title: 'iOS Developer',
    company: 'Mobile First',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    skills: ['Swift', 'UIKit', 'SwiftUI', 'Combine'],
    description: 'Build beautiful iOS applications for our users.',
    fullDescription: 'As an iOS Developer, you will design and implement new features, optimize performance, and maintain our mobile applications. You will collaborate with designers to create pixel-perfect interfaces.',
    requirements: [
      '4+ years of iOS development',
      'Strong Swift knowledge',
      'Experience with modern architectures (MVVM, VIPER)',
      'Published apps in App Store'
    ],
    benefits: [
      'Annual tech upgrade',
      'Conference attendance',
      'Stock options',
      'Gym membership'
    ],
    postedAt: '2023-06-07'
  },
  {
    id: '10',
    title: 'Cybersecurity Analyst',
    company: 'Secure Networks',
    location: 'Washington, DC',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    skills: ['SIEM', 'Threat Detection', 'Incident Response', 'Compliance'],
    description: 'Protect our systems from security threats.',
    fullDescription: 'As a Cybersecurity Analyst, you will monitor our systems for vulnerabilities, respond to security incidents, and implement protective measures. You will conduct security audits and train staff on best practices.',
    requirements: [
      '3+ years in cybersecurity',
      'Relevant certifications (CISSP, CISM)',
      'Knowledge of compliance frameworks',
      'Experience with security tools'
    ],
    benefits: [
      'Security clearance sponsorship',
      'Continuing education',
      'Health benefits',
      'Relocation assistance'
    ],
    postedAt: '2023-06-09'
  }
];

export default function JobsPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    name: '', email: '', phone: '', resume: null, coverLetter: '', portfolioUrl: '', linkedInUrl: ''
  });
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');
        const filtered = type ? staticJobs.filter(job => job.type.toLowerCase() === type.toLowerCase()) : staticJobs;
        setFilteredJobs(filtered);
      } catch (error) {
        console.error('Error filtering jobs:', error);
        setFilteredJobs(staticJobs);
      }
    }
  }, [isClient]);

  const openJobDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const openApplicationForm = () => {
    setIsDialogOpen(false);
    setIsApplicationOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationForm(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting application:', { job: selectedJob, ...applicationForm });
    setTimeout(() => setApplicationSubmitted(true), 1500);
  };

  const resetApplication = () => {
    setApplicationForm({
      name: '', email: '', phone: '', resume: null, coverLetter: '', portfolioUrl: '', linkedInUrl: ''
    });
    setApplicationSubmitted(false);
    setIsApplicationOpen(false);
  };

  if (!isClient || filteredJobs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Your Dream Job</h1>
        <p className="text-gray-600">Browse through our latest job openings</p>
      </div>
      <div className="grid gap-6">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => openJobDetails(job)}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                <p className="text-gray-600">{job.company} • {job.location}</p>
              </div>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">{job.type}</span>
            </div>
            <div className="mb-4">
              <p className="text-gray-800 font-medium">{job.salary}</p>
              <p className="text-gray-600 mt-2">{job.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map(skill => (
                <span key={skill} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{skill}</span>
              ))}
            </div>
            <div className="text-sm text-gray-500">Posted on {new Date(job.postedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        ))}
      </div>
       {/* Job Details Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            {selectedJob && (
              <>
                <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedJob.title}
                </Dialog.Title>
                <Dialog.Description className="text-gray-600 mb-4">
                  {selectedJob.company} • {selectedJob.location} • {selectedJob.type}
                </Dialog.Description>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Salary</h3>
                  <p className="text-gray-700">{selectedJob.salary}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Description</h3>
                  <p className="text-gray-700 mb-4">{selectedJob.fullDescription}</p>
                  
                  <h4 className="font-medium text-gray-800 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside mb-4 text-gray-700">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                  
                  <h4 className="font-medium text-gray-800 mb-2">Benefits:</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedJob.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map(skill => (
                      <span key={skill} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={openApplicationForm}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Apply Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Dialog>

      {/* Application Form Dialog */}
      <Dialog 
        open={isApplicationOpen} 
        onClose={() => setIsApplicationOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            {applicationSubmitted ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <Dialog.Title className="text-xl font-bold text-gray-800 mb-2">
                  Application Submitted!
                </Dialog.Title>
                <Dialog.Description className="text-gray-600 mb-6">
                  Thank you for applying to {selectedJob?.title} at {selectedJob?.company}. We'll review your application and get back to you soon.
                </Dialog.Description>
                <button
                  onClick={resetApplication}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <Dialog.Title className="text-xl font-bold text-gray-800 mb-2">
                  Apply for {selectedJob?.title}
                </Dialog.Title>
                <Dialog.Description className="text-gray-600 mb-6">
                  Please fill out the application form below
                </Dialog.Description>

                <form onSubmit={handleSubmitApplication}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={applicationForm.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={applicationForm.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={applicationForm.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label htmlFor="linkedInUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        id="linkedInUrl"
                        name="linkedInUrl"
                        value={applicationForm.linkedInUrl}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio/Website
                      </label>
                      <input
                        type="url"
                        id="portfolioUrl"
                        name="portfolioUrl"
                        value={applicationForm.portfolioUrl}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                        Resume/CV*
                      </label>
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        required
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Letter
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        rows={5}
                        value={applicationForm.coverLetter}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Tell us why you're a great fit for this position..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsApplicationOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </Dialog>
      {/* Reuse the existing dialogs as-is */}
    </div>
  );
}
