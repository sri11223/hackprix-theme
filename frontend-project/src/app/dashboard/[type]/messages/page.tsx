'use client';
import { useState, useEffect } from 'react';

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
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      user: {
        id: '1',
        name: 'John from TechStart',
        status: 'online'
      },
      lastMessage: {
        content: 'Thanks for your application! When are you available for an interview?',
        timestamp: new Date()
      },
      unreadCount: 2
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Sarah from CloudSecure',
        status: 'offline'
      },
      lastMessage: {
        content: 'Would you be interested in a technical co-founder role?',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      unreadCount: 0
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Simulated messages for selected chat
  useEffect(() => {
    if (selectedChat) {
      const chat = chats.find(c => c.id === selectedChat);
      if (chat) {
        setMessages([
          {
            id: '1',
            sender: chat.user,
            content: 'Hi there! I saw your profile and I\'m impressed with your experience.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: true
          },
          {
            id: '2',
            sender: {
              id: 'me',
              name: 'Me'
            },
            content: 'Thank you! I\'m very interested in learning more about the opportunity.',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            read: true
          },
          {
            id: '3',
            sender: chat.user,
            content: chat.lastMessage?.content || '',
            timestamp: chat.lastMessage?.timestamp || new Date(),
            read: false
          }
        ]);
      }
    }
  }, [selectedChat, chats]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: {
        id: 'me',
        name: 'Me'
      },
      content: newMessage,
      timestamp: new Date(),
      read: true
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-10rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Messages</h1>
        <p className="text-gray-600">Connect with startups and team members</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm h-[calc(100%-6rem)] flex">
        {/* Chat List */}
        <div className="w-1/3 border-r">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedChat === chat.id ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        {chat.user.name[0]}
                      </div>
                      {chat.user.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{chat.user.name}</div>
                      {chat.lastMessage && (
                        <div className="text-sm text-gray-500 truncate">
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
            <div className="p-4 border-b">
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender.id === 'me' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender.id === 'me'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender.id === 'me' ? 'text-indigo-200' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border rounded-lg"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
