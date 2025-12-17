import React, { useState, useEffect } from 'react';
import { 
  Star, 
  X, 
  MapPin, 
  Thermometer, 
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  Bell,
  BellOff
} from 'lucide-react';
import type { WeatherData, DisasterEvent } from '../types';

interface WatchlistItem {
  id: string;
  type: 'city' | 'region' | 'disaster';
  name: string;
  country?: string;
  coordinates: [number, number];
  addedAt: string;
  notifyOnDisaster: boolean;
}

interface WatchlistProps {
  weather: WeatherData[];
  disasters: DisasterEvent[];
  onSelectLocation: (coords: [number, number]) => void;
}

const STORAGE_KEY = 'geoalert_watchlist';

export const Watchlist: React.FC<WatchlistProps> = ({
  weather,
  disasters,
  onSelectLocation,
}) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch {
        // Invalid data
      }
    }
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (item: Omit<WatchlistItem, 'id' | 'addedAt' | 'notifyOnDisaster'>) => {
    const newItem: WatchlistItem = {
      ...item,
      id: `${item.type}-${Date.now()}`,
      addedAt: new Date().toISOString(),
      notifyOnDisaster: true,
    };
    setWatchlist(prev => [...prev, newItem]);
    setShowAddModal(false);
    setSearchQuery('');
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };

  const toggleNotifications = (id: string) => {
    setWatchlist(prev => prev.map(item => 
      item.id === id ? { ...item, notifyOnDisaster: !item.notifyOnDisaster } : item
    ));
  };

  // Get weather data for a watchlist city
  const getWeatherForCity = (name: string) => {
    return weather.find(w => w.city.toLowerCase() === name.toLowerCase());
  };

  // Count nearby disasters for a location
  const getNearbyDisasters = (coords: [number, number], radiusKm: number = 500) => {
    return disasters.filter(d => {
      const [lon1, lat1] = coords;
      const [lon2, lat2] = d.coordinates;
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return distance <= radiusKm;
    }).length;
  };

  // Available cities to add (from weather data)
  const availableCities = weather.filter(w => 
    !watchlist.some(item => item.name.toLowerCase() === w.city.toLowerCase()) &&
    (searchQuery === '' || 
     w.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
     w.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (watchlist.length === 0 && !showAddModal) {
    return (
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Watchlist</span>
          </div>
        </div>
        <div className="text-center py-6">
          <Star className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-3">No locations saved</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-neon-cyan/20 text-neon-cyan rounded-lg text-xs hover:bg-neon-cyan/30 transition-colors"
          >
            <Plus className="w-3 h-3 inline mr-1" />
            Add Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">Watchlist</span>
          <span className="text-xs text-gray-500">({watchlist.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddModal(true);
            }}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-neon-cyan"
          >
            <Plus className="w-4 h-4" />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Watchlist Items */}
      {isExpanded && (
        <div className="border-t border-white/10 max-h-64 overflow-y-auto">
          {watchlist.map((item) => {
            const cityWeather = item.type === 'city' ? getWeatherForCity(item.name) : null;
            const nearbyCount = getNearbyDisasters(item.coordinates);
            
            return (
              <div
                key={item.id}
                className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => onSelectLocation(item.coordinates)}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-neon-cyan" />
                      <span className="text-sm font-medium text-white">{item.name}</span>
                      {item.country && (
                        <span className="text-xs text-gray-500">{item.country}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1">
                      {cityWeather && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Thermometer className="w-3 h-3" />
                          <span>{cityWeather.temperature}°C</span>
                        </div>
                      )}
                      {nearbyCount > 0 && (
                        <div className="flex items-center gap-1 text-xs text-orange-400">
                          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                          <span>{nearbyCount} alert{nearbyCount > 1 ? 's' : ''} nearby</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleNotifications(item.id)}
                      className={`p-1 rounded transition-colors ${
                        item.notifyOnDisaster 
                          ? 'text-neon-cyan hover:bg-neon-cyan/20' 
                          : 'text-gray-500 hover:bg-white/10'
                      }`}
                      title={item.notifyOnDisaster ? 'Notifications on' : 'Notifications off'}
                    >
                      {item.notifyOnDisaster ? (
                        <Bell className="w-3 h-3" />
                      ) : (
                        <BellOff className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-400/20 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-darker rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-medium text-white">Add to Watchlist</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery('');
                }}
                className="p-1 hover:bg-white/10 rounded text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
                autoFocus
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {availableCities.slice(0, 20).map((city) => (
                <button
                  key={`${city.city}-${city.country}`}
                  onClick={() => addToWatchlist({
                    type: 'city',
                    name: city.city,
                    country: city.country,
                    coordinates: city.coordinates,
                  })}
                  className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{city.city}</span>
                    <span className="text-xs text-gray-500">{city.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Thermometer className="w-3 h-3" />
                    <span>{city.temperature}°C</span>
                  </div>
                </button>
              ))}
              {availableCities.length === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {searchQuery ? 'No cities found' : 'All cities already in watchlist'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
