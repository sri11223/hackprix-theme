import Link from 'next/link'
import {ResizableNavbar} from './components/Header/Navbar';
import {HeroParallax} from './components/Home/Home';
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <HeroParallax/>

      {/* Hero Section */}
      {/* <main className="container mx-auto py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-blue-600">StartupHub</span>
        </h1>
        <p className="text-lg mb-8">
          The AI-powered platform connecting startups and investors
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </main> */}
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Link 
      href={href}
      className="text-gray-700 hover:text-blue-600 transition-colors"
    >
      {children}
    </Link>
  )
}