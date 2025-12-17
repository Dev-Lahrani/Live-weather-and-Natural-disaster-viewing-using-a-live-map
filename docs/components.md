# 🧩 Components

This document provides detailed information about each React component in the application.

## Component Overview

| Component | Purpose | Location |
|-----------|---------|----------|
| `AnimatedWeatherIcon` | Animated SVG weather icons | `/components/` |
| `DisasterTrends` | Charts and analytics | `/components/` |
| `ExportModal` | Data export functionality | `/components/` |
| `Footer` | App footer | `/components/` |
| `Globe3D` | Three.js globe visualization | `/components/` |
| `Header` | Navigation header | `/components/` |
| `LoadingScreen` | Initial loading animation | `/components/` |
| `NotificationToast` | Alert notifications | `/components/` |
| `RealWorldMap` | Interactive SVG world map | `/components/` |
| `SearchBar` | Location search | `/components/` |
| `SettingsModal` | App settings | `/components/` |
| `Sidebar` | Disaster list sidebar | `/components/` |
| `StatsOverlay` | Statistics display | `/components/` |
| `TimelineView` | Disaster timeline | `/components/` |
| `Watchlist` | Favorites management | `/components/` |
| `WeatherCompare` | City comparison tool | `/components/` |

---

## AnimatedWeatherIcon

Displays animated SVG icons based on weather conditions.

### Props

```typescript
interface AnimatedWeatherIconProps {
  weatherCode: number;
  size?: number;
}
```

### Usage

```tsx
<AnimatedWeatherIcon weatherCode={3} size={48} />
```

### Weather Code Mapping

| Codes | Icon | Animation |
|-------|------|-----------|
| 0 | Sun | Spinning rays |
| 1-3 | Partial clouds | Floating clouds |
| 45, 48 | Fog | Drifting layers |
| 51-55, 61-65 | Rain | Falling drops |
| 71-75 | Snow | Drifting flakes |
| 80-82 | Rain showers | Heavy drops |
| 95-99 | Thunderstorm | Lightning flash |

---

## DisasterTrends

Interactive charts showing disaster trends and analytics.

### Props

```typescript
interface DisasterTrendsProps {
  disasters: Disaster[];
  onClose: () => void;
}
```

### Features

- **Daily Frequency Chart** - Area chart showing disasters per day
- **Category Breakdown** - Pie chart of disaster types
- **Magnitude Distribution** - Bar chart for earthquakes

### Usage

```tsx
<DisasterTrends 
  disasters={disasters} 
  onClose={() => setShowTrends(false)} 
/>
```

---

## Globe3D

Interactive 3D globe using Three.js with disaster markers.

### Props

```typescript
interface Globe3DProps {
  disasters: Disaster[];
  onClose: () => void;
}
```

### Features

- **Orbit Controls** - Rotate and zoom the globe
- **Disaster Markers** - Color-coded by severity
- **Fullscreen Mode** - Toggle fullscreen view
- **Auto-rotation** - Optional slow rotation

### Dependencies

- `three`
- `@react-three/fiber`
- `@react-three/drei`

### Usage

```tsx
{show3DGlobe && (
  <Globe3D 
    disasters={disasters} 
    onClose={() => setShow3DGlobe(false)} 
  />
)}
```

---

## Header

Navigation header with app title and nav links.

### Features

- App logo and title
- Navigation links (Dashboard, Weather, Air Quality)
- Responsive mobile menu

### Usage

```tsx
<Header />
```

---

## RealWorldMap

Interactive SVG world map with disaster markers.

### Props

```typescript
interface RealWorldMapProps {
  disasters: Disaster[];
  selectedDisaster: Disaster | null;
  onDisasterSelect: (disaster: Disaster | null) => void;
  onDisasterHover: (disaster: Disaster | null) => void;
}
```

### Features

- **SVG Countries** - All world countries with hover effects
- **Disaster Markers** - Positioned by coordinates
- **Click/Hover** - Interactive marker selection
- **Popup Details** - Info panel for selected disaster
- **Pulse Animation** - Active markers pulse

