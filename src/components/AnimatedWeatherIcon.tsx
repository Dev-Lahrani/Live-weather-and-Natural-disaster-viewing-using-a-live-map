import React from 'react';

interface AnimatedWeatherIconProps {
  weatherCode: number;
  isDay: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 96, height: 96 },
};

export const AnimatedWeatherIcon: React.FC<AnimatedWeatherIconProps> = ({
  weatherCode,
  isDay,
  size = 'md',
}) => {
  const { width, height } = sizeMap[size];

  // Clear sky
  if (weatherCode === 0) {
    return isDay ? (
      <svg width={width} height={height} viewBox="0 0 64 64">
        <defs>
          <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD93D" />
            <stop offset="100%" stopColor="#FF9500" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="12" fill="url(#sunGradient)">
          <animate attributeName="r" values="12;13;12" dur="2s" repeatCount="indefinite" />
        </circle>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="32"
            y1="32"
            x2={32 + 20 * Math.cos((angle * Math.PI) / 180)}
            y2={32 + 20 * Math.sin((angle * Math.PI) / 180)}
            stroke="#FFD93D"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              begin={`${i * 0.25}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>
    ) : (
      <svg width={width} height={height} viewBox="0 0 64 64">
        <defs>
          <radialGradient id="moonGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#E8E8E8" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="14" fill="url(#moonGradient)">
          <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="28" cy="28" r="3" fill="#D0D0D0" opacity="0.5" />
        <circle cx="36" cy="35" r="2" fill="#D0D0D0" opacity="0.3" />
        <circle cx="30" cy="38" r="1.5" fill="#D0D0D0" opacity="0.4" />
        {[
          { cx: 12, cy: 15, r: 1 },
          { cx: 50, cy: 12, r: 0.8 },
          { cx: 55, cy: 28, r: 0.6 },
          { cx: 10, cy: 45, r: 0.7 },
        ].map((star, i) => (
          <circle key={i} {...star} fill="white">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    );
  }

  // Partly cloudy
  if (weatherCode === 1 || weatherCode === 2) {
    return (
      <svg width={width} height={height} viewBox="0 0 64 64">
        {isDay && (
          <>
            <circle cx="20" cy="20" r="10" fill="#FFD93D">
              <animate attributeName="r" values="10;11;10" dur="2s" repeatCount="indefinite" />
            </circle>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <line
                key={i}
                x1="20"
                y1="20"
                x2={20 + 15 * Math.cos((angle * Math.PI) / 180)}
                y2={20 + 15 * Math.sin((angle * Math.PI) / 180)}
                stroke="#FFD93D"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
            ))}
          </>
        )}
        <ellipse cx="38" cy="38" rx="18" ry="12" fill="#E8E8E8">
          <animate attributeName="cx" values="38;40;38" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="28" cy="42" rx="12" ry="8" fill="#F5F5F5" />
        <ellipse cx="48" cy="40" rx="10" ry="7" fill="#EFEFEF" />
      </svg>
    );
  }

  // Overcast
  if (weatherCode === 3) {
    return (
      <svg width={width} height={height} viewBox="0 0 64 64">
        <ellipse cx="32" cy="36" rx="22" ry="14" fill="#B0B0B0">
          <animate attributeName="rx" values="22;23;22" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="22" cy="40" rx="14" ry="9" fill="#C8C8C8" />
        <ellipse cx="44" cy="38" rx="12" ry="8" fill="#D0D0D0" />
        <ellipse cx="32" cy="32" rx="16" ry="10" fill="#A0A0A0" />
      </svg>
    );
  }

  // Fog
  if (weatherCode >= 45 && weatherCode <= 48) {
    return (
      <svg width={width} height={height} viewBox="0 0 64 64">
        {[20, 28, 36, 44].map((y, i) => (
          <line
            key={i}
            x1="8"
            y1={y}
            x2="56"
            y2={y}
            stroke="#B0B0B0"
            strokeWidth="4"
            strokeLinecap="round"
            opacity={0.4 + i * 0.15}
          >
            <animate
              attributeName="x1"
              values="8;12;8"
              dur={`${2 + i * 0.5}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="56;52;56"
              dur={`${2 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>
    );
  }

  // Drizzle
  if (weatherCode >= 51 && weatherCode <= 57) {
    return (
      <svg width={width} height={height} viewBox="0 0 64 64">
        <ellipse cx="32" cy="24" rx="20" ry="12" fill="#9CA3AF" />
        <ellipse cx="22" cy="28" rx="12" ry="8" fill="#A3A3A3" />
        <ellipse cx="44" cy="26" rx="10" ry="7" fill="#ABABAB" />
        {[18, 32, 46].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1="38"
            x2={x}
            y2="48"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          >
            <animate
              attributeName="y1"
              values="38;40;38"
              dur="0.5s"
              begin={`${i * 0.15}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              values="48;52;48"
              dur="0.5s"
              begin={`${i * 0.15}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.7;0.3;0.7"
              dur="0.5s"
              begin={`${i * 0.15}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>
    );
  }

  // Rain
  if ((weatherCode >= 61 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return (
      <svg width={width} height={height} viewBox="0 0 64 64">
        <ellipse cx="32" cy="20" rx="22" ry="12" fill="#6B7280" />
        <ellipse cx="20" cy="24" rx="14" ry="9" fill="#7B7B7B" />
        <ellipse cx="46" cy="22" rx="12" ry="8" fill="#858585" />
        {[14, 24, 34, 44, 54].map((x, i) => (
          <React.Fragment key={i}>
            <line
              x1={x}
              y1="34"
              x2={x - 4}
              y2="50"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <animate
                attributeName="y1"
                values="34;36;34"
                dur="0.4s"
                begin={`${i * 0.1}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="y2"
                values="50;56;50"
                dur="0.4s"
                begin={`${i * 0.1}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.4;1"
                dur="0.4s"
                begin={`${i * 0.1}s`}
                repeatCount="indefinite"
              />
            </line>
          </React.Fragment>
        ))}
      </svg>
    );
  }

  // Snow
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
    return (
      <svg width={width} height={height} viewBox="0 0 64 64">
        <ellipse cx="32" cy="20" rx="22" ry="12" fill="#94A3B8" />
        <ellipse cx="20" cy="24" rx="14" ry="9" fill="#A0AEC0" />
        <ellipse cx="46" cy="22" rx="12" ry="8" fill="#B0BEC5" />
        {[
          { x: 16, delay: 0 },
          { x: 28, delay: 0.3 },
          { x: 40, delay: 0.6 },
          { x: 52, delay: 0.2 },
        ].map((flake, i) => (
          <text
            key={i}
            x={flake.x}
            y="42"
            fill="#E0E7FF"
            fontSize="12"
            textAnchor="middle"
          >
            <animate
              attributeName="y"
              values="36;50;36"
              dur="1.5s"
              begin={`${flake.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin={`${flake.delay}s`}
              repeatCount="indefinite"
            />
            ❄
          </text>
        ))}
      </svg>
    );
  }

  // Thunderstorm
  if (weatherCode >= 95) {
    return (
      <svg width={width} height={height} viewBox="0 0 64 64">
        <ellipse cx="32" cy="18" rx="24" ry="14" fill="#4B5563" />
        <ellipse cx="18" cy="22" rx="14" ry="10" fill="#5B5B5B" />
        <ellipse cx="48" cy="20" rx="12" ry="9" fill="#555555" />
        <polygon
          points="30,30 38,30 34,42 42,42 28,58 32,44 24,44"
          fill="#FACC15"
        >
          <animate
            attributeName="opacity"
            values="1;0.3;1;0.3;1"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </polygon>
        {[20, 46].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1="34"
            x2={x - 3}
            y2="48"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <animate
              attributeName="opacity"
              values="0.8;0.3;0.8"
              dur="0.4s"
              begin={`${i * 0.2}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </svg>
    );
  }

  // Default cloud
  return (
    <svg width={width} height={height} viewBox="0 0 64 64">
      <ellipse cx="32" cy="32" rx="20" ry="12" fill="#D1D5DB">
        <animate attributeName="rx" values="20;21;20" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="22" cy="36" rx="12" ry="8" fill="#E5E7EB" />
      <ellipse cx="44" cy="34" rx="10" ry="7" fill="#E0E0E0" />
    </svg>
  );
};
