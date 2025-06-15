'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

const commonNavItems = [
  { label: 'Profile', path: 'profile', icon: '👤' },
  { label: 'Messages', path: 'messages', icon: '💬' },
  { label: 'Settings', path: 'settings', icon: '⚙️' },
];

const navItems = {
  INVESTOR: [
    { label: 'Dashboard', path: 'main', icon: '📊' },
    { label: 'Discover', path: 'discover', icon: '🔍' },
    { label: 'Portfolio', path: 'portfolio', icon: '💼' },
    { label: 'Pitch Arena', path: 'pitch-arena', icon: '🎤' },
    { label: 'Analytics', path: 'analytics', icon: '📈' },
    ...commonNavItems,
  ],
  STARTUP: [
    { label: 'Dashboard', path: 'main', icon: '📊' },
    { label: 'AI Feedback', path: 'feedback', icon: '🤖' },
    { label: 'Team', path: 'team', icon: '👥' },
    { label: 'Jobs', path: 'jobs', icon: '📋' },
    { label: 'Pitch Arena', path: 'pitch-arena', icon: '🎤' },
    { label: 'Investments', path: 'investments', icon: '💰' },
    ...commonNavItems,
  ],
  INDIVIDUAL: [
    { label: 'Dashboard', path: 'main', icon: '📊' },
    { label: 'Job Search', path: 'jobs', icon: '🔍' },
    { label: 'Applications', path: 'applications', icon: '📄' },
    { label: 'Career Advice', path: 'advice', icon: '💡' },
    { label: 'Teams', path: 'teams', icon: '👥' },
    ...commonNavItems,
  ],
};

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { type: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const userType = Cookies.get('userType');

  useEffect(() => {
    if (!userType || !navItems[userType as keyof typeof navItems]) {
      router.push('/login');
    }
  }, [userType, router]);

  if (!userType) return <div>Loading...</div>;

  const currentNavItems = navItems[userType as keyof typeof navItems] || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md fixed h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-600">HackPrix</h2>
          <p className="text-sm text-gray-500 mt-1 capitalize">{userType.toLowerCase()} dashboard</p>
        </div>
        <nav className="mt-6">
          {currentNavItems.map((item) => {
            const isActive = pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                href={`/dashboard/${params.type}/${item.path}`}
                className={`flex items-center px-6 py-3 transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}   