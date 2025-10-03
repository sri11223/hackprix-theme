"use client";
import { HeroParallax } from './Home';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Three.js Globe component
const DynamicHeroParallax = dynamic(() => import('./Home').then(mod => ({ default: mod.HeroParallax })), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
});

export default function ClientHome() {
  return <DynamicHeroParallax />;
}