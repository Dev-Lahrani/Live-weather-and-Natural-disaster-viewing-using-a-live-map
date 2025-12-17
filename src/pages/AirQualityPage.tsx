import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  Wind,
  Loader2,
  MapPin,
  X,
  AlertTriangle,
  Leaf,
  Factory,
  Droplets,
  Info
} from 'lucide-react';

interface AirQualityData {
  city: string;
  country: string;
  region: string;
  coordinates: [number, number];
  aqi: number; // US AQI
  aqiLevel: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  pm25: number;
  pm10: number;
  ozone: number;
  no2: number;
  so2: number;
  co: number;
}

// Major cities for AQI monitoring
const AQI_CITIES = [
  { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, region: 'North America' },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lon: -118.2437, region: 'North America' },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lon: -87.6298, region: 'North America' },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332, region: 'North America' },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832, region: 'North America' },
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333, region: 'South America' },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816, region: 'South America' },
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, region: 'Europe' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, region: 'Europe' },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, region: 'Europe' },
  { name: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, region: 'Europe' },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964, region: 'Europe' },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173, region: 'Europe' },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lon: 28.9784, region: 'Europe' },
  { name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074, region: 'Asia' },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737, region: 'Asia' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, region: 'Asia' },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.9780, region: 'Asia' },
  { name: 'Delhi', country: 'India', lat: 28.7041, lon: 77.1025, region: 'Asia' },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, region: 'Asia' },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018, region: 'Asia' },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, region: 'Asia' },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lon: 106.8456, region: 'Asia' },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, region: 'Middle East' },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lon: 46.6753, region: 'Middle East' },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357, region: 'Africa' },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lon: 3.3792, region: 'Africa' },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lon: 28.0473, region: 'Africa' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, region: 'Oceania' },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631, region: 'Oceania' },
];

const getAQILevel = (aqi: number): AirQualityData['aqiLevel'] => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy-sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
};

const getAQIColor = (level: AirQualityData['aqiLevel']) => {
  switch (level) {
    case 'good': return '#22c55e';
    case 'moderate': return '#eab308';
    case 'unhealthy-sensitive': return '#f97316';
    case 'unhealthy': return '#ef4444';
    case 'very-unhealthy': return '#7c3aed';
    case 'hazardous': return '#991b1b';
  }
};

const getAQILabel = (level: AirQualityData['aqiLevel']) => {
  switch (level) {
    case 'good': return 'Good';
    case 'moderate': return 'Moderate';
    case 'unhealthy-sensitive': return 'Unhealthy for Sensitive';
    case 'unhealthy': return 'Unhealthy';
    case 'very-unhealthy': return 'Very Unhealthy';
    case 'hazardous': return 'Hazardous';
  }
};

