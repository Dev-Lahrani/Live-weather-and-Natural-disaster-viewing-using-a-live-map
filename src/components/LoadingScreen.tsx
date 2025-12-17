import React from 'react';
import { Activity, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading disaster data...' 
}) => {
  return (
    <div className="fixed inset-0 bg-cyber-darker flex items-center justify-center z-50">
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Loading content */}
      <div className="relative flex flex-col items-center">
        {/* Logo with glow */}
        <div className="relative mb-8">
          <Activity className="w-16 h-16 text-neon-cyan" />
          <div className="absolute inset-0 w-16 h-16 bg-neon-cyan/30 blur-2xl rounded-full animate-pulse" />
        </div>

        {/* Spinner */}
        <div className="relative mb-6">
          <Loader2 className="w-8 h-8 text-neon-purple spinner" />
        </div>

        {/* Loading text */}
        <h2 className="text-xl font-bold text-white text-glow-cyan mb-2">
          GeoAlert
        </h2>
        <p className="text-sm text-gray-400 font-mono animate-pulse">
          {message}
        </p>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
