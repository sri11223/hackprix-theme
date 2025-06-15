import Link from 'next/link'
import Head from 'next/head'; // Import the Head component
import { HeroParallax } from './components/Home/Home';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Startups', href: '/startups' },
  { name: 'Investors', href: '/investors' },
  { name: 'Stats', href: '/stats' },
  { name: 'About', href: '/about' },
  { name: 'Login', href: '/login' },
  { name: 'Register', href: '/register' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Add the Head component with your title */}
      <Head>
        <title>StartupConnect | Home</title>
        <meta name="description" content="Connecting startups with investors" />
      </Head>
      
      {/* Navigation Bar */}
      <nav className="flex gap-8 px-8 py-4 border-b border-gray-200 bg-white">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-700 hover:text-blue-600 transition-colors font-semibold"
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <HeroParallax />
    </div>
  )
}