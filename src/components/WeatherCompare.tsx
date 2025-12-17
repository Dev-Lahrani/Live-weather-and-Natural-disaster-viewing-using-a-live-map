import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Thermometer, 
  Wind, 
  Droplet, 
  Sun,
  Gauge,
  ArrowUpDown,
  BarChart3
} from 'lucide-react';
import type { WeatherData } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

interface WeatherCompareProps {
  weather: WeatherData[];
  isOpen: boolean;
  onClose: () => void;
}

export const WeatherCompare: React.FC<WeatherCompareProps> = ({
  weather,
  isOpen,
  onClose,
}) => {
  const [selectedCities, setSelectedCities] = useState<WeatherData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCity, setShowAddCity] = useState(false);

  if (!isOpen) return null;

  const addCity = (city: WeatherData) => {
    if (selectedCities.length < 4 && !selectedCities.find(c => c.city === city.city)) {
      setSelectedCities([...selectedCities, city]);
    }
    setShowAddCity(false);
    setSearchQuery('');
  };

  const removeCity = (cityName: string) => {
    setSelectedCities(selectedCities.filter(c => c.city !== cityName));
  };

  const filteredCities = weather.filter(w => 
    !selectedCities.find(c => c.city === w.city) &&
    (searchQuery === '' || 
     w.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
     w.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Chart data
  const temperatureData = selectedCities.map(city => ({
    name: city.city,
    temperature: city.temperature,
    feelsLike: city.feelsLike || city.temperature,
    min: city.tempMin || city.temperature - 3,
    max: city.tempMax || city.temperature + 3,
  }));

  const radarData = selectedCities.length > 0 ? [
    { metric: 'Temperature', ...Object.fromEntries(selectedCities.map(c => [c.city, Math.max(0, c.temperature + 20)])) },
    { metric: 'Humidity', ...Object.fromEntries(selectedCities.map(c => [c.city, c.humidity])) },
    { metric: 'Wind Speed', ...Object.fromEntries(selectedCities.map(c => [c.city, c.windSpeed * 2])) },
    { metric: 'Pressure', ...Object.fromEntries(selectedCities.map(c => [c.city, ((c.pressure || 1013) - 980) * 2])) },
    { metric: 'Cloud Cover', ...Object.fromEntries(selectedCities.map(c => [c.city, c.cloudCover || 0])) },
    { metric: 'UV Index', ...Object.fromEntries(selectedCities.map(c => [c.city, (c.uvIndex || 0) * 10])) },
  ] : [];

  const colors = ['#00f5ff', '#bf00ff', '#ff6600', '#00ff88'];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="glass-darker rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-neon-cyan" />
            <h2 className="text-lg font-bold text-white">Weather Comparison</h2>
            <span className="text-xs text-gray-500">Compare up to 4 cities</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Selection */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCities.map((city, index) => (
              <div
                key={city.city}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ 
                  backgroundColor: `${colors[index]}20`,
                  borderColor: colors[index],
                  borderWidth: '1px'
                }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="text-white text-sm">{city.city}</span>
                <span className="text-xs text-gray-400">{city.country}</span>
                <button
                  onClick={() => removeCity(city.city)}
                  className="p-0.5 hover:bg-white/20 rounded text-gray-400 hover:text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {selectedCities.length < 4 && (
              <div className="relative">
                <button
                  onClick={() => setShowAddCity(!showAddCity)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-neon-cyan/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add City</span>
                </button>
                
                {showAddCity && (
                  <div className="absolute top-full left-0 mt-2 w-64 glass-darker rounded-lg overflow-hidden z-10 shadow-xl">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search cities..."
                      className="w-full px-3 py-2 bg-white/5 border-b border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none"
                      autoFocus
                    />
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCities.slice(0, 10).map(city => (
                        <button
                          key={city.city}
                          onClick={() => addCity(city)}
                          className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center justify-between"
                        >
                          <span className="text-white text-sm">{city.city}, {city.country}</span>
                          <span className="text-xs text-gray-400">{city.temperature}°C</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedCities.length === 0 ? (
            <div className="text-center py-12">
              <ArrowUpDown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select cities to compare their weather</p>
              <p className="text-xs text-gray-600 mt-2">Click "Add City" to start comparing</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedCities.map((city, index) => (
                  <div 
                    key={city.city}
                    className="p-4 rounded-xl"
                    style={{ 
                      backgroundColor: `${colors[index]}10`,
                      borderColor: colors[index],
                      borderWidth: '1px'
                    }}
                  >
                    <div className="text-center mb-3">
                      <h3 className="font-medium text-white">{city.city}</h3>
                      <p className="text-xs text-gray-500">{city.country}</p>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-4xl font-bold font-mono"
                        style={{ color: colors[index] }}
                      >
                        {city.temperature}°
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{city.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Droplet className="w-3 h-3" />
                        <span>{city.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Wind className="w-3 h-3" />
                        <span>{city.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Gauge className="w-3 h-3" />
                        <span>{city.pressure || 1013} hPa</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Sun className="w-3 h-3" />
                        <span>UV {city.uvIndex || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Temperature Chart */}
              {selectedCities.length > 1 && (
                <div className="glass rounded-xl p-4">
                  <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-neon-cyan" />
                    Temperature Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} unit="°C" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(10,10,20,0.9)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="min" fill="#3b82f6" name="Min" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="temperature" fill="#00f5ff" name="Current" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="max" fill="#ef4444" name="Max" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Radar Chart */}
              {selectedCities.length > 1 && (
                <div className="glass rounded-xl p-4">
                  <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-neon-purple" />
                    Weather Metrics Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="metric" stroke="#666" fontSize={11} />
                      <PolarRadiusAxis stroke="#666" fontSize={10} />
                      {selectedCities.map((city, index) => (
                        <Radar
                          key={city.city}
                          name={city.city}
                          dataKey={city.city}
                          stroke={colors[index]}
                          fill={colors[index]}
                          fillOpacity={0.2}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Comparison Table */}
              {selectedCities.length > 1 && (
                <div className="glass rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3 text-gray-400 font-medium">Metric</th>
                        {selectedCities.map((city, index) => (
                          <th 
                            key={city.city} 
                            className="text-center p-3 font-medium"
                            style={{ color: colors[index] }}
                          >
                            {city.city}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="p-3 text-gray-400">Temperature</td>
                        {selectedCities.map(city => (
                          <td key={city.city} className="text-center p-3 text-white font-mono">{city.temperature}°C</td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3 text-gray-400">Feels Like</td>
                        {selectedCities.map(city => (
                          <td key={city.city} className="text-center p-3 text-white font-mono">{city.feelsLike || city.temperature}°C</td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3 text-gray-400">Humidity</td>
                        {selectedCities.map(city => (
                          <td key={city.city} className="text-center p-3 text-white font-mono">{city.humidity}%</td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3 text-gray-400">Wind Speed</td>
                        {selectedCities.map(city => (
                          <td key={city.city} className="text-center p-3 text-white font-mono">{city.windSpeed} km/h</td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3 text-gray-400">Pressure</td>
                        {selectedCities.map(city => (
                          <td key={city.city} className="text-center p-3 text-white font-mono">{city.pressure || 1013} hPa</td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3 text-gray-400">UV Index</td>
                        {selectedCities.map(city => (
                          <td key={city.city} className="text-center p-3 text-white font-mono">{city.uvIndex || 0}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-3 text-gray-400">Cloud Cover</td>
                        {selectedCities.map(city => (
                          <td key={city.city} className="text-center p-3 text-white font-mono">{city.cloudCover || 0}%</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
