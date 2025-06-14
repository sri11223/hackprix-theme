export type GlobePosition = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
  category: 'startup' | 'investor' | 'mentor' | 'partnership';
};

export const globeData: GlobePosition[] = [
  // Startup Funding Connections (Purple)
  {
    order: 1,
    startLat: 37.7749, // San Francisco (Startup)
    startLng: -122.4194,
    endLat: 40.7128,   // New York (Investor)
    endLng: -74.0060,
    arcAlt: 0.2,
    color: "#8b5cf6",  // purple-500
    category: 'startup'
  },
  {
    order: 2,
    startLat: 51.5074, // London (Startup)
    startLng: -0.1278,
    endLat: 52.5200,   // Berlin (Investor)
    endLng: 13.4050,
    arcAlt: 0.3,
    color: "#7c3aed",  // purple-600
    category: 'startup'
  },

  // Investor Connections (Pink)
  {
    order: 3,
    startLat: 35.6762, // Tokyo (Investor)
    startLng: 139.6503,
    endLat: 1.3521,    // Singapore (Startup)
    endLng: 103.8198,
    arcAlt: 0.4,
    color: "#ec4899",  // pink-500
    category: 'investor'
  },
  {
    order: 4,
    startLat: 22.3193, // Hong Kong (Investor)
    startLng: 114.1694,
    endLat: 37.5665,   // Seoul (Startup)
    endLng: 126.9780,
    arcAlt: 0.25,
    color: "#db2777",  // pink-600
    category: 'investor'
  },

  // Mentor Connections (Blue)
  {
    order: 5,
    startLat: 48.8566, // Paris (Mentor)
    startLng: 2.3522,
    endLat: 55.7558,   // Moscow (Startup)
    endLng: 37.6173,
    arcAlt: 0.35,
    color: "#3b82f6",  // blue-500
    category: 'mentor'
  },
  {
    order: 6,
    startLat: 34.0522, // Los Angeles (Mentor)
    startLng: -118.2437,
    endLat: 19.4326,   // Mexico City (Startup)
    endLng: -99.1332,
    arcAlt: 0.15,
    color: "#2563eb",  // blue-600
    category: 'mentor'
  },

  // Strategic Partnerships (Teal)
  {
    order: 7,
    startLat: -33.8688, // Sydney (Corporate)
    startLng: 151.2093,
    endLat: -23.5505,  // São Paulo (Startup)
    endLng: -46.6333,
    arcAlt: 0.5,
    color: "#14b8a6",  // teal-500
    category: 'partnership'
  },
  {
    order: 8,
    startLat: 28.6139, // Delhi (Corporate)
    startLng: 77.2090,
    endLat: 39.9042,   // Beijing (Startup)
    endLng: 116.4074,
    arcAlt: 0.45,
    color: "#0d9488",  // teal-600
    category: 'partnership'
  },

  // Additional connections for density
  {
    order: 9,
    startLat: 41.9028, // Rome
    startLng: 12.4964,
    endLat: 59.3293,   // Stockholm
    endLng: 18.0686,
    arcAlt: 0.3,
    color: "#8b5cf6",
    category: 'startup'
  },
  {
    order: 10,
    startLat: -34.6037, // Buenos Aires
    startLng: -58.3816,
    endLat: 43.6532,    // Toronto
    endLng: -79.3832,
    arcAlt: 0.4,
    color: "#ec4899",
    category: 'investor'
  }
];

// Optional: Filter functions if you want to show specific categories
export const getStartupConnections = () => globeData.filter(item => item.category === 'startup');
export const getInvestorConnections = () => globeData.filter(item => item.category === 'investor');
export const getMentorConnections = () => globeData.filter(item => item.category === 'mentor');