import React from 'react';
import { 
  X, 
  Moon, 
  Sun, 
  Bell, 
  Volume2, 
  VolumeX, 
  Thermometer,
  RefreshCw
} from 'lucide-react';

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  temperatureUnit: 'celsius' | 'fahrenheit';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  minSeverityNotification: 'minor' | 'moderate' | 'severe' | 'extreme' | 'catastrophic';
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

const severityOptions = [
  { value: 'minor', label: 'All Events' },
  { value: 'moderate', label: 'Moderate+' },
  { value: 'severe', label: 'Severe+' },
  { value: 'extreme', label: 'Extreme+' },
  { value: 'catastrophic', label: 'Catastrophic Only' },
];

const refreshOptions = [
  { value: 15, label: '15 seconds' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 300, label: '5 minutes' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-darker rounded-2xl z-50 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Theme */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">Theme</label>
            <div className="flex gap-2">
              {[
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'light', icon: Sun, label: 'Light' },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => onUpdateSettings({ theme: value as 'dark' | 'light' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    settings.theme === value
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Unit */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Temperature Unit
            </label>
            <div className="flex gap-2">
              {[
                { value: 'celsius', label: '°C' },
                { value: 'fahrenheit', label: '°F' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => onUpdateSettings({ temperatureUnit: value as 'celsius' | 'fahrenheit' })}
                  className={`flex-1 px-4 py-2 rounded-lg font-mono text-lg transition-colors ${
                    settings.temperatureUnit === value
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-white">Enable Notifications</span>
                <button
                  onClick={() => onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.notificationsEnabled ? 'bg-neon-cyan' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.notificationsEnabled ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-white flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Sound
                </span>
                <button
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.soundEnabled ? 'bg-neon-cyan' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-white mb-2 block">Minimum Severity</span>
                <select
                  value={settings.minSeverityNotification}
                  onChange={(e) => onUpdateSettings({ minSeverityNotification: e.target.value as any })}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50"
                >
                  {severityOptions.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-gray-900">
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Auto Refresh */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Auto Refresh
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-white">Enable Auto Refresh</span>
                <button
                  onClick={() => onUpdateSettings({ autoRefresh: !settings.autoRefresh })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings.autoRefresh ? 'bg-neon-cyan' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.autoRefresh ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>

              {settings.autoRefresh && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <span className="text-sm text-white mb-2 block">Refresh Interval</span>
                  <select
                    value={settings.refreshInterval}
                    onChange={(e) => onUpdateSettings({ refreshInterval: Number(e.target.value) })}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50"
                  >
                    {refreshOptions.map(({ value, label }) => (
                      <option key={value} value={value} className="bg-gray-900">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
};
