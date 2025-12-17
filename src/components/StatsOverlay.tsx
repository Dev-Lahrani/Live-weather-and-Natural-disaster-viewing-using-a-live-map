import React from 'react';
import type { DisasterEvent, WeatherData } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle,
  Thermometer,
  Wind,
  Droplet,
  Mountain
} from 'lucide-react';

interface StatsOverlayProps {
  disasters: DisasterEvent[];
  weather: WeatherData[];
  isVisible: boolean;
}

export const StatsOverlay: React.FC<StatsOverlayProps> = ({
  disasters,
  weather,
  isVisible,
}) => {
  if (!isVisible) return null;

  // Calculate statistics
  const earthquakes = disasters.filter(d => d.category === 'earthquakes');
  const avgMagnitude = earthquakes.length > 0
    ? earthquakes.reduce((sum, e) => sum + (e.magnitude || 0), 0) / earthquakes.length
    : 0;
  
  const maxMagnitude = earthquakes.length > 0
    ? Math.max(...earthquakes.map(e => e.magnitude || 0))
    : 0;

  const severeCount = disasters.filter(d => 
    d.severity === 'severe' || d.severity === 'extreme' || d.severity === 'catastrophic'
  ).length;

  const totalAffected = disasters.reduce((sum, d) => sum + (d.estimatedAffected || 0), 0);

  // Weather stats
  const avgTemp = weather.length > 0
    ? Math.round(weather.reduce((sum, w) => sum + w.temperature, 0) / weather.length)
    : 0;
  
  const maxTemp = weather.length > 0
    ? Math.max(...weather.map(w => w.temperature))
    : 0;
  
  const minTemp = weather.length > 0
    ? Math.min(...weather.map(w => w.temperature))
    : 0;

  const avgHumidity = weather.length > 0
    ? Math.round(weather.reduce((sum, w) => sum + w.humidity, 0) / weather.length)
    : 0;

  const avgWind = weather.length > 0
    ? Math.round(weather.reduce((sum, w) => sum + w.windSpeed, 0) / weather.length)
    : 0;

  // Category breakdown
  const categoryBreakdown = disasters.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="absolute top-20 left-4 z-20 space-y-3 w-72">
      {/* Disaster Stats */}
      <div className="glass-darker rounded-2xl p-5 animate-slide-in border border-white/5 shadow-xl">
        <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-neon-cyan" />
          Disaster Statistics
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between group">
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Total Events</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-white">{disasters.length}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-orange-500/15 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
              </div>
              Severe+
            </span>
            <span className="text-xl font-bold font-mono text-orange-400">{severeCount}</span>
          </div>

          {earthquakes.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-red-500/15 flex items-center justify-center">
                    <Mountain className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  Avg Magnitude
                </span>
                <span className="text-xl font-bold font-mono text-red-400">M{avgMagnitude.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 pl-8">Max Magnitude</span>
                <span className="text-lg font-bold font-mono text-red-400/80">M{maxMagnitude.toFixed(1)}</span>
              </div>
            </>
          )}

          {totalAffected > 0 && (
            <>
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Est. Affected</span>
                <span className="text-xl font-bold font-mono bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                  {totalAffected >= 1000000 
                    ? `${(totalAffected / 1000000).toFixed(1)}M` 
                    : totalAffected >= 1000 
                      ? `${(totalAffected / 1000).toFixed(0)}K`
                      : totalAffected
                  }
                </span>
              </div>
            </>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="text-xs text-gray-500 mb-2">By Category</div>
          <div className="space-y-1">
            {Object.entries(categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neon-cyan rounded-full"
                    style={{ width: `${(count / disasters.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-20 truncate capitalize">
                  {category}
                </span>
                <span className="text-xs font-mono text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Stats */}
      <div className="glass-darker rounded-xl p-4 animate-slide-in" style={{ animationDelay: '100ms' }}>
        <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Thermometer className="w-4 h-4" />
          Global Weather
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Avg Temperature</span>
            <span className="text-lg font-mono text-neon-cyan">{avgTemp}°C</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-red-400" />
              Highest
            </span>
            <span className="text-lg font-mono text-red-400">{maxTemp}°C</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-blue-400" />
              Lowest
            </span>
            <span className="text-lg font-mono text-blue-400">{minTemp}°C</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Droplet className="w-3 h-3" />
              Avg Humidity
            </span>
            <span className="text-lg font-mono text-white">{avgHumidity}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Wind className="w-3 h-3" />
              Avg Wind
            </span>
            <span className="text-lg font-mono text-white">{avgWind} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
