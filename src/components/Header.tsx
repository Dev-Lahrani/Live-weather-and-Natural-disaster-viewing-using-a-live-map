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
    <header className="glass-darker px-6 py-3 flex items-center justify-between gap-6 flex-wrap border-b border-white/5">
      {/* Logo and Title */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 w-10 h-10 bg-neon-cyan/20 blur-xl rounded-full group-hover:bg-neon-cyan/30 transition-all duration-500" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-neon-cyan" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                GeoAlert
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 font-mono uppercase tracking-wider">
                Live
              </span>
            </h1>
            <p className="text-[11px] text-gray-500 font-medium tracking-wide">
              Global Disaster Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-300 relative overflow-hidden
              ${location.pathname === '/' 
                ? 'bg-gradient-to-r from-neon-cyan/15 to-neon-cyan/5 text-neon-cyan border border-neon-cyan/40 shadow-lg shadow-neon-cyan/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Map className="w-4 h-4" />
            <span>Disasters</span>
            {location.pathname === '/' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
            )}
          </Link>
          <Link
            to="/weather"
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-300 relative overflow-hidden
              ${location.pathname === '/weather' 
                ? 'bg-gradient-to-r from-neon-purple/15 to-neon-purple/5 text-neon-purple border border-neon-purple/40 shadow-lg shadow-neon-purple/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Globe className="w-4 h-4" />
            <span>Weather</span>
            {location.pathname === '/weather' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
            )}
          </Link>
          <Link
            to="/air-quality"
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-300 relative overflow-hidden
              ${location.pathname === '/air-quality' 
                ? 'bg-gradient-to-r from-neon-green/15 to-neon-green/5 text-neon-green border border-neon-green/40 shadow-lg shadow-neon-green/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <Wind className="w-4 h-4" />
            <span>Air Quality</span>
            {location.pathname === '/air-quality' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-neon-green to-transparent" />
            )}
          </Link>
        </nav>
      </div>

      {/* Filter Toggles */}
      <div className="flex items-center gap-1.5 flex-wrap">
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
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                transition-all duration-300 ease-out relative group
                ${isActive 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-gray-300 bg-white/[0.03] hover:bg-white/[0.06] border border-transparent hover:border-white/10'
                }
              `}
              style={{
                background: isActive 
                  ? `linear-gradient(135deg, ${info.color}15, ${info.color}08)` 
                  : undefined,
                borderWidth: '1px',
                borderColor: isActive ? `${info.color}40` : undefined,
                boxShadow: isActive ? `0 0 16px ${info.color}15, inset 0 1px 0 ${info.color}10` : undefined,
              }}
            >
              <span style={{ color: isActive ? info.color : undefined }} className="transition-colors duration-300">
                {categoryIcons[cat]}
              </span>
              <span className="hidden lg:inline">{info.label}</span>
              {catCount > 0 && (
                <span 
                  className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md ml-0.5 transition-all duration-300"
                  style={{ 
                    background: isActive ? `${info.color}25` : 'rgba(255,255,255,0.08)',
                    color: isActive ? info.color : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {catCount}
                </span>
              )}
              {isActive && (
                <div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${info.color}10, transparent)` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Stats and Refresh */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Total Events Stat */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-neon-cyan" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-neon-cyan animate-ping opacity-50" />
            </div>
            <span className="text-xs font-medium text-gray-400">
              <span className="text-white font-bold text-sm">{totalEvents}</span> events
            </span>
          </div>
          
          {severeCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-semibold text-orange-400">
                {severeCount} Severe
              </span>
            </div>
          )}
          
          {redAlertCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
                {redAlertCount} Alert{redAlertCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          {totalAffected > 0 && (
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
              <Users className="w-3.5 h-3.5 text-neon-purple" />
              <span className="text-xs font-medium text-gray-400">
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

        <div className="h-5 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[10px] text-gray-500 font-mono hidden md:block px-2 py-1 rounded bg-white/[0.02]">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`
              p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] 
              text-gray-400 hover:text-neon-cyan
              border border-transparent hover:border-neon-cyan/30
              transition-all duration-300 group
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'spinner' : 'group-hover:rotate-45 transition-transform duration-300'}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
