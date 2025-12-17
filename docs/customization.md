# 🎨 Customization

This guide explains how to customize the appearance and behavior of the application.

## Theme Customization

### Color Palette

The application uses a custom color palette defined in `src/index.css`:

```css
@theme {
  --color-neon-cyan: #00f5ff;
  --color-neon-purple: #bf00ff;
  --color-neon-red: #ff0040;
  --color-neon-green: #00ff88;
  --color-neon-yellow: #ffff00;
  --color-dark-bg: #0a0a0f;
  --color-dark-panel: rgba(0, 0, 0, 0.7);
}
```

### Changing Colors

To change the color scheme, modify the CSS variables:

```css
/* For a blue/teal theme */
@theme {
  --color-neon-cyan: #00bcd4;
  --color-neon-purple: #3f51b5;
  --color-neon-red: #f44336;
  --color-neon-green: #4caf50;
}
```

### Using Colors in Components

```tsx
// Tailwind classes
<div className="text-neon-cyan bg-neon-purple/20">
  Styled content
</div>

// Inline styles
<div style={{ color: 'var(--color-neon-cyan)' }}>
  Styled content
</div>
```

---

## Glassmorphism Effects

### Default Glass Panel

```css
.glass-panel {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 245, 255, 0.1);
  border-radius: 12px;
}
```

### Customizing Glass Effect

```css
/* Lighter glass */
.glass-panel-light {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Colored glass */
.glass-panel-purple {
  background: rgba(191, 0, 255, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(191, 0, 255, 0.3);
}
```

---

## Animation Customization

### Glow Effects

```css
/* Neon glow */
.neon-glow {
  box-shadow: 
    0 0 5px var(--color-neon-cyan),
    0 0 10px var(--color-neon-cyan),
    0 0 20px var(--color-neon-cyan);
}

/* Pulse animation */
@keyframes neon-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-neon-pulse {
  animation: neon-pulse 2s ease-in-out infinite;
}
```

### Marker Animations

```css
/* Disaster marker pulse */
@keyframes marker-pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
}
```

---

## Layout Customization

### Map/Sidebar Ratio

Default is 70/30 split. To change:

```tsx
// In App.tsx
<div className="flex">
  {/* Change w-[70%] to your preferred width */}
  <div className="w-[60%]">
    <RealWorldMap />
  </div>
  {/* Change w-[30%] accordingly */}
  <div className="w-[40%]">
    <Sidebar />
  </div>
</div>
```

### Responsive Breakpoints

```tsx
// Stack on mobile, split on desktop
<div className="flex flex-col lg:flex-row">
  <div className="w-full lg:w-[70%]">
    <RealWorldMap />
  </div>
  <div className="w-full lg:w-[30%]">
    <Sidebar />
  </div>
</div>
```

---

## Data Refresh Customization

### Change Refresh Interval

```tsx
// In App.tsx
const REFRESH_INTERVAL = 60000; // 60 seconds (default: 30000)

useEffect(() => {
  const interval = setInterval(fetchDisasters, REFRESH_INTERVAL);
  return () => clearInterval(interval);
}, []);
```

### Change Cache Duration

```tsx
// In services/api.ts
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour (default: 30 min)
```

---

## Adding Custom Cities

### Weather Page Cities

Edit `src/pages/WeatherPage.tsx`:

```typescript
const WORLD_CITIES = [
  // Add your cities
  { name: 'Your City', lat: 12.34, lon: 56.78, country: 'Country', region: 'Region' },
  // ... existing cities
];
```

### Air Quality Page Cities

Edit `src/pages/AirQualityPage.tsx`:

```typescript
const WORLD_CITIES = [
  // Add your cities
  { name: 'Your City', lat: 12.34, lon: 56.78, country: 'Country', region: 'Region' },
  // ... existing cities
];
```

---

## Map Customization

### Country Colors

```tsx
// In RealWorldMap.tsx
const getCountryFill = (countryId: string) => {
  // Custom colors for specific countries
  const customColors: Record<string, string> = {
    'US': '#1a1a2e',
    'CN': '#16213e',
    // Add more...
  };
  return customColors[countryId] || '#0f0f1a';
};
```

### Marker Styles

```tsx
// In RealWorldMap.tsx
const getMarkerColor = (severity: string) => {
  const colors = {
    critical: '#ff0040',  // Red
    high: '#ff6b00',      // Orange
    medium: '#ffff00',    // Yellow
    low: '#00ff88'        // Green
  };
  return colors[severity] || '#ffffff';
};
```

---

## Notification Customization

### Notification Sounds

```tsx
// Add audio notification
const playNotificationSound = () => {
  const audio = new Audio('/notification.mp3');
  audio.volume = 0.5;
  audio.play();
};

// In notification handler
if (disaster.severity === 'critical') {
  playNotificationSound();
}
```

### Custom Notification Duration

```tsx
// In NotificationToast.tsx
const AUTO_DISMISS_MS = 10000; // 10 seconds (default: 5000)
```

---

## Adding New Disaster Types

### 1. Update Types

```typescript
// In types/index.ts
type DisasterType = 
  | 'earthquake' 
  | 'wildfire' 
  | 'volcano'
  | 'storm'
  | 'flood'
  | 'tsunami'  // New type
  | 'other';
```

### 2. Add Icon

```tsx
// In Sidebar.tsx or utils/helpers.ts
const getDisasterIcon = (type: DisasterType) => {
  const icons = {
    earthquake: '🌍',
    wildfire: '🔥',
    volcano: '🌋',
    storm: '🌪️',
    flood: '🌊',
    tsunami: '🌊',  // New icon
    other: '⚠️'
  };
  return icons[type];
};
```

### 3. Add Color

```tsx
const getDisasterColor = (type: DisasterType) => {
  const colors = {
    earthquake: '#ff6b6b',
    wildfire: '#ff9500',
    volcano: '#ff4757',
    storm: '#5f27cd',
    flood: '#0abde3',
    tsunami: '#00cec9',  // New color
    other: '#ffc048'
  };
  return colors[type];
};
```

---

## Dark/Light Theme Toggle (Future)

```tsx
// Theme context
const ThemeContext = createContext<{
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => {}
});

// Theme provider
const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
```
