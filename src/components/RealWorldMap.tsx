import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { DisasterEvent, WeatherData, DisasterCategory, SeverityLevel, AlertLevel } from '../types';
import { CATEGORY_INFO } from '../utils/helpers';
import { 
  Mountain, 
  Droplets, 
  Flame, 
  CloudLightning, 
  TriangleAlert, 
  CloudSun,
  ZoomIn,
  ZoomOut,
  Maximize2,
  type LucideProps
} from 'lucide-react';

interface WorldMapProps {
  disasters: DisasterEvent[];
  weather: WeatherData[];
  onSelectEvent: (event: DisasterEvent | WeatherData) => void;
  selectedEvent: DisasterEvent | WeatherData | null;
  showWeather: boolean;
}

const categoryIcons: Record<DisasterCategory, React.FC<LucideProps>> = {
  earthquakes: Mountain,
  floods: Droplets,
  wildfires: Flame,
  severeStorms: CloudLightning,
  volcanoes: TriangleAlert,
  weather: CloudSun,
};

// Severity-based colors for map markers
const severityMapColors: Record<SeverityLevel, { fill: string; stroke: string; pulse: boolean }> = {
  minor: { fill: '#22c55e20', stroke: '#22c55e', pulse: false },
  moderate: { fill: '#eab30820', stroke: '#eab308', pulse: false },
  severe: { fill: '#f9731620', stroke: '#f97316', pulse: true },
  extreme: { fill: '#ef444420', stroke: '#ef4444', pulse: true },
  catastrophic: { fill: '#a855f720', stroke: '#a855f7', pulse: true },
};

// Alert level pulse speeds
const alertPulseSpeeds: Record<AlertLevel, string> = {
  green: 'none',
  yellow: '2s',
  orange: '1.5s',
  red: '0.8s',
};

// Natural Earth TopoJSON URL (110m resolution for performance)
const LAND_GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';

interface TopoJSON {
  type: string;
  objects: {
    countries?: { geometries: unknown[] };
    land?: { geometries: unknown[] };
  };
  arcs: number[][][];
  transform?: { scale: [number, number]; translate: [number, number] };
}

// Convert TopoJSON arc index to path coordinates
function arcToCoordinates(arcIdx: number, arcs: number[][][], transform?: { scale: [number, number]; translate: [number, number] }): [number, number][] {
  const coords: [number, number][] = [];
  let x = 0, y = 0;
  
  const arcIndex = arcIdx < 0 ? ~arcIdx : arcIdx;
  const arcData = arcs[arcIndex];
  
  if (!arcData) return coords;
  
  for (let i = 0; i < arcData.length; i++) {
    x += arcData[i][0];
    y += arcData[i][1];
    
    let px = x, py = y;
    if (transform) {
      px = x * transform.scale[0] + transform.translate[0];
      py = y * transform.scale[1] + transform.translate[1];
    }
    
    coords.push([px, py]);
  }
  
  return arcIdx < 0 ? coords.reverse() : coords;
}

