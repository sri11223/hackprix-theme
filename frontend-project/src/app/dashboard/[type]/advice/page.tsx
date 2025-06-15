'use client';
import { useState } from 'react';
import { BookOpen, Mic, Users, Laptop2, Briefcase, MessageCircle, Lightbulb, CalendarClock, Podcast, Target, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'podcast' | 'mentorship' | 'course' | 'career' | 'qa' | 'webinar' | 'success' | 'motivation';
  image: string;
}

export default function AdvicePage() {
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'One-on-One Mentorship Sessions',
      description: 'Get personalized guidance from industry professionals across various fields.',
      type: 'mentorship',
      image: '/images/mentorship.jpg'
    },
    {
      id: '2',
      title: 'Career Skills Workshop Series',
      description: 'Participate in live sessions on resume building, interviewing, and professional growth.',
      type: 'workshop',
      image: '/images/workshop.jpg'
    },
    {
      id: '3',
      title: 'AI Career Talk Podcast',
      description: 'Listen to insightful conversations with tech leaders and career coaches.',
      type: 'podcast',
      image: '/images/podcast.jpg'
    },
    {
      id: '4',
      title: 'Tech Industry Crash Course',
      description: 'Learn the foundations of tech roles and startup culture in this interactive series.',
      type: 'course',
      image: '/images/course.jpg'
    },
    {
      id: '5',
      title: 'Job Seeker Bootcamp',
      description: 'A practical program to prepare you for your job search with real-world scenarios.',
      type: 'career',
      image: '/images/bootcamp.jpg'
    },
    {
      id: '6',
      title: 'Live Q&A with Startup Founders',
      description: 'Ask your questions directly to founders and learn from their journeys.',
      type: 'qa',
      image: '/images/qa.jpg'
    },
    {
      id: '7',
      title: 'Webinar: How to Nail Tech Interviews',
      description: 'Join top hiring managers for live mock interview breakdowns and tips.',
      type: 'webinar',
      image: '/images/interview.jpg'
    },
    {
      id: '8',
      title: 'Motivation Monday',
      description: 'Weekly audio drops to boost your career mindset and energy.',
      type: 'motivation',
      image: '/images/motivation.jpg'
    },
    {
      id: '9',
      title: 'Success Stories Vault',
      description: 'Browse inspiring journeys from individuals who broke into tech.',
      type: 'success',
      image: '/images/success.jpg'
    },
    {
      id: '10',
      title: 'Focus & Productivity Hacks',
      description: 'Short-form audio episodes on managing your time and career distractions.',
      type: 'podcast',
      image: '/images/productivity.jpg'
    },
    {
      id: '11',
      title: 'Ask Me Anything: Career Coaches',
      description: 'Live interactive events with seasoned career mentors.',
      type: 'qa',
      image: '/images/ama.jpg'
    },
    {
      id: '12',
      title: 'Daily Inspiration Nuggets',
      description: 'Get quick motivational quotes and stories to start your day.',
      type: 'motivation',
      image: '/images/quotes.jpg'
    }
  ]);

  const iconMap = {
    mentorship: <Users className="w-5 h-5" />, 
    workshop: <BookOpen className="w-5 h-5" />, 
    podcast: <Mic className="w-5 h-5" />,
    course: <Laptop2 className="w-5 h-5" />,
    career: <Briefcase className="w-5 h-5" />,
    qa: <MessageCircle className="w-5 h-5" />,
    webinar: <CalendarClock className="w-5 h-5" />,
    motivation: <Smile className="w-5 h-5" />,
    success: <Target className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 font-['Poppins']">Career Resources</h1>
        <p className="text-lg text-gray-600 font-['Inter']">
          Explore mentorships, workshops, podcasts, and inspiration to elevate your career
        </p>
      </div>

      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {resources.map(resource => (
          <motion.div
            key={resource.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg group transition duration-300 border border-gray-100"
            whileHover={{ scale: 1.04 }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="relative overflow-hidden">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2 text-indigo-600 font-medium uppercase text-xs">
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {iconMap[resource.type]}
                </motion.div>
                {resource.type}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{resource.title}</h2>
              <p className="text-sm text-gray-600">{resource.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
