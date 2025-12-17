import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  Thermometer, 
  Wind, 
  Droplet, 
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Gauge,
  Sunrise,
  Sunset,
  MapPin,
  X,
  Loader2,
  Globe,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import type { WeatherData } from '../types';

// Comprehensive list of world cities
const WORLD_CITIES = [
  // North America
  { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, region: 'North America' },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lon: -118.2437, region: 'North America' },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lon: -87.6298, region: 'North America' },
  { name: 'Houston', country: 'USA', lat: 29.7604, lon: -95.3698, region: 'North America' },
  { name: 'Phoenix', country: 'USA', lat: 33.4484, lon: -112.0740, region: 'North America' },
  { name: 'Miami', country: 'USA', lat: 25.7617, lon: -80.1918, region: 'North America' },
  { name: 'Seattle', country: 'USA', lat: 47.6062, lon: -122.3321, region: 'North America' },
  { name: 'Denver', country: 'USA', lat: 39.7392, lon: -104.9903, region: 'North America' },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832, region: 'North America' },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207, region: 'North America' },
  { name: 'Montreal', country: 'Canada', lat: 45.5017, lon: -73.5673, region: 'North America' },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332, region: 'North America' },
  { name: 'Guadalajara', country: 'Mexico', lat: 20.6597, lon: -103.3496, region: 'North America' },
  
  // South America
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333, region: 'South America' },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729, region: 'South America' },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816, region: 'South America' },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lon: -77.0428, region: 'South America' },
  { name: 'Bogotá', country: 'Colombia', lat: 4.7110, lon: -74.0721, region: 'South America' },
  { name: 'Santiago', country: 'Chile', lat: -33.4489, lon: -70.6693, region: 'South America' },
  { name: 'Caracas', country: 'Venezuela', lat: 10.4806, lon: -66.9036, region: 'South America' },
  
  // Europe
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, region: 'Europe' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, region: 'Europe' },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, region: 'Europe' },
  { name: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, region: 'Europe' },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964, region: 'Europe' },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, region: 'Europe' },
  { name: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738, region: 'Europe' },
  { name: 'Prague', country: 'Czech Republic', lat: 50.0755, lon: 14.4378, region: 'Europe' },
  { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lon: 18.0686, region: 'Europe' },
  { name: 'Oslo', country: 'Norway', lat: 59.9139, lon: 10.7522, region: 'Europe' },
  { name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lon: 12.5683, region: 'Europe' },
  { name: 'Helsinki', country: 'Finland', lat: 60.1699, lon: 24.9384, region: 'Europe' },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lon: -6.2603, region: 'Europe' },
  { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lon: -9.1393, region: 'Europe' },
  { name: 'Athens', country: 'Greece', lat: 37.9838, lon: 23.7275, region: 'Europe' },
  { name: 'Warsaw', country: 'Poland', lat: 52.2297, lon: 21.0122, region: 'Europe' },
  { name: 'Budapest', country: 'Hungary', lat: 47.4979, lon: 19.0402, region: 'Europe' },
  { name: 'Brussels', country: 'Belgium', lat: 50.8503, lon: 4.3517, region: 'Europe' },
  { name: 'Zurich', country: 'Switzerland', lat: 47.3769, lon: 8.5417, region: 'Europe' },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173, region: 'Europe' },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lon: 28.9784, region: 'Europe' },
  
  // Asia
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, region: 'Asia' },
  { name: 'Osaka', country: 'Japan', lat: 34.6937, lon: 135.5023, region: 'Asia' },
  { name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074, region: 'Asia' },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737, region: 'Asia' },
  { name: 'Hong Kong', country: 'China', lat: 22.3193, lon: 114.1694, region: 'Asia' },
  { name: 'Shenzhen', country: 'China', lat: 22.5431, lon: 114.0579, region: 'Asia' },
  { name: 'Guangzhou', country: 'China', lat: 23.1291, lon: 113.2644, region: 'Asia' },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.9780, region: 'Asia' },
  { name: 'Busan', country: 'South Korea', lat: 35.1796, lon: 129.0756, region: 'Asia' },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, region: 'Asia' },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018, region: 'Asia' },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lon: 101.6869, region: 'Asia' },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lon: 106.8456, region: 'Asia' },
  { name: 'Manila', country: 'Philippines', lat: 14.5995, lon: 120.9842, region: 'Asia' },
  { name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lon: 106.6297, region: 'Asia' },
  { name: 'Hanoi', country: 'Vietnam', lat: 21.0278, lon: 105.8342, region: 'Asia' },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, region: 'Asia' },
  { name: 'Delhi', country: 'India', lat: 28.7041, lon: 77.1025, region: 'Asia' },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lon: 77.5946, region: 'Asia' },
  { name: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707, region: 'Asia' },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lon: 88.3639, region: 'Asia' },
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lon: 90.4125, region: 'Asia' },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lon: 67.0011, region: 'Asia' },
  { name: 'Taipei', country: 'Taiwan', lat: 25.0330, lon: 121.5654, region: 'Asia' },
  
  // Middle East
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, region: 'Middle East' },
  { name: 'Abu Dhabi', country: 'UAE', lat: 24.4539, lon: 54.3773, region: 'Middle East' },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lon: 46.6753, region: 'Middle East' },
  { name: 'Jeddah', country: 'Saudi Arabia', lat: 21.4858, lon: 39.1925, region: 'Middle East' },
  { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lon: 34.7818, region: 'Middle East' },
  { name: 'Doha', country: 'Qatar', lat: 25.2854, lon: 51.5310, region: 'Middle East' },
  { name: 'Kuwait City', country: 'Kuwait', lat: 29.3759, lon: 47.9774, region: 'Middle East' },
  { name: 'Muscat', country: 'Oman', lat: 23.5880, lon: 58.3829, region: 'Middle East' },
  { name: 'Tehran', country: 'Iran', lat: 35.6892, lon: 51.3890, region: 'Middle East' },
  
  // Africa
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357, region: 'Africa' },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lon: 3.3792, region: 'Africa' },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lon: 28.0473, region: 'Africa' },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lon: 18.4241, region: 'Africa' },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lon: 36.8219, region: 'Africa' },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lon: -7.5898, region: 'Africa' },
  { name: 'Accra', country: 'Ghana', lat: 5.6037, lon: -0.1870, region: 'Africa' },
  { name: 'Addis Ababa', country: 'Ethiopia', lat: 8.9806, lon: 38.7578, region: 'Africa' },
  { name: 'Dar es Salaam', country: 'Tanzania', lat: -6.7924, lon: 39.2083, region: 'Africa' },
  { name: 'Tunis', country: 'Tunisia', lat: 36.8065, lon: 10.1815, region: 'Africa' },
  
  // Oceania
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, region: 'Oceania' },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631, region: 'Oceania' },
  { name: 'Brisbane', country: 'Australia', lat: -27.4698, lon: 153.0251, region: 'Oceania' },
  { name: 'Perth', country: 'Australia', lat: -31.9505, lon: 115.8605, region: 'Oceania' },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8509, lon: 174.7645, region: 'Oceania' },
  { name: 'Wellington', country: 'New Zealand', lat: -41.2865, lon: 174.7762, region: 'Oceania' },
];

