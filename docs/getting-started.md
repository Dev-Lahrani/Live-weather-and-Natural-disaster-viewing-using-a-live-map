# 🚀 Getting Started

This guide will help you get the Live Weather & Natural Disaster Tracking application up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** version 18.0 or higher
- **npm** version 9.0 or higher (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Check Your Versions

```bash
node --version
# Should output v18.0.0 or higher

npm --version
# Should output 9.0.0 or higher
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Dev-Lahrani/Live-weather-and-Natural-disaster-viewing-using-a-live-map.git
cd Live-weather-and-Natural-disaster-viewing-using-a-live-map
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 19
- TypeScript
- Tailwind CSS v4
- Three.js for 3D globe
- Recharts for data visualization
- And more...

### 3. Start the Development Server

```bash
npm run dev
```

The application will start and be available at:
```
http://localhost:5173
```

> **Note:** If port 5173 is in use, Vite will automatically use the next available port (5174, 5175, etc.)

## First Steps

### 1. Explore the Dashboard

When you first load the app, you'll see:
- **Interactive World Map** (70% of screen) - Shows disaster markers
- **Sidebar** (30% of screen) - Lists all active disasters
- **Stats Overlay** - Shows real-time statistics

### 2. Navigate the App

Use the header navigation to explore:
- **Dashboard** - Main disaster tracking view
- **Weather** - Global weather monitoring
- **Air Quality** - AQI data for major cities

### 3. Interact with Disasters

- **Click** on any disaster marker to see details
- **Hover** over markers for quick info
- Use **filter buttons** in sidebar to show/hide disaster types

### 4. Try the Features

- ⭐ **Watchlist** - Save your favorite cities
- ⚖️ **Compare** - Compare weather between cities
- 📈 **Trends** - View disaster analytics
- 🌍 **3D Globe** - Explore disasters in 3D

## Build for Production

When you're ready to deploy:

```bash
# Create production build
npm run build

# Preview the build locally
npm run preview
```

The build output will be in the `dist/` folder.

## Next Steps

- Read the [Architecture](./architecture.md) guide to understand the codebase
- Check the [API Reference](./api-reference.md) for data sources
- See [Customization](./customization.md) for theming options

## Common Issues

### Port Already in Use

If you see "Port 5173 is in use", either:
1. Stop the other process using that port
2. Or let Vite use the next available port

### Dependencies Not Installing

Try clearing the npm cache:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

For more troubleshooting, see [Troubleshooting](./troubleshooting.md).
