# 🌍 Live Weather & Natural Disaster Tracking

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)

**A real-time natural disaster monitoring and weather tracking web application with a cyberpunk aesthetic.**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API Sources](#-api-sources) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🗺️ Interactive World Map
- **Real-time disaster tracking** with live data from multiple sources
- **Clickable disaster markers** with detailed information popups
- **SVG-based vector map** with country highlighting
- **Auto-refresh** every 30 seconds for live updates

### 🌊 Multi-Source Disaster Data
- **Earthquakes** - USGS real-time feeds (all magnitudes, past hour/day)
- **Wildfires** - NASA EONET satellite data
- **Severe Storms** - NASA EONET weather events
- **Volcanoes** - NASA EONET volcanic activity
- **Floods, Droughts, Landslides** - NASA EONET environmental events

### 🌤️ Global Weather Monitoring
- **76+ major cities** with current weather conditions
- **Region-based filtering** (North America, Europe, Asia, etc.)
- **Temperature, humidity, wind speed** and more
- **Animated weather icons** for visual conditions
- **Caching system** to handle API rate limits

### 💨 Air Quality Index (AQI)
- **50+ global cities** with real-time AQI data
- **Color-coded health levels** (Good → Hazardous)
- **PM2.5, PM10, Ozone, NO₂** pollutant tracking
- **Health recommendations** based on AQI levels

### 🌐 3D Globe Visualization
- **Interactive Three.js globe** with disaster markers
- **Orbit controls** for rotation and zoom
- **Fullscreen mode** for immersive viewing
- **Real-time marker updates** from disaster data

### 📊 Disaster Trends & Analytics
- **Daily frequency charts** showing disaster patterns
- **Category breakdown** pie charts
- **Magnitude distribution** bar charts
- **Historical trend analysis**

### ⭐ Watchlist & Favorites
- **Save favorite cities** for quick access
- **Region-based watchlists** for monitoring areas
- **localStorage persistence** - data saved locally
- **Quick weather lookup** for saved locations

### ⚖️ Weather Comparison
- **Side-by-side comparison** of up to 4 cities
- **Key metrics comparison** (temperature, humidity, wind)
- **Visual difference indicators**

### 🔔 Real-time Notifications
- **Toast notifications** for new disasters
- **Severity-based alerts** (Critical, High, Medium, Low)
- **Audio alerts** for critical events (optional)

### 📤 Data Export
- **Export to JSON or CSV** formats
- **Filtered exports** by disaster type
- **Full dataset downloads**

---

## 🎨 Design

The application features a **cyberpunk/tech aesthetic** with:
- 🌑 Dark theme with glassmorphism effects
- 💜 Neon accents (cyan, purple, red)
- ✨ Smooth animations and transitions
- 📱 Responsive design for all screen sizes

---

## 📸 Screenshots

### Main Dashboard
![Main Dashboard](docs/screenshots/dashboard.png)
- 70% interactive map with disaster markers
- 30% sidebar with disaster list and controls
- Real-time stats overlay

### Weather Page
![Weather Page](docs/screenshots/weather.png)
- Grid layout of global city weather cards
- Region filtering and search
- Animated weather condition icons

### Air Quality Page
![Air Quality Page](docs/screenshots/air-quality.png)
- AQI monitoring for major cities
- Health-based color coding
- Pollutant breakdown

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/Dev-Lahrani/Live-weather-and-Natural-disaster-viewing-using-a-live-map.git
cd Live-weather-and-Natural-disaster-viewing-using-a-live-map
```

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📖 Usage

### Navigation
- **Home** (`/`) - Main disaster tracking dashboard
- **Weather** (`/weather`) - Global weather monitoring
- **Air Quality** (`/air-quality`) - AQI monitoring page

### Sidebar Controls
| Button | Function |
|--------|----------|
| ⭐ | Open Watchlist/Favorites panel |
| ⚖️ | Open Weather Comparison tool |
| 📈 | Open Disaster Trends dashboard |
| 🌍 | Toggle 3D Globe view |
| ⚙️ | Open Settings modal |
| 📤 | Export disaster data |
| 📅 | View disaster timeline |

### Filtering Disasters
1. Use the sidebar filter buttons to show/hide disaster types
2. Click on map markers for detailed information
3. Use search to find specific locations

### Watchlist
1. Click the ⭐ button to open watchlist
2. Add cities by typing in the search box
3. View weather for saved locations instantly

---

## 🔌 API Sources

This application uses **free, no-API-key-required** data sources:

| Source | Data Type | Update Frequency |
|--------|-----------|------------------|
| [USGS Earthquake API](https://earthquake.usgs.gov/earthquakes/feed/) | Earthquakes | Real-time |
| [NASA EONET](https://eonet.gsfc.nasa.gov/) | Natural Events | Daily |
| [Open-Meteo](https://open-meteo.com/) | Weather & AQI | Hourly |

### Rate Limits
- **Open-Meteo**: 10,000 requests/day (free tier)
- **USGS**: No limit
- **NASA EONET**: No limit

The app includes **intelligent caching** (30-minute cache) to stay within rate limits.

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── AnimatedWeatherIcon.tsx   # CSS-animated weather icons
│   ├── DisasterTrends.tsx        # Charts and analytics
│   ├── ExportModal.tsx           # Data export functionality
│   ├── Footer.tsx                # App footer
│   ├── Globe3D.tsx               # Three.js globe visualization
│   ├── Header.tsx                # Navigation header
│   ├── LoadingScreen.tsx         # Initial loading animation
│   ├── NotificationToast.tsx     # Alert notifications
│   ├── RealWorldMap.tsx          # Interactive SVG world map
│   ├── SearchBar.tsx             # Location search
│   ├── SettingsModal.tsx         # App settings
│   ├── Sidebar.tsx               # Disaster list sidebar
│   ├── StatsOverlay.tsx          # Statistics display
│   ├── TimelineView.tsx          # Disaster timeline
│   ├── Watchlist.tsx             # Favorites management
│   ├── WeatherCompare.tsx        # City comparison tool
│   └── index.ts                  # Component exports
├── pages/
│   ├── AirQualityPage.tsx        # AQI monitoring page
│   ├── WeatherPage.tsx           # Global weather page
│   └── index.ts                  # Page exports
├── services/
│   └── api.ts                    # API integration
├── types/
│   └── index.ts                  # TypeScript types
├── utils/
│   └── helpers.ts                # Utility functions
├── App.tsx                       # Main app component
├── App.css                       # App styles
├── main.tsx                      # React entry point
└── index.css                     # Global styles (Tailwind)
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite (Rolldown)** | Build Tool |
| **Tailwind CSS v4** | Styling |
| **Three.js** | 3D Globe |
| **@react-three/fiber** | React Three.js bindings |
| **Recharts** | Data visualization |
| **Lucide React** | Icons |
| **React Router** | Navigation |

---

## ⚙️ Configuration

### Environment Variables (Optional)
No API keys required! All APIs used are free and open.

### Tailwind Theme
Custom colors defined in `src/index.css`:
```css
--neon-cyan: #00f5ff
--neon-purple: #bf00ff
--neon-red: #ff0040
--neon-green: #00ff88
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain the cyberpunk aesthetic
- Test on multiple screen sizes

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **NASA EONET** for natural event data
- **USGS** for earthquake data
- **Open-Meteo** for weather and AQI data
- **Three.js** community for 3D visualization tools

---

## 📬 Contact

**Dev Lahrani** - [@Dev-Lahrani](https://github.com/Dev-Lahrani)

Project Link: [https://github.com/Dev-Lahrani/Live-weather-and-Natural-disaster-viewing-using-a-live-map](https://github.com/Dev-Lahrani/Live-weather-and-Natural-disaster-viewing-using-a-live-map)

---

<div align="center">

**⭐ Star this repo if you find it useful! ⭐**

Made with ❤️ and ☕

</div>