// Convert geo coordinates to SVG
function geoToSvg(lon: number, lat: number, width: number, height: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

// Convert coordinates to SVG path
function coordsToPath(coords: [number, number][], width: number, height: number): string {
  if (coords.length === 0) return '';
  
  const points = coords.map(([lon, lat]) => {
    const { x, y } = geoToSvg(lon, lat, width, height);
    return `${x},${y}`;
  });
  
  return `M${points.join('L')}Z`;
}

export const RealWorldMap: React.FC<WorldMapProps> = ({
  disasters,
  weather,
  onSelectEvent,
  selectedEvent,
  showWeather,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [landPaths, setLandPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const WIDTH = 1000;
  const HEIGHT = 500;

  // Load GeoJSON data
  useEffect(() => {
    const loadMapData = async () => {
      try {
        const response = await fetch(LAND_GEOJSON_URL);
        const topoData: TopoJSON = await response.json();
        
        const paths: string[] = [];
        const land = topoData.objects.land;
        
        if (land && 'geometries' in land) {
          for (const geom of land.geometries as { type: string; arcs: number[][] | number[][][] }[]) {
            if (geom.type === 'Polygon') {
              for (const ring of geom.arcs as number[][]) {
                const coords: [number, number][] = [];
                for (const arcIdx of ring) {
                  const arcCoords = arcToCoordinates(arcIdx, topoData.arcs, topoData.transform);
                  coords.push(...arcCoords);
                }
                if (coords.length > 0) {
                  paths.push(coordsToPath(coords, WIDTH, HEIGHT));
                }
              }
            } else if (geom.type === 'MultiPolygon') {
              for (const polygon of geom.arcs as number[][][]) {
                for (const ring of polygon) {
                  const coords: [number, number][] = [];
                  for (const arcIdx of ring) {
                    const arcCoords = arcToCoordinates(arcIdx, topoData.arcs, topoData.transform);
                    coords.push(...arcCoords);
                  }
                  if (coords.length > 0) {
                    paths.push(coordsToPath(coords, WIDTH, HEIGHT));
                  }
                }
              }
            }
          }
        }
        
        setLandPaths(paths);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load map data:', error);
        setLoading(false);
      }
    };
    
    loadMapData();
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(8, prev * delta)));
  }, []);

  const isEventSelected = (event: DisasterEvent | WeatherData) => {
    if (!selectedEvent) return false;
    if ('city' in selectedEvent && 'city' in event) {
      return selectedEvent.city === event.city;
    }
    if ('id' in selectedEvent && 'id' in event) {
      return selectedEvent.id === event.id;
    }
    return false;
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a12]">
      {/* Ocean background with gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #0d1a2d 0%, #0a0a12 70%)',
        }}
      />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Zoom controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 glass rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-neon-cyan"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 glass rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-neon-cyan"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 glass rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-neon-cyan"
          title="Reset View"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <div className="text-xs text-gray-500 text-center font-mono mt-1">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-neon-cyan text-sm font-mono animate-pulse">
            Loading map data...
          </div>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          transformOrigin: 'center',
        }}
      >
        <defs>
          {/* Land gradient */}
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a2a3a" />
            <stop offset="100%" stopColor="#152535" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="markerGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strong glow for selected */}
          <filter id="markerGlowStrong" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Graticule (lat/lon lines) */}
        {/* Longitude lines */}
        {Array.from({ length: 13 }, (_, i) => {
          const lon = -180 + i * 30;
          const { x } = geoToSvg(lon, 0, WIDTH, HEIGHT);
          return (
            <line
              key={`lon-${i}`}
              x1={x}
              y1="0"
              x2={x}
              y2={HEIGHT}
              stroke="rgba(0, 245, 255, 0.1)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Latitude lines */}
        {Array.from({ length: 7 }, (_, i) => {
          const lat = -90 + i * 30;
          const { y } = geoToSvg(0, lat, WIDTH, HEIGHT);
          return (
            <line
              key={`lat-${i}`}
              x1="0"
              y1={y}
              x2={WIDTH}
              y2={y}
              stroke="rgba(0, 245, 255, 0.1)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Equator */}
        <line
          x1="0"
          y1={HEIGHT / 2}
          x2={WIDTH}
          y2={HEIGHT / 2}
          stroke="rgba(191, 0, 255, 0.3)"
          strokeWidth="1"
          strokeDasharray="8,4"
        />

        {/* Land masses */}
        {landPaths.map((path, index) => (
          <path
            key={index}
            d={path}
            fill="url(#landGradient)"
            stroke="rgba(0, 245, 255, 0.4)"
            strokeWidth="0.5"
            className="transition-colors duration-200 hover:fill-[#1e3a4a]"
          />
        ))}

        {/* Ocean labels */}
        <text x="150" y="200" fill="rgba(0, 168, 255, 0.25)" fontSize="14" fontFamily="Inter, sans-serif" fontStyle="italic">Pacific Ocean</text>
        <text x="350" y="180" fill="rgba(0, 168, 255, 0.25)" fontSize="14" fontFamily="Inter, sans-serif" fontStyle="italic">Atlantic Ocean</text>
        <text x="620" y="280" fill="rgba(0, 168, 255, 0.25)" fontSize="14" fontFamily="Inter, sans-serif" fontStyle="italic">Indian Ocean</text>
        <text x="850" y="200" fill="rgba(0, 168, 255, 0.25)" fontSize="12" fontFamily="Inter, sans-serif" fontStyle="italic">Pacific</text>

        {/* Weather markers */}
        {showWeather && weather.map((w) => {
          const pos = geoToSvg(w.coordinates[0], w.coordinates[1], WIDTH, HEIGHT);
          const info = CATEGORY_INFO.weather;
          const isSelected = isEventSelected(w);
          
          return (
            <g
              key={`weather-${w.city}`}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectEvent(w);
              }}
              className="cursor-pointer"
              style={{ filter: isSelected ? 'url(#markerGlowStrong)' : 'url(#markerGlow)' }}
            >
              <circle
                r="8"
                fill="none"
                stroke={info.color}
                strokeWidth="1"
                opacity="0.4"
                className="marker-pulse-ring"
              />
              <circle
                r="5"
                fill={info.bgColor}
                stroke={isSelected ? info.color : info.borderColor}
                strokeWidth={isSelected ? 2 : 1}
              />
              <text
                x="8"
                y="3"
                fill={info.color}
                fontSize="7"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
              >
                {w.temperature}°
              </text>
            </g>
          );
        })}

        {/* Disaster markers */}
        {disasters.map((disaster) => {
          const pos = geoToSvg(disaster.coordinates[0], disaster.coordinates[1], WIDTH, HEIGHT);
          const IconComponent = categoryIcons[disaster.category];
          const isSelected = isEventSelected(disaster);
          
          // Get severity styling
          const severity = disaster.severity || 'minor';
          const alertLevel = disaster.alertLevel || 'green';
          const severityColors = severityMapColors[severity];
          const pulseSpeed = alertPulseSpeeds[alertLevel];
          const shouldPulse = severityColors.pulse || alertLevel === 'red' || alertLevel === 'orange';
          
          // Size based on magnitude for earthquakes, otherwise based on severity
          let baseSize = 8;
          if (disaster.magnitude) {
            baseSize = Math.min(6 + disaster.magnitude * 1.5, 20);
          } else if (severity === 'catastrophic') {
            baseSize = 16;
          } else if (severity === 'extreme') {
            baseSize = 14;
          } else if (severity === 'severe') {
            baseSize = 12;
          } else if (severity === 'moderate') {
            baseSize = 10;
          }
          
          return (
            <g
              key={disaster.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectEvent(disaster);
              }}
              className="cursor-pointer"
              style={{ filter: isSelected ? 'url(#markerGlowStrong)' : 'url(#markerGlow)' }}
            >
              {/* Impact radius ring (for severe+ events) */}
              {disaster.impactRadius && disaster.impactRadius > 20 && (
                <circle
                  r={Math.min(baseSize * 3, 40)}
                  fill={severityColors.fill}
                  stroke={severityColors.stroke}
                  strokeWidth="0.5"
                  opacity="0.2"
                  strokeDasharray="4,2"
                />
              )}

              {/* Outer pulse ring */}
              <circle
                r={baseSize + 8}
                fill="none"
                stroke={severityColors.stroke}
                strokeWidth="2"
                opacity="0.3"
                className={shouldPulse ? "marker-pulse-ring" : ""}
                style={shouldPulse ? { animationDuration: pulseSpeed } : {}}
              />
              
              {/* Inner pulse ring */}
              <circle
                r={baseSize + 4}
                fill="none"
                stroke={severityColors.stroke}
                strokeWidth="1"
                opacity="0.5"
                className={shouldPulse ? "marker-pulse-ring" : ""}
                style={shouldPulse ? { animationDelay: '0.4s', animationDuration: pulseSpeed } : {}}
              />
              
              {/* Main marker */}
              <circle
                r={baseSize}
                fill={severityColors.fill}
                stroke={isSelected ? '#fff' : severityColors.stroke}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className={shouldPulse ? "marker-pulse-dot" : ""}
              />
              
              {/* Icon */}
              <foreignObject 
                x={-baseSize * 0.5} 
                y={-baseSize * 0.5} 
                width={baseSize} 
                height={baseSize}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <IconComponent 
                    className="w-full h-full" 
                    style={{ color: severityColors.stroke, padding: '2px' }} 
                  />
                </div>
              </foreignObject>

              {/* Magnitude/severity label */}
              {disaster.magnitude ? (
                <text
                  x={baseSize + 3}
                  y="-2"
                  fill={severityColors.stroke}
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                >
                  M{disaster.magnitude.toFixed(1)}
                </text>
              ) : severity !== 'minor' && (
                <text
                  x={baseSize + 3}
                  y="-2"
                  fill={severityColors.stroke}
                  fontSize="6"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                >
                  {severity.toUpperCase()}
                </text>
              )}
              
              {/* Estimated affected indicator */}
              {disaster.estimatedAffected && disaster.estimatedAffected >= 100000 && (
                <text
                  x={baseSize + 3}
                  y="8"
                  fill="#a855f7"
                  fontSize="6"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {disaster.estimatedAffected >= 1000000 
                    ? `${(disaster.estimatedAffected / 1000000).toFixed(1)}M`
                    : `${(disaster.estimatedAffected / 1000).toFixed(0)}K`
                  } affected
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3 z-10">
        <div className="text-xs text-gray-400 mb-2 font-mono uppercase tracking-wider">Severity</div>
        <div className="flex flex-col gap-1.5 mb-3">
          {(['minor', 'moderate', 'severe', 'extreme', 'catastrophic'] as SeverityLevel[]).map((sev) => {
            const colors = severityMapColors[sev];
            return (
              <div key={sev} className="flex items-center gap-1.5">
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colors.stroke, boxShadow: `0 0 6px ${colors.stroke}` }}
                />
                <span className="text-[10px] text-gray-300 capitalize">{sev}</span>
              </div>
            );
          })}
        </div>
        <div className="text-xs text-gray-400 mb-2 font-mono uppercase tracking-wider border-t border-white/10 pt-2">Categories</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {Object.values(CATEGORY_INFO).map((info) => (
            <div key={info.id} className="flex items-center gap-1.5">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: info.color, boxShadow: `0 0 6px ${info.color}` }}
              />
              <span className="text-[10px] text-gray-300">{info.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats display */}
      <div className="absolute bottom-4 right-4 glass rounded-lg px-3 py-2 z-10">
        <div className="text-xs text-gray-500 font-mono">
          <span className="text-neon-cyan">{disasters.length}</span> Active Events | 
          <span className="text-neon-purple ml-1">{weather.length}</span> Weather Stations
        </div>
      </div>
    </div>
  );
};
