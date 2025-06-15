'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  FiVideo, FiUpload, FiMic, FiMicOff, FiVideoOff, 
  FiMessageSquare, FiUsers, FiBarChart2, FiCalendar,
  FiMail, FiShare2, FiClock, FiUserPlus, FiFileText
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type Participant = {
  id: string;
  name: string;
  role: 'presenter' | 'investor' | 'mentor' | 'attendee';
  email?: string;
  status: 'joined' | 'invited' | 'declined';
};

type PitchEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  participants: string[];
};

const PitchArena = () => {
  const router = useRouter();
  
  // Main state
  const [activeTab, setActiveTab] = useState('live');
  const [viewMode, setViewMode] = useState<'grid' | 'speaker'>('grid');
  const [peers, setPeers] = useState<Participant[]>([
    { id: 'me', name: 'You (Presenter)', role: 'presenter', status: 'joined' },
    { id: 'peer1', name: 'Alex Chen', role: 'investor', email: 'alex@vc.com', status: 'joined' },
    { id: 'peer2', name: 'Maria Garcia', role: 'investor', email: 'maria@angel.com', status: 'joined' },
    { id: 'peer3', name: 'Jamal Williams', role: 'mentor', email: 'jamal@accelerator.com', status: 'invited' },
    { id: 'peer4', name: 'Taylor Smith', role: 'attendee', email: 'taylor@startup.io', status: 'declined' }
  ]);
  
  // Pitch events/scheduling
  const [events, setEvents] = useState<PitchEvent[]>([
    {
      id: '1',
      title: 'Seed Round Pitch',
      description: 'Presentation for our seed funding round',
      date: '2023-11-15',
      time: '14:00',
      duration: 60,
      participants: ['me', 'peer1', 'peer2']
    },
    {
      id: '2',
      title: 'Product Demo',
      description: 'Showcase new features to advisory board',
      date: '2023-11-20',
      time: '10:30',
      duration: 45,
      participants: ['me', 'peer3']
    }
  ]);
  
  // Room features
  const [poll, setPoll] = useState({
    question: 'How likely would you invest in this startup?',
    options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely'],
    votes: [12, 8, 5, 2],
    voted: false
  });
  
  const [reactions, setReactions] = useState({ '👍': 15, '🎉': 8, '🔥': 12, '💡': 3 });
  const [files, setFiles] = useState<Array<{name: string, url: string, size: string, type: string}>>([
    { name: 'PitchDeck.pdf', url: '#', size: '2.4MB', type: 'presentation' },
    { name: 'Financials.xlsx', url: '#', size: '1.1MB', type: 'spreadsheet' }
  ]);
  
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Alex Chen', text: 'Great presentation so far!', time: '2:45 PM' },
    { sender: 'You', text: 'Thanks Alex! Slide deck is available in files.', time: '2:46 PM' },
    { sender: 'Maria Garcia', text: 'Could you share the revenue projections?', time: '2:47 PM' }
  ]);
  
  const [messageInput, setMessageInput] = useState('');
  const [raisedHands, setRaisedHands] = useState<string[]>([]);
  const [mediaState, setMediaState] = useState({
    micMuted: false,
    cameraOff: false,
    screenSharing: false,
    recording: false
  });
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 30,
    participants: [] as string[]
  });
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [pitchTimer, setPitchTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Refs
  const videoRefs = useRef<{ [id: string]: HTMLVideoElement | null }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Effects
  useEffect(() => {
    // Mock video streams
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        const vid = videoRefs.current['me'];
        if (vid) vid.srcObject = stream;
      })
      .catch(() => console.log('Camera access denied'));

    // Auto-scroll chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setPitchTimer(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [timerActive]);

  // Handlers
  const handleVote = (idx: number) => {
    if (poll.voted) return;
    setPoll(p => ({
      ...p,
      votes: p.votes.map((v, i) => (i === idx ? v + 1 : v)),
      voted: true
    }));
  };

  const handleReaction = (emoji: string) => {
    setReactions(r => ({ ...r, [emoji]: r[emoji] + 1 }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        type: file.type.split('/')[1] || 'file'
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      setChatMessages([
        ...chatMessages,
        { 
          sender: 'You', 
          text: messageInput, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
      setMessageInput('');
    }
  };

  const toggleRaiseHand = () => {
    if (raisedHands.includes('me')) {
      setRaisedHands(raisedHands.filter(id => id !== 'me'));
    } else {
      setRaisedHands([...raisedHands, 'me']);
    }
  };

  const toggleMedia = (type: 'mic' | 'camera' | 'screen' | 'recording') => {
    setMediaState(prev => ({
      ...prev,
      micMuted: type === 'mic' ? !prev.micMuted : prev.micMuted,
      cameraOff: type === 'camera' ? !prev.cameraOff : prev.cameraOff,
      screenSharing: type === 'screen' ? !prev.screenSharing : prev.screenSharing,
      recording: type === 'recording' ? !prev.recording : prev.recording
    }));
  };

  const createEvent = () => {
    const event: PitchEvent = {
      id: Date.now().toString(),
      ...newEvent,
      participants: [...newEvent.participants, 'me']
    };
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 30,
      participants: []
    });
  };

  const sendInvite = () => {
    if (inviteEmail) {
      const newParticipant: Participant = {
        id: `invite-${Date.now()}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: 'attendee',
        status: 'invited'
      };
      setPeers([...peers, newParticipant]);
      if (newEvent.title) {
        setNewEvent(prev => ({
          ...prev,
          participants: [...prev.participants, newParticipant.id]
        }));
      }
      setInviteEmail('');
    }
  };

  const startEvent = (eventId: string) => {
    setActiveEvent(eventId);
    setActiveTab('live');
    setTimerActive(true);
    setPitchTimer(0);
    
    // Auto-join participants
    const event = events.find(e => e.id === eventId);
    if (event) {
      setPeers(prev => 
        prev.map(p => 
          event.participants.includes(p.id) 
            ? { ...p, status: 'joined' } 
            : p
        )
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold flex items-center">
            <FiVideo className="mr-2" /> PitchArena Pro
          </h1>
          
          {activeEvent && (
            <div className="flex items-center bg-indigo-900 px-3 py-1 rounded-lg">
              <FiClock className="mr-2" />
              <span>{formatTime(pitchTimer)}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'speaker' : 'grid')}
            className="px-3 py-1 bg-gray-700 rounded-lg"
          >
            {viewMode === 'grid' ? 'Speaker View' : 'Grid View'}
          </button>
          <button 
            onClick={() => router.push('/')}
            className="px-3 py-1 bg-red-600 rounded-lg"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        {/* Left Sidebar */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-1 bg-gray-800 rounded-xl p-4 space-y-6"
        >
          {/* Navigation */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('live')}
              className={`w-full text-left p-3 rounded-lg flex items-center ${activeTab === 'live' ? 'bg-indigo-900' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <FiVideo className="mr-2" /> Live Pitch
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`w-full text-left p-3 rounded-lg flex items-center ${activeTab === 'schedule' ? 'bg-indigo-900' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <FiCalendar className="mr-2" /> Schedule
            </button>
            <button 
              onClick={() => setActiveTab('participants')}
              className={`w-full text-left p-3 rounded-lg flex items-center ${activeTab === 'participants' ? 'bg-indigo-900' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <FiUsers className="mr-2" /> Participants
            </button>
            <button 
              onClick={() => setActiveTab('resources')}
              className={`w-full text-left p-3 rounded-lg flex items-center ${activeTab === 'resources' ? 'bg-indigo-900' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <FiFileText className="mr-2" /> Resources
            </button>
          </nav>

          {/* Current Event Info */}
          {activeEvent && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Current Session</h3>
              <p className="text-sm">
                {events.find(e => e.id === activeEvent)?.title}
              </p>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>
                  {events.find(e => e.id === activeEvent)?.date} at{' '}
                  {events.find(e => e.id === activeEvent)?.time}
                </span>
                <span>
                  {events.find(e => e.id === activeEvent)?.duration} min
                </span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <h3 className="font-bold">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={toggleRaiseHand}
                className={`p-2 rounded-lg flex flex-col items-center ${raisedHands.includes('me') ? 'bg-yellow-600' : 'bg-gray-700'}`}
              >
                <span className="text-2xl">✋</span>
                <span className="text-xs">Raise Hand</span>
              </button>
              <button 
                onClick={() => toggleMedia('screen')}
                className={`p-2 rounded-lg flex flex-col items-center ${mediaState.screenSharing ? 'bg-green-600' : 'bg-gray-700'}`}
              >
                <FiShare2 className="text-xl" />
                <span className="text-xs">Share Screen</span>
              </button>
              <button 
                onClick={() => toggleMedia('recording')}
                className={`p-2 rounded-lg flex flex-col items-center ${mediaState.recording ? 'bg-red-600' : 'bg-gray-700'}`}
              >
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs">Record</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg flex flex-col items-center bg-gray-700"
              >
                <FiUpload className="text-xl" />
                <span className="text-xs">Upload</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {/* Live Pitch View */}
            {activeTab === 'live' && (
              <motion.div
                key="live"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Video Grid */}
                <div className="bg-gray-800 rounded-xl p-4">
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {peers.filter(p => p.status === 'joined').map(peer => (
                        <motion.div
                          key={peer.id}
                          whileHover={{ scale: 1.02 }}
                          className={`relative rounded-lg overflow-hidden ${peer.id === 'me' ? 'border-2 border-indigo-500' : ''}`}
                        >
                          <video
                            ref={el => (videoRefs.current[peer.id] = el)}
                            autoPlay
                            playsInline
                            muted={peer.id === 'me'}
                            className="w-full h-48 object-cover bg-gray-700"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <div className="flex items-center">
                              <span className="font-medium">{peer.name}</span>
                              {peer.role === 'presenter' && (
                                <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded">Presenter</span>
                              )}
                            </div>
                          </div>
                          {raisedHands.includes(peer.id) && (
                            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2 animate-pulse">
                              ✋
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="relative w-full max-w-2xl h-96 bg-gray-700 rounded-lg overflow-hidden">
                        <video
                          ref={el => (videoRefs.current['me'] = el)}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold">You (Presenter)</div>
                              <div className="text-sm text-gray-300">Currently presenting</div>
                            </div>
                            <div className="flex space-x-2">
                              {Object.entries(reactions)
                                .filter(([_, count]) => count > 0)
                                .map(([emoji, count]) => (
                                  <div key={emoji} className="bg-black/50 px-2 py-1 rounded-full">
                                    {emoji} {count}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-4 w-full max-w-2xl">
                        {peers.filter(p => p.id !== 'me' && p.status === 'joined').map(peer => (
                          <div key={peer.id} className="relative h-24 bg-gray-700 rounded overflow-hidden">
                            <video
                              ref={el => (videoRefs.current[peer.id] = el)}
                              autoPlay
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                              <div className="text-xs truncate">{peer.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Feature Tabs */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="flex border-b border-gray-700">
                    {['poll', 'qna', 'resources'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 font-medium ${activeTab === tab ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className="p-4">
                    {/* Poll Content */}
                    {activeTab === 'poll' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <h3 className="text-lg font-bold">{poll.question}</h3>
                        <div className="space-y-2">
                          {poll.options.map((opt, idx) => (
                            <div key={opt} className="space-y-1">
                              <button
                                onClick={() => handleVote(idx)}
                                disabled={poll.voted}
                                className={`w-full text-left p-3 rounded-lg flex justify-between items-center ${poll.voted ? 'bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'}`}
                              >
                                <span>{opt}</span>
                                <span className="font-bold">{poll.votes[idx]}</span>
                              </button>
                              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(poll.votes[idx] / Math.max(...poll.votes)) * 100}%` }}
                                  className="h-full bg-indigo-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Q&A Content */}
                    {activeTab === 'qna' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <h3 className="text-lg font-bold">Questions & Answers</h3>
                        <div className="space-y-3">
                          {raisedHands.map(id => {
                            const peer = peers.find(p => p.id === id);
                            return peer ? (
                              <div key={id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{peer.name}</div>
                                  <div className="text-sm text-gray-400">Has a question</div>
                                </div>
                                <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded">
                                  Allow to Speak
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Resources Content */}
                    {activeTab === 'resources' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold">Shared Resources</h3>
                        </div>
                        <div className="space-y-2">
                          {files.map((file, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ x: 5 }}
                              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                            >
                              <div className="flex items-center">
                                <FiDownload className="mr-2" />
                                <div>
                                  <div>{file.name}</div>
                                  <div className="text-xs text-gray-400">{file.size} • {file.type}</div>
                                </div>
                              </div>
                              <a 
                                href={file.url} 
                                download={file.name}
                                className="bg-gray-600 hover:bg-gray-500 p-2 rounded-lg"
                              >
                                Download
                              </a>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Schedule View */}
            {activeTab === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-gray-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Upcoming Pitch Events</h2>
                    <button 
                      onClick={() => setActiveTab('new-event')}
                      className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
                    >
                      Schedule New
                    </button>
                  </div>

                  <div className="space-y-3">
                    {events.map(event => (
                      <motion.div
                        key={event.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-gray-700 p-4 rounded-lg border-l-4 border-indigo-500"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{event.title}</h3>
                            <p className="text-sm text-gray-400">{event.description}</p>
                            <div className="flex space-x-4 mt-2 text-sm">
                              <span className="flex items-center">
                                <FiCalendar className="mr-1" /> {event.date}
                              </span>
                              <span className="flex items-center">
                                <FiClock className="mr-1" /> {event.time} ({event.duration} min)
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => startEvent(event.id)}
                              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                            >
                              Start
                            </button>
                            <button className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded">
                              Edit
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {event.participants.map(pid => {
                            const participant = peers.find(p => p.id === pid);
                            return participant ? (
                              <span 
                                key={pid}
                                className="text-xs bg-gray-600 px-2 py-1 rounded-full flex items-center"
                              >
                                <div className={`w-2 h-2 rounded-full mr-1 ${participant.status === 'joined' ? 'bg-green-400' : participant.status === 'invited' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                                {participant.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* New Event View */}
            {activeTab === 'new-event' && (
              <motion.div
                key="new-event"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800 rounded-xl p-4 space-y-4"
              >
                <h2 className="text-xl font-bold">Schedule New Pitch Event</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg p-2"
                      placeholder="Seed Round Pitch"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg p-2"
                      rows={3}
                      placeholder="Brief description of the pitch event"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="w-full bg-gray-700 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Time</label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="w-full bg-gray-700 rounded-lg p-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value) || 30})}
                      className="w-full bg-gray-700 rounded-lg p-2"
                      min="5"
                      max="120"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Invite Participants</label>
                    <div className="flex">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1 bg-gray-700 rounded-l-lg p-2"
                        placeholder="participant@email.com"
                      />
                      <button
                        onClick={sendInvite}
                        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-lg"
                      >
                        <FiUserPlus />
                      </button>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newEvent.participants.map(pid => {
                        const participant = peers.find(p => p.id === pid);
                        return participant ? (
                          <span 
                            key={pid}
                            className="text-xs bg-gray-600 px-2 py-1 rounded-full flex items-center"
                          >
                            {participant.name}
                            <button 
                              onClick={() => setNewEvent({
                                ...newEvent,
                                participants: newEvent.participants.filter(id => id !== pid)
                              })}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createEvent}
                      disabled={!newEvent.title || !newEvent.date || !newEvent.time}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:bg-gray-600"
                    >
                      Schedule Event
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Participants View */}
            {activeTab === 'participants' && (
              <motion.div
                key="participants"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800 rounded-xl p-4"
              >
                <h2 className="text-xl font-bold mb-4">Participants Management</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-700">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Role</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {peers.map(peer => (
                        <tr key={peer.id} className="border-b border-gray-700 hover:bg-gray-700">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${
                                peer.role === 'presenter' ? 'bg-yellow-400' : 
                                peer.role === 'investor' ? 'bg-purple-400' :
                                peer.role === 'mentor' ? 'bg-blue-400' : 'bg-green-400'
                              }`} />
                              {peer.name}
                            </div>
                          </td>
                          <td className="py-3 capitalize">{peer.role}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              peer.status === 'joined' ? 'bg-green-900 text-green-300' :
                              peer.status === 'invited' ? 'bg-yellow-900 text-yellow-300' :
                              'bg-red-900 text-red-300'
                            }`}>
                              {peer.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <button className="text-indigo-400 hover:text-indigo-300">
                                <FiMail />
                              </button>
                              {peer.status === 'invited' && (
                                <button className="text-green-400 hover:text-green-300">
                                  Remind
                                </button>
                              )}
                              {peer.id !== 'me' && (
                                <button className="text-red-400 hover:text-red-300">
                                  Remove
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 bg-gray-700 rounded-l-lg p-2"
                    placeholder="participant@email.com"
                  />
                  <button
                    onClick={sendInvite}
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-lg"
                  >
                    <FiUserPlus className="mr-1" /> Invite
                  </button>
                </div>
              </motion.div>
            )}

            {/* Resources View */}
            {activeTab === 'resources' && (
              <motion.div
                key="resources"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800 rounded-xl p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Shared Resources</h2>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg"
                  >
                    <FiUpload className="mr-1" /> Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    multiple
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600"
                    >
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <FiDownload className="mr-2 text-indigo-400" />
                          <div className="font-medium truncate">{file.name}</div>
                        </div>
                        <div className="text-xs text-gray-400 mb-3">
                          {file.size} • {file.type}
                        </div>
                        <div className="flex justify-between">
                          <a 
                            href={file.url} 
                            download={file.name}
                            className="text-indigo-400 hover:text-indigo-300 text-sm"
                          >
                            Download
                          </a>
                          <button className="text-gray-400 hover:text-gray-300 text-sm">
                            Share
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar - Chat */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 bg-gray-800 rounded-xl flex flex-col"
        >
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold flex items-center">
              <FiMessageSquare className="mr-2" /> Live Chat
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${msg.sender === 'You' ? 'bg-indigo-900 ml-auto' : 'bg-gray-700 mr-auto'}`}
                style={{ maxWidth: '80%' }}
              >
                <div className="font-bold text-sm">{msg.sender}</div>
                <div>{msg.text}</div>
                <div className="text-xs text-gray-400 mt-1">{msg.time}</div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex mb-2 space-x-2">
              {Object.keys(reactions).map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-xl hover:bg-gray-700 p-1 rounded-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-l-lg focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-lg"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Control Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-2 flex justify-center space-x-4"
      >
        <button 
          onClick={() => toggleMedia('mic')}
          className={`p-3 rounded-full flex flex-col items-center ${mediaState.micMuted ? 'bg-red-600' : 'bg-gray-700'}`}
          aria-label={mediaState.micMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {mediaState.micMuted ? <FiMicOff size={18} /> : <FiMic size={18} />}
          <span className="text-xs mt-1">Mic</span>
        </button>
        <button 
          onClick={() => toggleMedia('camera')}
          className={`p-3 rounded-full flex flex-col items-center ${mediaState.cameraOff ? 'bg-red-600' : 'bg-gray-700'}`}
          aria-label={mediaState.cameraOff ? "Turn camera on" : "Turn camera off"}
        >
          {mediaState.cameraOff ? <FiVideoOff size={18} /> : <FiVideo size={18} />}
          <span className="text-xs mt-1">Camera</span>
        </button>
        <button 
          onClick={() => toggleMedia('screen')}
          className={`p-3 rounded-full flex flex-col items-center ${mediaState.screenSharing ? 'bg-green-600' : 'bg-gray-700'}`}
          aria-label={mediaState.screenSharing ? "Stop screen sharing" : "Start screen sharing"}
        >
          <FiShare2 size={18} />
          <span className="text-xs mt-1">Share</span>
        </button>
        <button 
          onClick={() => toggleMedia('recording')}
          className={`p-3 rounded-full flex flex-col items-center ${mediaState.recording ? 'bg-red-600' : 'bg-gray-700'}`}
          aria-label={mediaState.recording ? "Stop recording" : "Start recording"}
        >
          <div className={`w-4 h-4 rounded-full ${mediaState.recording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-xs mt-1">Record</span>
        </button>
        <button 
          onClick={toggleRaiseHand}
          className={`p-3 rounded-full flex flex-col items-center ${raisedHands.includes('me') ? 'bg-yellow-600' : 'bg-gray-700'}`}
          aria-label={raisedHands.includes('me') ? "Lower hand" : "Raise hand"}
        >
          <span className="text-xl">✋</span>
          <span className="text-xs mt-1">Hand</span>
        </button>
        <button 
          onClick={() => router.push('/')}
          className="p-3 rounded-full flex flex-col items-center bg-red-600"
          aria-label="Leave meeting"
        >
          <span className="text-xl">×</span>
          <span className="text-xs mt-1">Leave</span>
        </button>
      </motion.div>

      {/* Global Styles */}
      <style jsx global>{`
        .animate-wave {
          animation: wave 2s infinite;
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
      `}</style>
    </div>
  );
};

export default PitchArena;