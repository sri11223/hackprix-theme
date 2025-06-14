// components/GlobeComponent.tsx
'use client'
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Type declarations
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElements["mesh"] & {
      new (): ThreeGlobe;
    };
  }
}

extend({ ThreeGlobe: ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type GlobePosition = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
  category: 'startup' | 'investor' | 'mentor' | 'partnership';
};

type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface GlobeComponentProps {
  className?: string;
  height?: number;
  data: GlobePosition[];
}

const defaultGlobeConfig: GlobeConfig = {
  pointSize: 1,
  globeColor: "#1d072e",
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.1,
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

// Sample country data (simplified version)
const sampleCountries = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "United States" },
      geometry: {
        type: "Polygon",
        coordinates: [[[-100, 40], [-120, 35], [-80, 30], [-100, 40]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "United Kingdom" },
      geometry: {
        type: "Polygon",
        coordinates: [[[-5, 50], [0, 55], [5, 50], [-5, 50]]]
      }
    }
  ]
};

function Globe({ globeConfig, data }: { globeConfig: GlobeConfig; data: GlobePosition[] }) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      groupRef.current.add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  }, [isInitialized, globeConfig]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    const points = data.flatMap(arc => [
      {
        size: globeConfig.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      },
      {
        size: globeConfig.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      }
    ]);

    // Setup globe with sample countries
    globeRef.current
      .hexPolygonsData(sampleCountries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(globeConfig.showAtmosphere ?? true)
      .atmosphereColor(globeConfig.atmosphereColor || "#ffffff")
      .atmosphereAltitude(globeConfig.atmosphereAltitude ?? 0.1)
      .hexPolygonColor(() => globeConfig.polygonColor || "rgba(255,255,255,0.7)");

    // Setup arcs
    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => (d as { startLat: number }).startLat)
      .arcStartLng((d) => (d as { startLng: number }).startLng)
      .arcEndLat((d) => (d as { endLat: number }).endLat)
      .arcEndLng((d) => (d as { endLng: number }).endLng)
      .arcColor((e: any) => (e as { color: string }).color)
      .arcAltitude((e) => (e as { arcAlt: number }).arcAlt)
      .arcDashLength(globeConfig.arcLength ?? 0.9)
      .arcDashAnimateTime(() => globeConfig.arcTime ?? 2000);

    // Setup points
    globeRef.current
      .pointsData(points)
      .pointColor((e) => (e as { color: string }).color)
      .pointAltitude(0.0)
      .pointRadius(2);

    // Setup rings animation
    const interval = setInterval(() => {
      if (!globeRef.current) return;
      
      const ringsData = data
        .filter((_, i) => Math.random() > 0.5)
        .map((d) => ({
          lat: d.startLat,
          lng: d.startLng,
          color: d.color,
        }));

      globeRef.current.ringsData(ringsData);
    }, 2000);

    return () => clearInterval(interval);
  }, [isInitialized, data, globeConfig]);

  return <group ref={groupRef} />;
}

function World({ globeConfig, data }: { globeConfig: GlobeConfig; data: GlobePosition[] }) {
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe globeConfig={globeConfig} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={globeConfig.autoRotateSpeed}
        autoRotate={globeConfig.autoRotate}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function GlobeComponent({ 
  className = "", 
  height = 600,
  data 
}: GlobeComponentProps) {
  // Count unique categories
  const categoryCount = new Set(data.map(d => d.category)).size;
  
  return (
    <div className={`w-full ${className} relative overflow-hidden`} style={{ height }}>
      {/* Globe Visualization */}
      <World globeConfig={defaultGlobeConfig} data={data} />
      
      {/* Text Overlays */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-6 md:p-8">
        {/* Top Section */}
        <div className="max-w-lg bg-black/50 backdrop-blur-sm rounded-xl p-4 md:p-6 transition-all duration-300 hover:bg-black/60">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Our Global Network
          </h2>
          <p className="text-blue-100 text-sm md:text-base">
            Connecting innovators across {categoryCount} sectors worldwide through strategic partnerships and collaborations.
          </p>
        </div>

        {/* Middle Section */}
        <div className="self-center text-center">
          <div className="inline-block bg-gradient-to-r from-purple-900/80 to-blue-800/80 p-4 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-100 mb-2">
              {data.length}+
            </div>
            <p className="text-blue-100 text-sm md:text-base font-medium">
              Active Connections
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-end">
          <div className="max-w-md bg-black/50 backdrop-blur-sm rounded-xl p-4 md:p-6 transition-all duration-300 hover:bg-black/60">
            <h3 className="text-xl font-semibold text-white mb-2">Real-Time Visualization</h3>
            <p className="text-blue-100 text-sm md:text-base">
              Each arc represents a live connection. Rings indicate recent activity in our growing ecosystem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}