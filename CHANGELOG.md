# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-17

### Added

#### Core Features
- **Interactive World Map** - SVG-based map with real-time disaster markers
- **Multi-source Disaster Data** - Earthquakes (USGS), Natural Events (NASA EONET)
- **Real-time Updates** - Auto-refresh every 30 seconds
- **Disaster Details** - Comprehensive information popups

#### Weather Monitoring
- **Global Weather Page** - 76+ major cities worldwide
- **Region Filtering** - Filter by continent/region
- **City Search** - Find any monitored city
- **Weather Caching** - 30-minute cache to handle rate limits

#### Air Quality
- **AQI Monitoring Page** - 50+ cities with real-time data
- **Health Levels** - Color-coded AQI levels
- **Pollutant Data** - PM2.5, PM10, Ozone, NO₂
- **Health Recommendations** - Based on AQI

#### Visualization
- **3D Globe** - Interactive Three.js globe with disaster markers
- **Disaster Trends** - Charts showing disaster patterns
- **Animated Icons** - CSS-animated weather condition icons
- **Stats Overlay** - Real-time statistics display

#### User Features
- **Watchlist** - Save favorite cities with localStorage
- **Weather Comparison** - Compare up to 4 cities
- **Data Export** - Export to JSON/CSV
- **Settings** - Customize app behavior
- **Notifications** - Toast alerts for new disasters
- **Timeline View** - Chronological disaster timeline
- **Search** - Find locations and disasters

#### Design
- **Cyberpunk Aesthetic** - Dark theme with neon accents
- **Glassmorphism** - Modern glass panel effects
- **Responsive** - Works on all screen sizes
- **Smooth Animations** - Transitions and hover effects

### Technical

- React 19 with TypeScript
- Vite (Rolldown) build system
- Tailwind CSS v4 styling
- Three.js for 3D visualization
- Recharts for data charts
- React Router for navigation

---

## Future Plans

### Planned Features
- [ ] User accounts and cloud sync
- [ ] Push notifications
- [ ] Historical data analysis
- [ ] More data sources (NOAA, etc.)
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle
- [ ] Localization (i18n)
- [ ] Offline support (PWA)
