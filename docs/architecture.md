# 🏗️ Architecture

This document explains the architecture and design patterns used in the Live Weather & Natural Disaster Tracking application.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  Pages  │  │Components│  │Services │  │     Utils       │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │
│       │            │            │                 │          │
│       └────────────┴─────┬──────┴─────────────────┘          │
│                          │                                    │
│                    ┌─────▼─────┐                             │
│                    │   Types   │                             │
│                    └───────────┘                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     External APIs                            │
├──────────────┬──────────────┬───────────────────────────────┤
│  USGS        │  NASA EONET  │  Open-Meteo                   │
│  Earthquakes │  Events      │  Weather + AQI                │
└──────────────┴──────────────┴───────────────────────────────┘
```

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnimatedWeatherIcon.tsx
│   ├── DisasterTrends.tsx
│   ├── ExportModal.tsx
│   ├── Footer.tsx
│   ├── Globe3D.tsx
│   ├── Header.tsx
│   ├── LoadingScreen.tsx
│   ├── NotificationToast.tsx
│   ├── RealWorldMap.tsx
│   ├── SearchBar.tsx
│   ├── SettingsModal.tsx
│   ├── Sidebar.tsx
│   ├── StatsOverlay.tsx
│   ├── TimelineView.tsx
│   ├── Watchlist.tsx
│   ├── WeatherCompare.tsx
│   └── index.ts
├── pages/               # Route-level components
│   ├── AirQualityPage.tsx
│   ├── WeatherPage.tsx
│   └── index.ts
├── services/            # API integration
│   └── api.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Helper functions
│   └── helpers.ts
├── App.tsx              # Main application component
├── App.css              # Application styles
├── main.tsx             # Entry point
└── index.css            # Global styles (Tailwind)
```

## Data Flow

### 1. Disaster Data Flow

```
USGS API ──┐
           ├──► api.ts ──► App.tsx ──► State ──► Components
NASA API ──┘                              │
                                          ├──► Sidebar (list)
                                          ├──► Map (markers)
                                          ├──► Stats (counts)
                                          └──► Trends (charts)
```

### 2. Weather Data Flow

```
Open-Meteo API ──► api.ts ──► WeatherPage.tsx ──► City Cards
                     │
                     └──► Cache (localStorage, 30 min)
```

### 3. User Interaction Flow

```
User Action ──► Event Handler ──► State Update ──► Re-render
     │
     └──► localStorage (persistence)
```

## Key Design Patterns

### 1. Component Composition

Components are designed to be composable and reusable:

```tsx
// Parent component composes children
<App>
  <Header />
  <main>
    <RealWorldMap disasters={disasters} />
    <Sidebar disasters={disasters} />
  </main>
  <Footer />
</App>
```

### 2. State Management

State is managed using React hooks at the appropriate level:

```tsx
// App-level state for shared data
const [disasters, setDisasters] = useState<Disaster[]>([]);
const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);

// Local state for component-specific data
const [isLoading, setIsLoading] = useState(true);
```

### 3. API Service Layer

All API calls are centralized in the services layer:

```tsx
// services/api.ts
export const fetchUSGSEarthquakes = async (): Promise<Disaster[]> => {
  const response = await fetch(USGS_API_URL);
  const data = await response.json();
  return transformToDisasters(data);
};
```

### 4. Type Safety

TypeScript interfaces define all data structures:

```tsx
// types/index.ts
interface Disaster {
  id: string;
  title: string;
  type: DisasterType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  coordinates: [number, number];
  timestamp: Date;
  details: DisasterDetails;
}
```

## Component Architecture

### Presentational vs Container Components

**Container Components** (Pages):
- Manage state and data fetching
- Pass data to presentational components
- Handle business logic

**Presentational Components** (Components):
- Receive data via props
- Handle UI rendering
- Emit events via callbacks

### Component Communication

```
App (State Owner)
├── Header (receives: nothing, emits: navigation)
├── RealWorldMap (receives: disasters, emits: selection)
├── Sidebar (receives: disasters, emits: selection, filters)
└── Modals (receives: data, emits: actions)
```

## Performance Optimizations

### 1. Memoization

```tsx
const filteredDisasters = useMemo(() => 
  disasters.filter(d => activeFilters.includes(d.type)),
  [disasters, activeFilters]
);
```

### 2. Lazy Loading

```tsx
const Globe3D = React.lazy(() => import('./Globe3D'));
```

### 3. Caching

```tsx
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const getCachedData = (key: string) => {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  return null;
};
```

## Styling Architecture

### Tailwind CSS v4

All styling uses Tailwind CSS with custom theme extensions:

```css
/* index.css */
@theme {
  --color-neon-cyan: #00f5ff;
  --color-neon-purple: #bf00ff;
  --color-neon-red: #ff0040;
  --color-neon-green: #00ff88;
}
```

### CSS Modules (App.css)

Complex animations and glassmorphism effects:

```css
.glass-panel {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 245, 255, 0.1);
}
```

## Error Handling

### API Error Handling

```tsx
try {
  const data = await fetchDisasters();
  setDisasters(data);
} catch (error) {
  console.error('Failed to fetch disasters:', error);
  setError('Unable to load disaster data. Please try again.');
}
```

### Error Boundaries (Future Enhancement)

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

## Testing Strategy (Future)

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Playwright
- **API Mocking**: MSW (Mock Service Worker)
