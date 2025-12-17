import React from 'react';
import { Download, Share2, X, FileJson, FileSpreadsheet, Link2, Copy, Check } from 'lucide-react';
import type { DisasterEvent, WeatherData } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  disasters: DisasterEvent[];
  weather: WeatherData[];
  selectedEvent: DisasterEvent | WeatherData | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  disasters,
  weather,
  selectedEvent,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const exportToJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (data: DisasterEvent[], filename: string) => {
    const headers = ['ID', 'Title', 'Category', 'Severity', 'Magnitude', 'Depth', 'Latitude', 'Longitude', 'Date', 'Estimated Affected', 'Description'];
    const rows = data.map(d => [
      d.id,
      `"${d.title.replace(/"/g, '""')}"`,
      d.category,
      d.severity || '',
      d.magnitude || '',
      d.depth || '',
      d.coordinates[1],
      d.coordinates[0],
      d.date,
      d.estimatedAffected || '',
      `"${d.description.replace(/"/g, '""')}"`,
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateShareLink = () => {
    if (!selectedEvent) return '';
    if ('id' in selectedEvent) {
      // It's a disaster event
      return `${window.location.origin}?event=${selectedEvent.id}`;
    } else {
      // It's weather data
      return `${window.location.origin}?city=${encodeURIComponent(selectedEvent.city)}`;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLink = generateShareLink();

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
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-neon-cyan" />
            Export & Share
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Export Options */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-3 block">Export All Data</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => exportToJSON({ disasters, weather, exportedAt: new Date().toISOString() }, 'geoalert-data.json')}
                className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <FileJson className="w-5 h-5 text-neon-cyan" />
                <span className="text-sm">Export JSON</span>
              </button>
              <button
                onClick={() => exportToCSV(disasters, 'geoalert-disasters.csv')}
                className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <FileSpreadsheet className="w-5 h-5 text-green-400" />
                <span className="text-sm">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Export Stats */}
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Disaster Events</span>
                <div className="text-white font-mono text-lg">{disasters.length}</div>
              </div>
              <div>
                <span className="text-gray-500">Weather Stations</span>
                <div className="text-white font-mono text-lg">{weather.length}</div>
              </div>
            </div>
          </div>

          {/* Share Selected Event */}
          {selectedEvent && (
            <div>
              <label className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Selected Event
              </label>
              <div className="p-3 bg-white/5 rounded-lg mb-3">
                <p className="text-sm text-white truncate">
                  {'id' in selectedEvent ? selectedEvent.title : `${selectedEvent.city}, ${selectedEvent.country}`}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                  <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-300 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(shareLink)}
                  className="px-3 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const severeEvents = disasters.filter(d => 
                  d.severity === 'severe' || d.severity === 'extreme' || d.severity === 'catastrophic'
                );
                exportToJSON(severeEvents, 'geoalert-severe-events.json');
              }}
              className="p-3 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg transition-colors text-orange-400 text-sm"
            >
              Export Severe+ Only
            </button>
            <button
              onClick={() => {
                const earthquakes = disasters.filter(d => d.category === 'earthquakes');
                exportToCSV(earthquakes, 'geoalert-earthquakes.csv');
              }}
              className="p-3 bg-neon-purple/10 hover:bg-neon-purple/20 rounded-lg transition-colors text-neon-purple text-sm"
            >
              Export Earthquakes
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};