export const AirQualityPage: React.FC = () => {
  const [aqiData, setAqiData] = useState<AirQualityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<AirQualityData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiError, setApiError] = useState(false);

  const regions = ['all', 'North America', 'South America', 'Europe', 'Asia', 'Middle East', 'Africa', 'Oceania'];

  const fetchAQIForCity = async (city: typeof AQI_CITIES[0]): Promise<AirQualityData | null> => {
    try {
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
      
      const response = await fetch(url);
      if (!response.ok) return null;
      
      const data = await response.json();
      
      const aqi = Math.round(data.current.us_aqi || 0);
      
      return {
        city: city.name,
        country: city.country,
        region: city.region,
        coordinates: [city.lon, city.lat],
        aqi,
        aqiLevel: getAQILevel(aqi),
        pm25: Math.round(data.current.pm2_5 || 0),
        pm10: Math.round(data.current.pm10 || 0),
        ozone: Math.round(data.current.ozone || 0),
        no2: Math.round(data.current.nitrogen_dioxide || 0),
        so2: Math.round(data.current.sulphur_dioxide || 0),
        co: Math.round(data.current.carbon_monoxide || 0),
      };
    } catch (error) {
      console.error(`Failed to fetch AQI for ${city.name}:`, error);
      return null;
    }
  };

  const fetchAllAQI = useCallback(async () => {
    setLoading(true);
    setLoadingProgress(0);
    setApiError(false);
    
    // Check cache
    const cacheKey = 'aqiData_cache';
    const cacheTimeKey = 'aqiData_cacheTime';
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTimeKey);
    
    if (cachedData && cacheTime) {
      const cacheAge = Date.now() - parseInt(cacheTime);
      if (cacheAge < 30 * 60 * 1000) {
        try {
          const parsed = JSON.parse(cachedData);
          if (parsed.length > 0) {
            setAqiData(parsed);
            setLastUpdated(new Date(parseInt(cacheTime)));
            setLoading(false);
            setLoadingProgress(100);
            return;
          }
        } catch {
          // Continue fetching
        }
      }
    }
    
    const results: AirQualityData[] = [];
    const batchSize = 5;
    
    for (let i = 0; i < AQI_CITIES.length; i += batchSize) {
      const batch = AQI_CITIES.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(fetchAQIForCity));
      
      batchResults.forEach(result => {
        if (result) results.push(result);
      });
      
      setLoadingProgress(Math.round(((i + batchSize) / AQI_CITIES.length) * 100));
      
      if (i + batchSize < AQI_CITIES.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    if (results.length === 0) {
      setApiError(true);
    } else {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(results));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
      } catch {
        // Storage full
      }
    }
    
    setAqiData(results);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllAQI();
  }, [fetchAllAQI]);

  const filteredData = aqiData.filter(d => {
    const matchesSearch = searchQuery === '' || 
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || d.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Sort by AQI (worst first)
  const sortedData = [...filteredData].sort((a, b) => b.aqi - a.aqi);

  // Stats
  const avgAQI = aqiData.length > 0
    ? Math.round(aqiData.reduce((sum, d) => sum + d.aqi, 0) / aqiData.length)
    : 0;
  const worstCity = aqiData.reduce((worst, d) => d.aqi > (worst?.aqi || 0) ? d : worst, aqiData[0]);
  const bestCity = aqiData.reduce((best, d) => d.aqi < (best?.aqi || 999) ? d : best, aqiData[0]);

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
              <Wind className="w-8 h-8 text-neon-green" />
              <div>
                <h1 className="text-xl font-bold text-white">Air Quality Index</h1>
                <p className="text-xs text-gray-400 font-mono">
                  {aqiData.length} cities monitored
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
              onClick={() => {
                localStorage.removeItem('aqiData_cache');
                localStorage.removeItem('aqiData_cacheTime');
                fetchAllAQI();
              }}
              disabled={loading}
              className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-neon-green transition-colors ${loading ? 'opacity-50' : ''}`}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-6 py-4 glass border-b border-white/10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-gray-500 uppercase">Global Avg</span>
              <div className="text-2xl font-bold font-mono" style={{ color: getAQIColor(getAQILevel(avgAQI)) }}>
                {avgAQI}
              </div>
            </div>
            {worstCity && (
              <div>
                <span className="text-xs text-gray-500 uppercase">Worst</span>
                <div className="text-sm">
                  <span className="font-mono text-red-400">{worstCity.aqi}</span>
                  <span className="text-gray-400 ml-2">{worstCity.city}</span>
                </div>
              </div>
            )}
            {bestCity && (
              <div>
                <span className="text-xs text-gray-500 uppercase">Best</span>
                <div className="text-sm">
                  <span className="font-mono text-green-400">{bestCity.aqi}</span>
                  <span className="text-gray-400 ml-2">{bestCity.city}</span>
                </div>
              </div>
            )}
          </div>

          {/* AQI Legend */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">AQI:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }} />
              <span className="text-gray-400">Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#eab308' }} />
              <span className="text-gray-400">Moderate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }} />
              <span className="text-gray-400">Unhealthy*</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }} />
              <span className="text-gray-400">Unhealthy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#7c3aed' }} />
              <span className="text-gray-400">Very Unhealthy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#991b1b' }} />
              <span className="text-gray-400">Hazardous</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
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

        <div className="flex items-center gap-2 flex-wrap">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedRegion === region
                  ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
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
          <Loader2 className="w-12 h-12 text-neon-green mx-auto mb-4 animate-spin" />
          <p className="text-gray-400 mb-2">Loading air quality data...</p>
          <div className="w-64 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-neon-green transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 font-mono">{loadingProgress}% complete</p>
        </div>
      )}

      {/* API Error State */}
      {!loading && apiError && aqiData.length === 0 && (
        <div className="p-6">
          <div className="glass rounded-xl p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Air Quality Data Not Available</h3>
            <p className="text-gray-400 mb-4">
              The Air Quality API is currently unavailable. Please try again later.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('aqiData_cache');
                localStorage.removeItem('aqiData_cacheTime');
                fetchAllAQI();
              }}
              className="px-4 py-2 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* AQI Grid */}
      {!loading && aqiData.length > 0 && (
        <div className="p-6 pb-24">
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredData.length} of {aqiData.length} cities (sorted by worst AQI)
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedData.map((data) => (
              <div
                key={`${data.city}-${data.country}`}
                onClick={() => setSelectedCity(data)}
                className="glass rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all hover:scale-[1.02] border border-transparent"
                style={{ 
                  borderColor: `${getAQIColor(data.aqiLevel)}30`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-white">{data.city}</h3>
                    <p className="text-xs text-gray-500">{data.country}</p>
                  </div>
                  <div 
                    className="text-3xl font-bold font-mono"
                    style={{ color: getAQIColor(data.aqiLevel) }}
                  >
                    {data.aqi}
                  </div>
                </div>
                
                <div 
                  className="text-xs px-2 py-1 rounded-full inline-block"
                  style={{ 
                    backgroundColor: `${getAQIColor(data.aqiLevel)}20`,
                    color: getAQIColor(data.aqiLevel)
                  }}
                >
                  {getAQILabel(data.aqiLevel)}
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    <span>PM2.5: {data.pm25}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Factory className="w-3 h-3" />
                    <span>PM10: {data.pm10}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCity && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-darker rounded-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-neon-green" />
                <div>
                  <h3 className="font-bold text-white">{selectedCity.city}</h3>
                  <p className="text-xs text-gray-400">{selectedCity.country}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="p-2 hover:bg-white/10 rounded-lg text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Main AQI */}
              <div className="text-center mb-6">
                <div 
                  className="text-6xl font-bold font-mono mb-2"
                  style={{ color: getAQIColor(selectedCity.aqiLevel) }}
                >
                  {selectedCity.aqi}
                </div>
                <div 
                  className="inline-block px-4 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: `${getAQIColor(selectedCity.aqiLevel)}20`,
                    color: getAQIColor(selectedCity.aqiLevel)
                  }}
                >
                  {getAQILabel(selectedCity.aqiLevel)}
                </div>
              </div>

              {/* Pollutant Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Droplets className="w-4 h-4" />
                    <span className="text-xs uppercase">PM2.5</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.pm25} µg/m³</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Factory className="w-4 h-4" />
                    <span className="text-xs uppercase">PM10</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.pm10} µg/m³</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Leaf className="w-4 h-4" />
                    <span className="text-xs uppercase">Ozone</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.ozone} µg/m³</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Wind className="w-4 h-4" />
                    <span className="text-xs uppercase">NO₂</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.no2} µg/m³</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Factory className="w-4 h-4" />
                    <span className="text-xs uppercase">SO₂</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.so2} µg/m³</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Info className="w-4 h-4" />
                    <span className="text-xs uppercase">CO</span>
                  </div>
                  <div className="text-xl font-mono text-white">{selectedCity.co} µg/m³</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