// Weather code to icon mapping
const getWeatherIcon = (code: number, isDay: boolean) => {
  if (code === 0 || code === 1) return isDay ? <Sun className="w-8 h-8 text-yellow-400" /> : <Sun className="w-8 h-8 text-gray-400" />;
  if (code === 2 || code === 3) return <Cloud className="w-8 h-8 text-gray-400" />;
  if (code >= 45 && code <= 48) return <CloudFog className="w-8 h-8 text-gray-400" />;
  if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="w-8 h-8 text-blue-200" />;
  if (code >= 80 && code <= 82) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (code >= 85 && code <= 86) return <CloudSnow className="w-8 h-8 text-blue-200" />;
  if (code >= 95) return <CloudLightning className="w-8 h-8 text-yellow-400" />;
  return <Cloud className="w-8 h-8 text-gray-400" />;
};

// Weather code descriptions
const weatherCodeDescriptions: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm',
};

interface ExtendedWeatherData extends WeatherData {
  region: string;
}

export const WeatherPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<ExtendedWeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<ExtendedWeatherData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const regions = ['all', 'North America', 'South America', 'Europe', 'Asia', 'Middle East', 'Africa', 'Oceania'];

  const fetchWeatherForCity = async (city: typeof WORLD_CITIES[0]): Promise<ExtendedWeatherData | null> => {
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,relative_humidity_2m,is_day,precipitation,cloud_cover,pressure_msl,surface_pressure&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;
      
      const response = await fetch(weatherUrl);
      if (!response.ok) return null;
      
      const data = await response.json();
      
      return {
        city: city.name,
        country: city.country,
        region: city.region,
        coordinates: [city.lon, city.lat],
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        tempMin: Math.round(data.daily?.temperature_2m_min?.[0] || data.current.temperature_2m - 3),
        tempMax: Math.round(data.daily?.temperature_2m_max?.[0] || data.current.temperature_2m + 3),
        weatherCode: data.current.weather_code,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: data.current.wind_direction_10m,
        windGusts: Math.round(data.current.wind_gusts_10m || 0),
        humidity: data.current.relative_humidity_2m,
        description: weatherCodeDescriptions[data.current.weather_code] || 'Unknown',
        isDay: data.current.is_day === 1,
        pressure: Math.round(data.current.pressure_msl || data.current.surface_pressure || 1013),
        uvIndex: Math.round(data.daily?.uv_index_max?.[0] || 0),
        cloudCover: data.current.cloud_cover,
        precipitation: data.current.precipitation || 0,
        precipitationProbability: data.daily?.precipitation_probability_max?.[0] || 0,
        sunrise: data.daily?.sunrise?.[0],
        sunset: data.daily?.sunset?.[0],
      };
    } catch (error) {
      console.error(`Failed to fetch weather for ${city.name}:`, error);
      return null;
    }
  };

  const [apiError, setApiError] = useState(false);

  const fetchAllWeather = useCallback(async () => {
    setLoading(true);
    setLoadingProgress(0);
    setApiError(false);
    
    // Check localStorage cache first
    const cacheKey = 'weatherData_cache';
    const cacheTimeKey = 'weatherData_cacheTime';
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTimeKey);
    
    // Use cache if less than 30 minutes old
    if (cachedData && cacheTime) {
      const cacheAge = Date.now() - parseInt(cacheTime);
      if (cacheAge < 30 * 60 * 1000) {
        try {
          const parsed = JSON.parse(cachedData);
          if (parsed.length > 0) {
            setWeatherData(parsed);
            setLastUpdated(new Date(parseInt(cacheTime)));
            setLoading(false);
            setLoadingProgress(100);
            return;
          }
        } catch {
          // Cache corrupted, continue fetching
        }
      }
    }
    
    const results: ExtendedWeatherData[] = [];
    const batchSize = 5; // Reduced batch size
    
    for (let i = 0; i < WORLD_CITIES.length; i += batchSize) {
      const batch = WORLD_CITIES.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(fetchWeatherForCity));
      
      batchResults.forEach((result) => {
        if (result) {
          results.push(result);
        }
      });
      
      setLoadingProgress(Math.round(((i + batchSize) / WORLD_CITIES.length) * 100));
      
      // Delay to avoid rate limiting
      if (i + batchSize < WORLD_CITIES.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // Check if API returned no data
    if (results.length === 0) {
      setApiError(true);
    }
    
    // Cache the results if we got any
    if (results.length > 0) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(results));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
      } catch {
        // localStorage full or unavailable
      }
    }
    
    setWeatherData(results);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllWeather();
  }, [fetchAllWeather]);

  // Filter weather data
  const filteredWeather = weatherData.filter(w => {
    const matchesSearch = searchQuery === '' || 
      w.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || w.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Stats
  const avgTemp = weatherData.length > 0
    ? Math.round(weatherData.reduce((sum, w) => sum + w.temperature, 0) / weatherData.length)
    : 0;
  const maxTemp = weatherData.length > 0
    ? Math.max(...weatherData.map(w => w.temperature))
    : 0;
  const minTemp = weatherData.length > 0
    ? Math.min(...weatherData.map(w => w.temperature))
    : 0;
  const hottestCity = weatherData.find(w => w.temperature === maxTemp);
  const coldestCity = weatherData.find(w => w.temperature === minTemp);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-cyber-darker text-white overflow-auto">
      {/* Header */}
      <header className="glass-darker px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-neon-cyan" />
              <div>
                <h1 className="text-xl font-bold text-white">Global Weather</h1>
                <p className="text-xs text-gray-400 font-mono">
                  {weatherData.length} cities worldwide
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-xs text-gray-500 font-mono">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchAllWeather}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-neon-cyan" />
              <span className="text-sm text-gray-400">Global Avg:</span>
              <span className="text-lg font-mono font-bold text-white">{avgTemp}°C</span>
            </div>
            {hottestCity && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-400">Hottest:</span>
                <span className="text-sm font-mono text-red-400">{hottestCity.city} {maxTemp}°C</span>
              </div>
            )}
            {coldestCity && (
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Coldest:</span>
                <span className="text-sm font-mono text-blue-400">{coldestCity.city} {minTemp}°C</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedRegion === region
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {region === 'all' ? 'All Regions' : region}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="px-6 py-12 text-center">
          <Loader2 className="w-12 h-12 text-neon-cyan mx-auto mb-4 animate-spin" />
          <p className="text-gray-400 mb-2">Loading weather data...</p>
          <div className="w-64 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-neon-cyan transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 font-mono">{loadingProgress}% complete</p>
          <p className="text-xs text-gray-600 mt-4">Fetching from Open-Meteo API...</p>
        </div>
      )}

      {/* API Error State */}
      {!loading && apiError && weatherData.length === 0 && (
        <div className="p-6">
          <div className="glass rounded-xl p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Cloud className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Weather Data Not Available</h3>
            <p className="text-gray-400 mb-4">
              The Open-Meteo API is currently rate-limited or unavailable. Please try again later.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('weatherData_cache');
                localStorage.removeItem('weatherData_cacheTime');
                fetchAllWeather();
              }}
              className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Weather Grid */}
      {!loading && weatherData.length > 0 && (
        <div className="p-6 pb-24">
          <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm text-gray-500">
              Showing {filteredWeather.length} of {weatherData.length} cities
            </span>
            {lastUpdated && (
              <span className="text-xs text-gray-600 font-mono">
                Data as of {lastUpdated.toLocaleTimeString()} • Data refreshes every 30 min
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {filteredWeather.map((weather) => (
              <div
                key={`${weather.city}-${weather.country}`}
                onClick={() => setSelectedCity(weather)}
                className="glass rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all hover:scale-[1.02] border border-transparent hover:border-neon-cyan/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-white">{weather.city}</h3>
                    <p className="text-xs text-gray-500">{weather.country}</p>
                  </div>
                  {getWeatherIcon(weather.weatherCode, weather.isDay)}
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold font-mono text-neon-cyan">
                      {weather.temperature}°
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {weather.description}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-red-400" />
                      {weather.tempMax}°
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-blue-400" />
                      {weather.tempMin}°
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    {weather.windSpeed} km/h
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplet className="w-3 h-3" />
                    {weather.humidity}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* City Detail Modal */}
      {selectedCity && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setSelectedCity(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-darker rounded-2xl z-50 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(selectedCity.weatherCode, selectedCity.isDay)}
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedCity.city}</h2>
                    <p className="text-gray-400">{selectedCity.country} • {selectedCity.region}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Temperature */}
              <div className="text-center mb-6">
                <div className="text-6xl font-bold font-mono text-neon-cyan mb-2">
                  {selectedCity.temperature}°C
                </div>
                <div className="text-gray-400">{selectedCity.description}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Feels like {selectedCity.feelsLike}°C
                </div>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <span className="text-red-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    H: {selectedCity.tempMax}°
                  </span>
                  <span className="text-blue-400 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" />
                    L: {selectedCity.tempMin}°
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Wind className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Wind</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.windSpeed} km/h</div>
                  {selectedCity.windGusts && selectedCity.windGusts > 0 && (
                    <div className="text-xs text-gray-500">Gusts: {selectedCity.windGusts} km/h</div>
                  )}
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Droplet className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Humidity</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.humidity}%</div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Gauge className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Pressure</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.pressure} hPa</div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Sun className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">UV Index</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.uvIndex ?? 'N/A'}</div>
                  <div className={`text-xs ${
                    (selectedCity.uvIndex ?? 0) <= 2 ? 'text-green-400' :
                    (selectedCity.uvIndex ?? 0) <= 5 ? 'text-yellow-400' :
                    (selectedCity.uvIndex ?? 0) <= 7 ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {(selectedCity.uvIndex ?? 0) <= 2 ? 'Low' :
                     (selectedCity.uvIndex ?? 0) <= 5 ? 'Moderate' :
                     (selectedCity.uvIndex ?? 0) <= 7 ? 'High' :
                     (selectedCity.uvIndex ?? 0) <= 10 ? 'Very High' : 'Extreme'}
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Cloud className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Cloud Cover</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.cloudCover}%</div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <CloudRain className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Precipitation</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.precipitationProbability}%</div>
                  <div className="text-xs text-gray-500">chance</div>
                </div>
              </div>

              {/* Sunrise/Sunset */}
              <div className="flex items-center justify-around p-4 bg-white/5 rounded-xl mb-6">
                <div className="text-center">
                  <Sunrise className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Sunrise</div>
                  <div className="font-mono text-white">{formatTime(selectedCity.sunrise)}</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <Sunset className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-400">Sunset</div>
                  <div className="font-mono text-white">{formatTime(selectedCity.sunset)}</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" />
                <span className="font-mono">
                  {selectedCity.coordinates[1].toFixed(4)}°, {selectedCity.coordinates[0].toFixed(4)}°
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
