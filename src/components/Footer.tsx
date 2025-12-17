import React from 'react';
import { Database, Globe, Satellite, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-darker px-6 py-3 flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Satellite className="w-3 h-3" />
          Data Sources:
        </span>
        <a
          href="https://earthquake.usgs.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-neon-red hover:text-neon-red/80 transition-colors"
        >
          <Activity className="w-3 h-3" />
          USGS Earthquakes
        </a>
        <a
          href="https://eonet.gsfc.nasa.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-neon-cyan hover:text-neon-cyan/80 transition-colors"
        >
          <Database className="w-3 h-3" />
          NASA EONET
        </a>
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-neon-purple hover:text-neon-purple/80 transition-colors"
        >
          <Globe className="w-3 h-3" />
          Open-Meteo
        </a>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="font-mono">GeoAlert v2.0</span>
        <span className="text-gray-700">|</span>
        <span>Real-Time Disaster Monitoring</span>
      </div>
    </footer>
  );
};
