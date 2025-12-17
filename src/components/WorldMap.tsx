import React from 'react';
import type { DisasterEvent, WeatherData, DisasterCategory } from '../types';
import { coordsToMapPosition, CATEGORY_INFO } from '../utils/helpers';
import { 
  Mountain, 
  Droplets, 
  Flame, 
  CloudLightning, 
  TriangleAlert, 
  CloudSun,
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

// Simplified world map paths (continents)
const worldMapPaths = [
  // North America
  "M150 100 L180 90 L220 85 L260 90 L280 100 L290 120 L285 150 L270 180 L250 200 L220 220 L180 230 L140 225 L110 210 L95 180 L90 150 L100 120 L120 105 Z",
  // South America  
  "M220 260 L250 250 L270 270 L280 310 L275 360 L260 400 L240 430 L220 440 L200 430 L190 400 L195 350 L205 300 L210 270 Z",
  // Europe
  "M450 90 L480 85 L510 90 L530 100 L535 120 L520 140 L490 150 L460 145 L440 130 L435 110 L440 95 Z",
  // Africa
  "M460 170 L500 160 L530 170 L550 200 L555 250 L545 300 L520 340 L490 360 L460 355 L440 320 L435 270 L445 220 L450 190 Z",
  // Asia
  "M550 80 L620 70 L700 75 L780 90 L830 110 L850 140 L845 180 L820 210 L770 230 L710 235 L650 225 L600 200 L560 160 L545 120 L550 95 Z",
  // Australia
  "M780 300 L830 290 L870 300 L890 330 L885 370 L860 395 L820 400 L785 390 L770 360 L775 320 Z",
  // Greenland
  "M320 50 L360 45 L390 55 L400 75 L390 95 L360 100 L330 95 L315 75 L320 55 Z",
  // Indonesia/SE Asia
  "M720 250 L760 245 L800 255 L820 270 L815 290 L790 295 L750 290 L725 275 L720 260 Z",
  // Japan
  "M850 130 L865 125 L875 135 L873 155 L860 165 L850 160 L845 145 Z",
  // UK/Ireland
  "M430 85 L445 80 L455 88 L452 100 L440 105 L430 98 Z",
  // Madagascar
  "M570 340 L585 335 L592 355 L588 380 L575 390 L565 380 L565 355 Z",
  // New Zealand
  "M920 380 L935 375 L945 390 L940 410 L925 420 L915 410 L918 395 Z",
];

export const WorldMap: React.FC<WorldMapProps> = ({
  disasters,
  weather,
  onSelectEvent,
  selectedEvent,
  showWeather,
}) => {
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
    <div className="relative w-full h-full overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full world-map"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 245, 255, 0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          {/* Marker glow filters */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <rect x="0" y="0" width="1000" height="500" fill="url(#mapGlow)" />

        {/* World map continents */}
        {worldMapPaths.map((path, index) => (
          <path
            key={index}
            d={path}
            className="map-land"
          />
        ))}

        {/* Weather markers */}
        {showWeather && weather.map((w) => {
          const pos = coordsToMapPosition(w.coordinates[0], w.coordinates[1]);
          const info = CATEGORY_INFO.weather;
          const IconComponent = categoryIcons.weather;
          const isSelected = isEventSelected(w);
          
          return (
            <g
              key={`weather-${w.city}`}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={() => onSelectEvent(w)}
              className="cursor-pointer"
              style={{ filter: 'url(#glow)' }}
            >
              {/* Pulse ring */}
              <circle
                r="12"
                fill="none"
                stroke={info.color}
                strokeWidth="1"
                opacity="0.5"
                className="marker-pulse-ring"
              />
              
              {/* Background circle */}
              <circle
                r="8"
                fill={info.bgColor}
                stroke={isSelected ? info.color : info.borderColor}
                strokeWidth={isSelected ? 2 : 1}
                className="marker-pulse-dot"
              />
              
              {/* Icon */}
              <foreignObject x="-6" y="-6" width="12" height="12">
                <div className="flex items-center justify-center w-full h-full">
                  <IconComponent className="w-3 h-3" style={{ color: info.color }} />
                </div>
              </foreignObject>

              {/* Temperature label */}
              <text
                x="12"
                y="4"
                fill={info.color}
                fontSize="8"
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
          const pos = coordsToMapPosition(disaster.coordinates[0], disaster.coordinates[1]);
          const info = CATEGORY_INFO[disaster.category];
          const IconComponent = categoryIcons[disaster.category];
          const isSelected = isEventSelected(disaster);
          
          return (
            <g
              key={disaster.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={() => onSelectEvent(disaster)}
              className="cursor-pointer"
              style={{ filter: 'url(#glow)' }}
            >
              {/* Outer pulse ring */}
              <circle
                r="18"
                fill="none"
                stroke={info.color}
                strokeWidth="2"
                opacity="0.3"
                className="marker-pulse-ring"
              />
              
              {/* Inner pulse ring */}
              <circle
                r="14"
                fill="none"
                stroke={info.color}
                strokeWidth="1"
                opacity="0.5"
                className="marker-pulse-ring"
                style={{ animationDelay: '0.5s' }}
              />
              
              {/* Main marker */}
              <circle
                r="10"
                fill={info.bgColor}
                stroke={isSelected ? info.color : info.borderColor}
                strokeWidth={isSelected ? 3 : 2}
                className="marker-pulse-dot"
              />
              
              {/* Icon */}
              <foreignObject x="-7" y="-7" width="14" height="14">
                <div className="flex items-center justify-center w-full h-full">
                  <IconComponent className="w-4 h-4" style={{ color: info.color }} />
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3">
        <div className="text-xs text-gray-400 mb-2 font-mono">LEGEND</div>
        <div className="flex flex-wrap gap-3">
          {Object.values(CATEGORY_INFO).map((info) => (
            <div key={info.id} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: info.color }}
              />
              <span className="text-xs text-gray-300">{info.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
