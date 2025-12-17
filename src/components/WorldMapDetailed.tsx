import React, { useState, useRef } from 'react';
import type { DisasterEvent, WeatherData, DisasterCategory } from '../types';
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

// Detailed country paths (simplified but accurate world map)
const countries: { name: string; path: string; labelPos?: [number, number] }[] = [
  // North America
  { name: "Canada", path: "M55,65 L58,55 L75,50 L95,48 L115,50 L130,52 L145,58 L155,52 L170,55 L180,60 L175,72 L160,78 L150,82 L140,88 L125,92 L110,90 L95,88 L80,85 L70,78 L60,75 Z", labelPos: [110, 70] },
  { name: "USA", path: "M60,95 L75,90 L95,92 L115,95 L130,98 L145,102 L150,110 L145,120 L135,125 L120,128 L105,130 L90,128 L75,125 L65,118 L58,108 L55,100 Z M155,108 L170,105 L175,115 L168,122 L158,118 Z", labelPos: [105, 112] },
  { name: "Mexico", path: "M65,130 L80,128 L95,132 L105,138 L100,150 L92,158 L80,155 L70,148 L65,140 Z", labelPos: [82, 145] },
  { name: "Alaska", path: "M30,55 L45,50 L55,55 L52,65 L40,68 L30,62 Z", labelPos: [42, 58] },
  
  // Central America & Caribbean
  { name: "Guatemala", path: "M82,158 L88,156 L92,162 L88,168 L82,165 Z" },
  { name: "Cuba", path: "M100,145 L120,142 L125,148 L118,152 L105,150 Z", labelPos: [112, 148] },
  
  // South America
  { name: "Colombia", path: "M95,175 L110,170 L120,178 L115,190 L100,192 L92,185 Z", labelPos: [105, 182] },
  { name: "Venezuela", path: "M110,168 L130,165 L135,175 L125,182 L115,178 Z", labelPos: [122, 175] },
  { name: "Brazil", path: "M115,195 L145,188 L160,200 L165,225 L155,255 L135,270 L115,265 L100,245 L98,220 L105,205 Z", labelPos: [135, 235] },
  { name: "Argentina", path: "M100,270 L120,268 L130,285 L125,320 L115,350 L105,355 L95,340 L92,305 L95,285 Z", labelPos: [110, 310] },
  { name: "Chile", path: "M88,280 L95,278 L98,300 L95,340 L90,370 L85,375 L82,350 L84,310 Z", labelPos: [88, 330] },
  { name: "Peru", path: "M80,200 L95,195 L100,215 L95,235 L85,240 L75,225 L78,210 Z", labelPos: [88, 220] },
  
  // Europe
  { name: "UK", path: "M430,72 L438,68 L445,72 L442,82 L435,88 L428,82 Z", labelPos: [436, 78] },
  { name: "Ireland", path: "M420,72 L428,70 L430,78 L425,84 L418,80 Z", labelPos: [424, 78] },
  { name: "France", path: "M435,92 L450,88 L462,95 L458,108 L445,112 L432,105 Z", labelPos: [448, 100] },
  { name: "Spain", path: "M420,105 L440,100 L445,112 L438,122 L420,120 L415,112 Z", labelPos: [430, 112] },
  { name: "Portugal", path: "M410,108 L418,105 L420,118 L415,125 L408,120 Z", labelPos: [414, 115] },
  { name: "Germany", path: "M455,82 L472,78 L480,88 L475,98 L460,100 L452,92 Z", labelPos: [466, 90] },
  { name: "Italy", path: "M465,102 L478,98 L485,108 L480,125 L470,135 L462,125 L460,112 Z", labelPos: [472, 118] },
  { name: "Poland", path: "M480,78 L500,75 L508,85 L502,95 L485,95 L478,88 Z", labelPos: [492, 86] },
  { name: "Ukraine", path: "M505,82 L535,78 L545,88 L540,100 L520,102 L505,95 Z", labelPos: [525, 90] },
  { name: "Norway", path: "M462,52 L475,45 L485,50 L480,65 L468,72 L458,65 Z", labelPos: [472, 58] },
  { name: "Sweden", path: "M478,48 L490,42 L498,52 L495,70 L482,75 L475,65 Z", labelPos: [486, 60] },
  { name: "Finland", path: "M500,40 L515,35 L525,45 L520,62 L508,65 L498,55 Z", labelPos: [512, 52] },
  
  // Russia (spans Europe and Asia)
  { name: "Russia", path: "M520,40 L620,30 L720,35 L800,45 L830,60 L825,80 L780,95 L720,100 L650,95 L580,90 L540,85 L520,75 L515,55 Z", labelPos: [680, 65] },
  
  // Middle East
  { name: "Turkey", path: "M520,105 L555,100 L570,108 L565,118 L540,120 L520,115 Z", labelPos: [545, 110] },
  { name: "Iran", path: "M575,110 L605,105 L620,118 L615,135 L590,140 L575,130 Z", labelPos: [595, 122] },
  { name: "Iraq", path: "M555,115 L575,112 L580,128 L570,140 L555,138 L550,125 Z", labelPos: [565, 128] },
  { name: "Saudi Arabia", path: "M545,140 L580,135 L595,150 L585,175 L555,180 L540,165 L542,150 Z", labelPos: [565, 160] },
  { name: "UAE", path: "M595,155 L608,152 L612,162 L605,168 L595,165 Z" },
  
  // Africa
  { name: "Morocco", path: "M410,130 L432,125 L440,138 L435,152 L418,155 L408,145 Z", labelPos: [425, 142] },
  { name: "Algeria", path: "M432,128 L465,122 L478,138 L472,165 L445,170 L430,158 Z", labelPos: [455, 148] },
  { name: "Libya", path: "M470,135 L505,130 L515,150 L508,175 L480,180 L468,165 Z", labelPos: [490, 158] },
  { name: "Egypt", path: "M510,140 L535,135 L545,155 L540,175 L520,180 L508,168 Z", labelPos: [528, 160] },
  { name: "Sudan", path: "M520,180 L548,175 L555,200 L545,225 L520,228 L510,210 Z", labelPos: [535, 205] },
  { name: "Ethiopia", path: "M545,210 L570,205 L580,225 L570,245 L548,248 L540,230 Z", labelPos: [558, 228] },
  { name: "Kenya", path: "M548,248 L565,245 L572,265 L560,280 L545,275 L542,260 Z", labelPos: [555, 262] },
  { name: "Tanzania", path: "M545,280 L565,275 L575,295 L565,315 L545,318 L535,300 Z", labelPos: [555, 298] },
  { name: "South Africa", path: "M495,330 L535,325 L550,345 L545,375 L520,385 L495,378 L485,355 Z", labelPos: [520, 358] },
  { name: "Nigeria", path: "M455,205 L480,200 L490,218 L482,238 L458,242 L448,225 Z", labelPos: [470, 222] },
  { name: "DRC", path: "M490,250 L520,245 L530,270 L522,300 L498,305 L485,285 Z", labelPos: [508, 278] },
  
  // Asia
  { name: "India", path: "M620,135 L655,128 L680,145 L685,180 L670,210 L640,218 L615,200 L610,165 Z", labelPos: [650, 175] },
  { name: "Pakistan", path: "M600,125 L625,118 L635,135 L625,155 L605,158 L595,142 Z", labelPos: [615, 140] },
  { name: "China", path: "M680,90 L750,82 L800,95 L810,125 L790,155 L740,165 L695,155 L675,130 Z", labelPos: [745, 125] },
  { name: "Mongolia", path: "M700,75 L760,68 L785,80 L775,95 L725,100 L698,90 Z", labelPos: [742, 85] },
  { name: "Kazakhstan", path: "M580,70 L640,62 L680,72 L672,90 L620,95 L575,88 Z", labelPos: [628, 80] },
  { name: "Japan", path: "M835,105 L852,98 L860,110 L855,128 L840,135 L832,120 Z", labelPos: [846, 118] },
  { name: "South Korea", path: "M820,115 L832,112 L838,125 L830,135 L820,130 Z", labelPos: [828, 125] },
  { name: "North Korea", path: "M815,105 L830,100 L835,112 L825,118 L815,115 Z" },
  { name: "Vietnam", path: "M752,168 L765,162 L775,180 L770,205 L758,210 L750,190 Z", labelPos: [762, 188] },
  { name: "Thailand", path: "M738,175 L752,170 L758,192 L750,215 L738,218 L732,198 Z", labelPos: [745, 195] },
  { name: "Myanmar", path: "M718,155 L738,148 L748,168 L742,192 L725,198 L715,178 Z", labelPos: [732, 175] },
  { name: "Indonesia", path: "M745,235 L800,228 L850,238 L860,255 L830,268 L775,272 L745,262 L740,248 Z", labelPos: [800, 252] },
  { name: "Philippines", path: "M795,178 L812,172 L820,188 L812,208 L798,212 L790,195 Z", labelPos: [805, 192] },
  { name: "Malaysia", path: "M748,222 L772,218 L782,232 L775,248 L752,252 L745,238 Z", labelPos: [762, 235] },
  
  // Oceania
  { name: "Australia", path: "M780,295 L850,285 L895,305 L905,345 L885,385 L835,400 L785,395 L760,360 L765,320 Z", labelPos: [835, 345] },
  { name: "New Zealand", path: "M905,385 L920,378 L930,395 L925,420 L912,428 L902,415 L900,398 Z", labelPos: [915, 405] },
  { name: "Papua New Guinea", path: "M855,255 L885,248 L898,265 L890,282 L865,288 L852,275 Z", labelPos: [875, 268] },
  
  // Greenland & Iceland
  { name: "Greenland", path: "M295,25 L345,18 L380,28 L390,55 L375,75 L340,82 L305,75 L290,55 L288,38 Z", labelPos: [340, 50] },
  { name: "Iceland", path: "M395,48 L415,45 L425,55 L420,65 L405,68 L395,60 Z", labelPos: [410, 58] },
];

