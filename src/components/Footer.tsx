import React from 'react';
import { Database, Globe, Satellite, Activity, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-darker px-6 py-2.5 flex items-center justify-between text-[11px] border-t border-white/5">
      <div className="flex items-center gap-5 flex-wrap">
        <span className="flex items-center gap-1.5 text-gray-500 font-medium">
          <Satellite className="w-3 h-3" />
          Data Sources
        </span>
        <div className="h-3 w-px bg-white/10" />
        <a
          href="https://earthquake.usgs.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-all duration-300 group"
        >
          <div className="w-5 h-5 rounded bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
            <Activity className="w-2.5 h-2.5 text-red-400" />
          </div>
          <span>USGS</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        <a
          href="https://eonet.gsfc.nasa.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-400 hover:text-neon-cyan transition-all duration-300 group"
        >
          <div className="w-5 h-5 rounded bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors">
            <Database className="w-2.5 h-2.5 text-neon-cyan" />
          </div>
          <span>NASA EONET</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-400 hover:text-neon-purple transition-all duration-300 group"
        >
          <div className="w-5 h-5 rounded bg-neon-purple/10 flex items-center justify-center group-hover:bg-neon-purple/20 transition-colors">
            <Globe className="w-2.5 h-2.5 text-neon-purple" />
          </div>
          <span>Open-Meteo</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
      
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/Dev-Lahrani/Live-weather-and-Natural-disaster-viewing-using-a-live-map"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors group"
        >
          <Github className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-2 text-gray-500">
          <span className="font-mono font-medium text-gray-400">GeoAlert</span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-bold text-gray-400">v2.0</span>
        </div>
      </div>
    </footer>
  );
};
