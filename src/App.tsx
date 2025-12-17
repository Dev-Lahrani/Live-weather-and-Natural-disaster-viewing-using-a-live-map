import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Header, 
  RealWorldMap, 
  Sidebar, 
  Footer, 
  LoadingScreen,
  NotificationToast,
  SearchBar,
  TimelineView,
  SettingsModal,
  ExportModal,
  StatsOverlay,
  Watchlist,
  WeatherCompare,
  DisasterTrends,
  Globe3D,
} from './components';
import type { UserSettings } from './components';
import { fetchDisasterEvents, fetchWeatherData } from './services/api';
import type { DisasterEvent, WeatherData, FilterState, DisasterCategory, SeverityLevel } from './types';
import { AlertTriangle, Settings, Download, BarChart3, Clock, List, GitCompare, TrendingUp, Globe } from 'lucide-react';

interface Notification {
  id: string;
  event: DisasterEvent;
  timestamp: Date;
  read: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  temperatureUnit: 'celsius',
  notificationsEnabled: true,
  soundEnabled: false,
  autoRefresh: true,
  refreshInterval: 30,
  minSeverityNotification: 'moderate',
};

const severityOrder: SeverityLevel[] = ['minor', 'moderate', 'severe', 'extreme', 'catastrophic'];

function App() {
  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | WeatherData | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    earthquakes: true,
    floods: true,
    wildfires: true,
    severeStorms: true,
    volcanoes: true,
    weather: true,
  });
  
  // New state for features
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [sidebarView, setSidebarView] = useState<'list' | 'timeline'>('list');
  const [mapFocusCoords, setMapFocusCoords] = useState<[number, number] | null>(null);
  const [showWeatherCompare, setShowWeatherCompare] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [showGlobe, setShowGlobe] = useState(false);
  
  const previousDisasterIds = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onq+wtLCpm4h2Z2RnaHF9i5efo6Ggm5GOiIWFh4uRl5yanpmWkIyKiImKjZGVmJqamZaTkI2LiouMj5KVl5mYl5WSkI2Li4uMjpGUlpiYl5WTkI6Mi4uMjpCTlZeXlpSTkI6Mi4uLjI6Qk5WXl5aVk5CQjo6Ojo6Oj5GTlJWWlpWUk5GQj46Ojo6PkJGTlJWVlJSTkpGQj4+Pj5CRkpOUlJSUk5KRkJCQkJCQkZKSk5SUlJSTkpKRkZGRkZGRkpKTk5OTk5KSkpGRkZGRkpKSk5OTk5OSk5KSkZGRkZGSkpKTk5OTk5KSkpKRkZGRkpKSk5OTk5OTkpKSkpGRkZKSkpKTk5OTk5KSkpKSkZGSkpKSk5OTk5OSkpKSkpKSkpKSkpOTk5OTkpKSkpKSkpKSkpKTk5OTk5KSkpKSkpKSkpKTk5OTk5OSkpKSkpKSkpKTk5OTk5OTkpKSkpKSkpKTk5OTk5OTk5KSkpKSkpOTk5OTk5OTkpKSkpKSk5OTk5OTk5OTkpKSkpKTk5OTk5OTk5OSkpKSkpOTk5OTk5OTk5KSkpKTk5OTk5OTk5OTkpKSkpOTk5OTk5OTk5OSkpKTk5OTk5OTk5OTk5KSk5OTk5OTk5OTk5OTkpOTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OQ==');
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [disasterData, weatherData] = await Promise.all([
        fetchDisasterEvents(),
        fetchWeatherData(),
      ]);
      
      // Check for new events for notifications
      if (settings.notificationsEnabled && previousDisasterIds.current.size > 0) {
        const newEvents = disasterData.filter(d => !previousDisasterIds.current.has(d.id));
        const minSeverityIndex = severityOrder.indexOf(settings.minSeverityNotification);
        
        const significantNewEvents = newEvents.filter(event => {
          const eventSeverityIndex = severityOrder.indexOf(event.severity || 'minor');
          return eventSeverityIndex >= minSeverityIndex;
        });

        if (significantNewEvents.length > 0) {
          const newNotifications: Notification[] = significantNewEvents.map(event => ({
            id: `notif-${event.id}-${Date.now()}`,
            event,
            timestamp: new Date(),
            read: false,
          }));
          
          setNotifications(prev => [...newNotifications, ...prev].slice(0, 50));
          
          // Play sound if enabled
          if (settings.soundEnabled && audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }
      }
      
      // Update previous IDs
      previousDisasterIds.current = new Set(disasterData.map(d => d.id));
      
      setDisasters(disasterData);
      setWeather(weatherData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [settings.notificationsEnabled, settings.minSeverityNotification, settings.soundEnabled]);

  useEffect(() => {
    fetchData();
    
    if (settings.autoRefresh) {
      const interval = setInterval(fetchData, settings.refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [fetchData, settings.autoRefresh, settings.refreshInterval]);

  const handleFilterChange = (category: DisasterCategory) => {
    setFilters(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSelectEvent = (event: DisasterEvent | WeatherData | null) => {
    setSelectedEvent(event);
    // Mark notification as read if selecting from notification
    if (event && 'id' in event) {
      setNotifications(prev => 
        prev.map(n => n.event.id === event.id ? { ...n, read: true } : n)
      );
    }
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDismissAllNotifications = () => {
    setNotifications([]);
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleFocusLocation = (coords: [number, number]) => {
    setMapFocusCoords(coords);
    // Reset after a short delay
    setTimeout(() => setMapFocusCoords(null), 100);
  };

  // Filter disasters based on active filters
  const filteredDisasters = disasters.filter(d => filters[d.category]);
  
  // Show initial loading screen
  if (loading && disasters.length === 0) {
    return <LoadingScreen message="Connecting to global monitoring systems..." />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-cyber-darker overflow-hidden">
      {/* Header */}
      <Header
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={fetchData}
        lastUpdated={lastUpdated}
        loading={loading}
        disasters={filteredDisasters}
        weatherCount={filters.weather ? weather.length : 0}
      />

      {/* Toolbar below header */}
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between gap-4 bg-cyber-darker">
        <div className="flex items-center gap-2">
          {/* Search */}
          <SearchBar
            disasters={filteredDisasters}
            weather={weather}
            onSelectEvent={handleSelectEvent}
            onFocusLocation={handleFocusLocation}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* View toggles */}
          <div className="flex items-center bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setSidebarView('list')}
              className={`p-2 rounded transition-colors ${sidebarView === 'list' ? 'bg-white/10 text-neon-cyan' : 'text-gray-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSidebarView('timeline')}
              className={`p-2 rounded transition-colors ${sidebarView === 'timeline' ? 'bg-white/10 text-neon-cyan' : 'text-gray-400 hover:text-white'}`}
              title="Timeline View"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>

          {/* 3D Globe */}
          <button
            onClick={() => setShowGlobe(true)}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-neon-cyan hover:bg-white/10 transition-colors"
            title="3D Globe View"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Trends */}
          <button
            onClick={() => setShowTrends(true)}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-neon-purple hover:bg-white/10 transition-colors"
            title="Disaster Trends"
          >
            <TrendingUp className="w-4 h-4" />
          </button>

          {/* Weather Compare */}
          <button
            onClick={() => setShowWeatherCompare(true)}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-neon-orange hover:bg-white/10 transition-colors"
            title="Compare Weather"
          >
            <GitCompare className="w-4 h-4" />
          </button>

          {/* Stats toggle */}
          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-lg transition-colors ${showStats ? 'bg-neon-purple/20 text-neon-purple' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
            title="Toggle Statistics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Export */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Export Data"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Section (70%) */}
        <div className="flex-[7] relative">
          {error && (
            <div className="absolute top-4 left-4 right-4 z-10 glass rounded-lg p-4 border border-neon-red/30 animate-fade-in">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-neon-red flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">Connection Error</p>
                  <p className="text-xs text-gray-400">{error}</p>
                </div>
                <button
                  onClick={fetchData}
                  className="ml-auto px-3 py-1 text-xs bg-neon-red/20 text-neon-red rounded hover:bg-neon-red/30 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          {/* Stats Overlay */}
          <StatsOverlay
            disasters={filteredDisasters}
            weather={weather}
            isVisible={showStats}
          />
          
          <RealWorldMap
            disasters={filteredDisasters}
            weather={weather}
            onSelectEvent={handleSelectEvent}
            selectedEvent={selectedEvent}
            showWeather={filters.weather}
          />
        </div>

        {/* Sidebar (30%) */}
        <div className="flex-[3] border-l border-white/10 flex flex-col">
          {/* Watchlist */}
          <div className="p-4 border-b border-white/10">
            <Watchlist
              weather={weather}
              disasters={filteredDisasters}
              onSelectLocation={handleFocusLocation}
            />
          </div>
          
          {/* Main Sidebar Content */}
          <div className="flex-1 overflow-hidden">
            {sidebarView === 'list' ? (
              <Sidebar
                disasters={filteredDisasters}
                weather={weather}
                selectedEvent={selectedEvent}
                onSelectEvent={handleSelectEvent}
                showWeather={filters.weather}
              />
            ) : (
              <TimelineView
                disasters={filteredDisasters}
                onSelectEvent={handleSelectEvent}
                selectedEvent={selectedEvent && 'id' in selectedEvent ? selectedEvent : null}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Notifications */}
      <NotificationToast
        notifications={notifications}
        onDismiss={handleDismissNotification}
        onDismissAll={handleDismissAllNotifications}
        onSelectEvent={handleSelectEvent}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
      />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        disasters={filteredDisasters}
        weather={weather}
        selectedEvent={selectedEvent}
      />

      <WeatherCompare
        weather={weather}
        isOpen={showWeatherCompare}
        onClose={() => setShowWeatherCompare(false)}
      />

      <DisasterTrends
        disasters={filteredDisasters}
        isOpen={showTrends}
        onClose={() => setShowTrends(false)}
      />

      <Globe3D
        disasters={filteredDisasters}
        isOpen={showGlobe}
        onClose={() => setShowGlobe(false)}
        onSelectDisaster={handleSelectEvent}
      />
    </div>
  );
}

export default App;
