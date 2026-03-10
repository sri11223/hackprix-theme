'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, SendHorizonal } from 'lucide-react';
import Cookies from 'js-cookie';
import { API_ENDPOINTS } from '@/lib/api-config';
import { socket } from '@/hooks/useSocket';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Chat {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline';
  };
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  unreadCount: number;
}

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const myUserId = Cookies.get('userId') || '';

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(API_ENDPOINTS.MESSAGES.CHATS, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setChats(data.chats || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    const fetchMessages = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(API_ENDPOINTS.MESSAGES.GET(selectedChat), {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleReceive = (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    };
    const handleTyping = ({ userId }: { userId: string }) => {
      if (userId === selectedChat) setTyping(true);
    };
    const handleStopTyping = ({ userId }: { userId: string }) => {
      if (userId === selectedChat) setTyping(false);
    };
    socket.on('receiveMessage', handleReceive);
    socket.on('userTyping', handleTyping);
    socket.on('userStoppedTyping', handleStopTyping);
    return () => {
      socket.off('receiveMessage', handleReceive);
      socket.off('userTyping', handleTyping);
      socket.off('userStoppedTyping', handleStopTyping);
    };
  }, [selectedChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    try {
      const token = Cookies.get('token');
      const res = await fetch(API_ENDPOINTS.MESSAGES.SEND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ receiverId: selectedChat, content: newMessage }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
      }
      setNewMessage('');
      socket.emit('stopTyping', { receiverId: selectedChat });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleInputChange = (value: string) => {
    setNewMessage(value);
    if (selectedChat) {
      if (value.trim()) {
        socket.emit('typing', { receiverId: selectedChat });
      } else {
        socket.emit('stopTyping', { receiverId: selectedChat });
      }
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-10rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Messages</h1>
        <p className="text-gray-600">Connect with startups and team members</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm h-[calc(100%-6rem)] flex">
        {/* Chat List */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-all border-b ${selectedChat === chat.id ? 'bg-indigo-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold">
                        {chat.user.name[0]}
                      </div>
                      {chat.user.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{chat.user.name}</div>
                      {chat.lastMessage && (
                        <div className="text-xs text-gray-500 truncate">
                          {chat.lastMessage.content}
                        </div>
                      )}
                    </div>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <div className="text-xs text-gray-400">
                    {new Date(chat.lastMessage.timestamp).toLocaleDateString()}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  {chats.find(c => c.id === selectedChat)?.user.name[0]}
                </div>
                <div>
                  <div className="font-medium">
                    {chats.find(c => c.id === selectedChat)?.user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {chats.find(c => c.id === selectedChat)?.user.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender.id === myUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 text-sm shadow-sm ${
                      message.sender.id === myUserId
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className="text-xs mt-1 opacity-60">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="text-xs text-gray-400 italic">typing...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <SendHorizonal size={18} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