### Usage

```tsx
<RealWorldMap
  disasters={filteredDisasters}
  selectedDisaster={selectedDisaster}
  onDisasterSelect={setSelectedDisaster}
  onDisasterHover={setHoveredDisaster}
/>
```

---

## Sidebar

Disaster list and filter controls sidebar.

### Props

```typescript
interface SidebarProps {
  disasters: Disaster[];
  selectedDisaster: Disaster | null;
  onDisasterSelect: (disaster: Disaster | null) => void;
  activeFilters: DisasterType[];
  onFilterChange: (filters: DisasterType[]) => void;
  onOpenWatchlist: () => void;
  onOpenCompare: () => void;
  onOpenTrends: () => void;
  onToggle3DGlobe: () => void;
}
```

### Features

- **Disaster List** - Scrollable list of all disasters
- **Filter Buttons** - Toggle disaster types
- **Quick Actions** - Access to features
- **Search** - Find specific disasters

### Usage

```tsx
<Sidebar
  disasters={disasters}
  selectedDisaster={selectedDisaster}
  onDisasterSelect={setSelectedDisaster}
  activeFilters={activeFilters}
  onFilterChange={setActiveFilters}
  onOpenWatchlist={() => setShowWatchlist(true)}
  onOpenCompare={() => setShowCompare(true)}
  onOpenTrends={() => setShowTrends(true)}
  onToggle3DGlobe={() => setShow3DGlobe(!show3DGlobe)}
/>
```

---

## Watchlist

Favorites management panel for cities and regions.

### Props

```typescript
interface WatchlistProps {
  onClose: () => void;
}
```

### Features

- **Add Cities** - Search and add favorite cities
- **Weather Display** - Current weather for saved cities
- **Region Watchlist** - Monitor entire regions
- **localStorage** - Persistent storage

### Usage

```tsx
<Watchlist onClose={() => setShowWatchlist(false)} />
```

---

## WeatherCompare

Side-by-side weather comparison tool.

### Props

```typescript
interface WeatherCompareProps {
  onClose: () => void;
}
```

### Features

- **Multi-city** - Compare up to 4 cities
- **Key Metrics** - Temperature, humidity, wind
- **Visual Comparison** - Side-by-side cards
- **Add/Remove** - Manage comparison cities

### Usage

```tsx
<WeatherCompare onClose={() => setShowCompare(false)} />
```

---

## StatsOverlay

Real-time statistics display overlay.

### Props

```typescript
interface StatsOverlayProps {
  disasters: Disaster[];
  lastUpdate: Date;
}
```

### Features

- **Total Count** - Number of active disasters
- **By Type** - Breakdown by category
- **Last Update** - Timestamp of data refresh

### Usage

```tsx
<StatsOverlay disasters={disasters} lastUpdate={lastUpdate} />
```

---

## NotificationToast

Toast notification for new disasters.

### Props

```typescript
interface NotificationToastProps {
  notification: Notification | null;
  onDismiss: () => void;
}
```

### Features

- **Severity Colors** - Color-coded by severity
- **Auto-dismiss** - Optional timeout
- **Click Action** - Navigate to disaster

### Usage

```tsx
<NotificationToast 
  notification={notification} 
  onDismiss={() => setNotification(null)} 
/>
```

---

## Creating New Components

### Template

```tsx
import React from 'react';

interface MyComponentProps {
  // Define props
}

const MyComponent: React.FC<MyComponentProps> = ({ /* props */ }) => {
  // Component logic
  
  return (
    <div className="glass-panel p-4">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### Export from Index

Add to `src/components/index.ts`:

```typescript
export { default as MyComponent } from './MyComponent';
```

### Styling Guidelines

- Use Tailwind CSS classes
- Follow cyberpunk aesthetic
- Use `glass-panel` class for glassmorphism
- Use neon colors: `neon-cyan`, `neon-purple`, `neon-red`
