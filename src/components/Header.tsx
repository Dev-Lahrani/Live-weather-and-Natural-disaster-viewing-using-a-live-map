import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Mountain, 
  Droplets, 
  Flame, 
  CloudLightning, 
  TriangleAlert, 
  CloudSun,
  RefreshCw,
  AlertCircle,
  Users,
  Globe,
  Map,
  Wind
} from 'lucide-react';
import type { FilterState, DisasterCategory, DisasterEvent } from '../types';
import { CATEGORY_INFO } from '../utils/helpers';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (category: DisasterCategory) => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
  loading: boolean;
  disasters: DisasterEvent[];
  weatherCount: number;
}

const categoryIcons: Record<DisasterCategory, React.ReactNode> = {
  earthquakes: <Mountain className="w-4 h-4" />,
  floods: <Droplets className="w-4 h-4" />,
  wildfires: <Flame className="w-4 h-4" />,
  severeStorms: <CloudLightning className="w-4 h-4" />,
  volcanoes: <TriangleAlert className="w-4 h-4" />,
  weather: <CloudSun className="w-4 h-4" />,
};

export const Header: React.FC<HeaderProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  lastUpdated,
  loading,
  disasters,
  weatherCount,
}) => {
  const location = useLocation();
  const categories: DisasterCategory[] = ['earthquakes', 'floods', 'wildfires', 'severeStorms', 'volcanoes', 'weather'];

  // Calculate statistics
  const totalEvents = disasters.length;
  const severeCount = disasters.filter(d => 
    d.severity === 'severe' || d.severity === 'extreme' || d.severity === 'catastrophic'
  ).length;
  const redAlertCount = disasters.filter(d => d.alertLevel === 'red').length;
  const totalAffected = disasters.reduce((sum, d) => sum + (d.estimatedAffected || 0), 0);

  return (
    <header className="glass-darker px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      {/* Logo and Title */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="w-8 h-8 text-neon-cyan" />
            <div className="absolute inset-0 w-8 h-8 bg-neon-cyan/30 blur-lg rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white text-glow-cyan tracking-wide">
              GeoAlert
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Real-Time Disaster Monitoring
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-300 
              ${location.pathname === '/' 
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <Map className="w-4 h-4" />
            <span>Disasters</span>
          </Link>
          <Link
            to="/weather"
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-300 
              ${location.pathname === '/weather' 
                ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <Globe className="w-4 h-4" />
            <span>Global Weather</span>
          </Link>
          <Link
            to="/air-quality"
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-300 
              ${location.pathname === '/air-quality' 
                ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <Wind className="w-4 h-4" />
            <span>Air Quality</span>
          </Link>
        </nav>
      </div>

      {/* Filter Toggles */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => {
          const info = CATEGORY_INFO[cat];
          const isActive = filters[cat];
          const catCount = cat === 'weather' 
            ? weatherCount 
            : disasters.filter(d => d.category === cat).length;
          
          return (
            <button
              key={cat}
              onClick={() => onFilterChange(cat)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-300 ease-out relative
                ${isActive 
                  ? 'text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-200 bg-white/5 hover:bg-white/10'
                }
              `}
              style={{
                backgroundColor: isActive ? info.bgColor : undefined,
                borderWidth: '1px',
                borderColor: isActive ? info.borderColor : 'transparent',
                boxShadow: isActive ? `0 0 20px ${info.color}30` : undefined,
              }}
            >
              <span style={{ color: isActive ? info.color : undefined }}>
                {categoryIcons[cat]}
              </span>
              <span className="hidden sm:inline">{info.label}</span>
              {catCount > 0 && (
                <span 
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded-full ml-1"
                  style={{ 
                    backgroundColor: isActive ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)',
                    color: isActive ? info.color : undefined,
                  }}
                >
                  {catCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stats and Refresh */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 text-sm font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse" />
            <span className="text-gray-300">
              <span className="text-white font-bold">{totalEvents}</span> Events
            </span>
          </div>
          {severeCount > 0 && (
            <div className="flex items-center gap-2" title="Severe+ events">
              <AlertCircle className="w-3 h-3 text-orange-400" />
              <span className="text-orange-400">
                <span className="font-bold">{severeCount}</span> Severe
              </span>
            </div>
          )}
          {redAlertCount > 0 && (
            <div className="flex items-center gap-2 px-2 py-1 bg-red-500/20 rounded-full animate-pulse" title="Red alerts">
              <span className="text-red-400 text-xs font-bold">
                {redAlertCount} RED ALERT{redAlertCount > 1 ? 'S' : ''}
              </span>
            </div>
          )}
          {totalAffected > 0 && (
            <div className="flex items-center gap-2 hidden md:flex" title="Estimated affected">
              <Users className="w-3 h-3 text-neon-purple" />
              <span className="text-gray-300">
                <span className="text-neon-purple font-bold">
                  {totalAffected >= 1000000 
                    ? `${(totalAffected / 1000000).toFixed(1)}M` 
                    : totalAffected >= 1000 
                      ? `${(totalAffected / 1000).toFixed(0)}K`
                      : totalAffected
                  }
                </span> affected
              </span>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-700" />

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500 font-mono hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`
              p-2 rounded-lg bg-white/5 hover:bg-white/10 
              text-gray-400 hover:text-neon-cyan
              transition-all duration-300
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'spinner' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