// Ocean labels
const oceans = [
  { name: "Pacific Ocean", x: 120, y: 200 },
  { name: "Atlantic Ocean", x: 320, y: 180 },
  { name: "Indian Ocean", x: 620, y: 280 },
  { name: "Arctic Ocean", x: 500, y: 25 },
  { name: "Southern Ocean", x: 500, y: 420 },
];

// Major geographic features
const features = [
  { name: "Equator", y: 250 },
  { name: "Tropic of Cancer", y: 183 },
  { name: "Tropic of Capricorn", y: 317 },
];

export const WorldMapDetailed: React.FC<WorldMapProps> = ({
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
  const svgRef = useRef<SVGSVGElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.3, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.3, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom(prev => Math.min(prev * 1.1, 5));
    } else {
      setZoom(prev => Math.max(prev / 1.1, 0.5));
    }
  };

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

  // Convert geo coordinates to SVG coordinates (viewBox 0 0 1000 500)
  const geoToSvg = (lon: number, lat: number) => {
    const x = ((lon + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-cyber-darker via-[#0a0a18] to-cyber-darker">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px',
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

      <svg
        ref={svgRef}
        viewBox="0 0 1000 500"
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
        {/* Definitions */}
        <defs>
          {/* Ocean gradient */}
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#050510" />
            <stop offset="50%" stopColor="#0a0a20" />
            <stop offset="100%" stopColor="#050515" />
          </linearGradient>
          
          {/* Land gradient */}
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(40, 40, 70, 0.9)" />
            <stop offset="100%" stopColor="rgba(25, 25, 50, 0.9)" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stronger glow for selected */}
          <filter id="glowStrong" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ocean background */}
        <rect x="0" y="0" width="1000" height="500" fill="url(#oceanGradient)" />

        {/* Latitude/Longitude grid */}
        {/* Longitude lines */}
        {Array.from({ length: 13 }, (_, i) => (
          <line
            key={`lon-${i}`}
            x1={i * (1000 / 12)}
            y1="0"
            x2={i * (1000 / 12)}
            y2="500"
            stroke="rgba(0, 245, 255, 0.08)"
            strokeWidth="0.5"
          />
        ))}
        {/* Latitude lines */}
        {Array.from({ length: 7 }, (_, i) => (
          <line
            key={`lat-${i}`}
            x1="0"
            y1={i * (500 / 6)}
            x2="1000"
            y2={i * (500 / 6)}
            stroke="rgba(0, 245, 255, 0.08)"
            strokeWidth="0.5"
          />
        ))}

        {/* Geographic lines */}
        {features.map((feature) => (
          <g key={feature.name}>
            <line
              x1="0"
              y1={feature.y}
              x2="1000"
              y2={feature.y}
              stroke="rgba(191, 0, 255, 0.2)"
              strokeWidth="1"
              strokeDasharray="8,4"
            />
            <text
              x="15"
              y={feature.y - 5}
              fill="rgba(191, 0, 255, 0.4)"
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
            >
              {feature.name}
            </text>
          </g>
        ))}

        {/* Countries */}
        {countries.map((country) => (
          <g key={country.name}>
            <path
              d={country.path}
              fill="url(#landGradient)"
              stroke="rgba(0, 245, 255, 0.4)"
              strokeWidth="0.8"
              className="transition-all duration-300 hover:fill-[rgba(50,50,90,0.95)] hover:stroke-[rgba(0,245,255,0.8)]"
            />
            {country.labelPos && (
              <text
                x={country.labelPos[0]}
                y={country.labelPos[1]}
                fill="rgba(255, 255, 255, 0.6)"
                fontSize="7"
                fontFamily="Inter, sans-serif"
                textAnchor="middle"
                className="pointer-events-none select-none"
              >
                {country.name}
              </text>
            )}
          </g>
        ))}

        {/* Ocean labels */}
        {oceans.map((ocean) => (
          <text
            key={ocean.name}
            x={ocean.x}
            y={ocean.y}
            fill="rgba(0, 168, 255, 0.35)"
            fontSize="12"
            fontFamily="Inter, sans-serif"
            fontWeight="300"
            fontStyle="italic"
            textAnchor="middle"
            className="pointer-events-none select-none"
          >
            {ocean.name}
          </text>
        ))}

        {/* Weather markers */}
        {showWeather && weather.map((w) => {
          const pos = geoToSvg(w.coordinates[0], w.coordinates[1]);
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
              style={{ filter: isSelected ? 'url(#glowStrong)' : 'url(#glow)' }}
            >
              {/* Pulse ring */}
              <circle
                r="10"
                fill="none"
                stroke={info.color}
                strokeWidth="1"
                opacity="0.4"
                className="marker-pulse-ring"
              />
              
              {/* Background circle */}
              <circle
                r="6"
                fill={info.bgColor}
                stroke={isSelected ? info.color : info.borderColor}
                strokeWidth={isSelected ? 2 : 1}
              />
              
              {/* Temperature label */}
              <text
                x="10"
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
          const pos = geoToSvg(disaster.coordinates[0], disaster.coordinates[1]);
          const info = CATEGORY_INFO[disaster.category];
          const IconComponent = categoryIcons[disaster.category];
          const isSelected = isEventSelected(disaster);
          
          // Size based on magnitude for earthquakes
          const baseSize = disaster.magnitude 
            ? Math.min(8 + disaster.magnitude * 1.5, 18) 
            : 10;
          
          return (
            <g
              key={disaster.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectEvent(disaster);
              }}
              className="cursor-pointer"
              style={{ filter: isSelected ? 'url(#glowStrong)' : 'url(#glow)' }}
            >
              {/* Outer pulse ring */}
              <circle
                r={baseSize + 8}
                fill="none"
                stroke={info.color}
                strokeWidth="2"
                opacity="0.3"
                className="marker-pulse-ring"
              />
              
              {/* Inner pulse ring */}
              <circle
                r={baseSize + 4}
                fill="none"
                stroke={info.color}
                strokeWidth="1"
                opacity="0.5"
                className="marker-pulse-ring"
                style={{ animationDelay: '0.5s' }}
              />
              
              {/* Main marker */}
              <circle
                r={baseSize}
                fill={info.bgColor}
                stroke={isSelected ? info.color : info.borderColor}
                strokeWidth={isSelected ? 3 : 2}
                className="marker-pulse-dot"
              />
              
              {/* Icon */}
              <foreignObject 
                x={-baseSize * 0.6} 
                y={-baseSize * 0.6} 
                width={baseSize * 1.2} 
                height={baseSize * 1.2}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <IconComponent 
                    className="w-full h-full p-0.5" 
                    style={{ color: info.color }} 
                  />
                </div>
              </foreignObject>

              {/* Magnitude label for earthquakes */}
              {disaster.magnitude && (
                <text
                  x={baseSize + 4}
                  y="3"
                  fill={info.color}
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                >
                  M{disaster.magnitude.toFixed(1)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3 z-10">
        <div className="text-xs text-gray-400 mb-2 font-mono uppercase tracking-wider">Legend</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {Object.values(CATEGORY_INFO).map((info) => (
            <div key={info.id} className="flex items-center gap-1.5">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: info.color, boxShadow: `0 0 6px ${info.color}` }}
              />
              <span className="text-xs text-gray-300">{info.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coordinates display */}
      <div className="absolute bottom-4 right-4 glass rounded-lg px-3 py-2 z-10">
        <div className="text-xs text-gray-500 font-mono">
          <span className="text-neon-cyan">{disasters.length}</span> Active Events
        </div>
      </div>
    </div>
  );
};
