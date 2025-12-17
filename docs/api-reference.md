# 🔌 API Reference

This document details all external APIs used by the application.

## Overview

The application uses three main data sources, all of which are **free and require no API key**:

| API | Purpose | Rate Limit |
|-----|---------|------------|
| USGS Earthquake API | Real-time earthquake data | Unlimited |
| NASA EONET | Natural events (wildfires, storms, etc.) | Unlimited |
| Open-Meteo | Weather and air quality data | 10,000/day |

---

## USGS Earthquake API

### Endpoint
```
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/
```

### Feeds Used

| Feed | Update Frequency | Description |
|------|------------------|-------------|
| `all_hour.geojson` | Every minute | All earthquakes, past hour |
| `all_day.geojson` | Every minute | All earthquakes, past day |
| `significant_week.geojson` | Every 15 min | Significant earthquakes, past week |

### Response Format

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "mag": 4.5,
        "place": "10km NE of City",
        "time": 1702828800000,
        "url": "https://earthquake.usgs.gov/...",
        "title": "M 4.5 - 10km NE of City",
        "alert": "green",
        "tsunami": 0
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-122.5, 37.8, 10.0]
      }
    }
  ]
}
```

### Severity Mapping

| Magnitude | Severity |
|-----------|----------|
| ≥ 7.0 | Critical |
| 5.0 - 6.9 | High |
| 3.0 - 4.9 | Medium |
| < 3.0 | Low |

### Documentation
- [USGS API Documentation](https://earthquake.usgs.gov/earthquakes/feed/)
- [GeoJSON Summary Format](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)

---

## NASA EONET API

### Endpoint
```
https://eonet.gsfc.nasa.gov/api/v3/events
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: "open" or "closed" |
| `limit` | number | Maximum number of events to return |
| `days` | number | Events from past N days |

### Example Request
```
https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50
```

### Response Format

```json
{
  "events": [
    {
      "id": "EONET_1234",
      "title": "Wildfire - California",
      "categories": [
        {
          "id": "wildfires",
          "title": "Wildfires"
        }
      ],
      "geometry": [
        {
          "date": "2024-12-15T00:00:00Z",
          "type": "Point",
          "coordinates": [-121.5, 38.5]
        }
      ]
    }
  ]
}
```

### Event Categories

| Category ID | Description |
|-------------|-------------|
| `wildfires` | Active wildfires |
| `severeStorms` | Hurricanes, typhoons, cyclones |
| `volcanoes` | Volcanic activity |
| `floods` | Flooding events |
| `drought` | Drought conditions |
| `landslides` | Landslide events |
| `seaLakeIce` | Sea and lake ice events |
| `earthquakes` | Earthquakes (we use USGS instead) |

### Documentation
- [EONET API Documentation](https://eonet.gsfc.nasa.gov/docs/v3)

---

## Open-Meteo API

### Weather Endpoint
```
https://api.open-meteo.com/v1/forecast
```

### Air Quality Endpoint
```
https://air-quality-api.open-meteo.com/v1/air-quality
```

### Weather Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `latitude` | float | Location latitude |
| `longitude` | float | Location longitude |
| `current` | string | Current weather variables |
| `timezone` | string | Timezone for timestamps |

### Example Weather Request
```
https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m
```

### Weather Response Format

```json
{
  "current": {
    "temperature_2m": 22.5,
    "relative_humidity_2m": 65,
    "weather_code": 3,
    "wind_speed_10m": 12.5
  },
  "current_units": {
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "weather_code": "wmo code",
    "wind_speed_10m": "km/h"
  }
}
```

### Weather Codes (WMO)

| Code | Description |
|------|-------------|
| 0 | Clear sky |
| 1, 2, 3 | Partly cloudy |
| 45, 48 | Fog |
| 51, 53, 55 | Drizzle |
| 61, 63, 65 | Rain |
| 71, 73, 75 | Snow |
| 80, 81, 82 | Rain showers |
| 95, 96, 99 | Thunderstorm |

### Air Quality Request
```
https://air-quality-api.open-meteo.com/v1/air-quality?latitude=40.7128&longitude=-74.006&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide
```

### Air Quality Response Format

```json
{
  "current": {
    "us_aqi": 45,
    "pm2_5": 12.3,
    "pm10": 25.6,
    "ozone": 45.2,
    "nitrogen_dioxide": 18.7
  }
}
```

### AQI Levels

| AQI Range | Level | Color |
|-----------|-------|-------|
| 0-50 | Good | Green |
| 51-100 | Moderate | Yellow |
| 101-150 | Unhealthy for Sensitive Groups | Orange |
| 151-200 | Unhealthy | Red |
| 201-300 | Very Unhealthy | Purple |
| 301+ | Hazardous | Maroon |

### Documentation
- [Open-Meteo Weather API](https://open-meteo.com/en/docs)
- [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)

---

## Rate Limiting & Caching

### Caching Strategy

To avoid hitting rate limits, the application implements caching:

```typescript
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const getCached = <T>(key: string): T | null => {
  const entry = localStorage.getItem(key);
  if (!entry) return null;
  
  const { data, timestamp } = JSON.parse(entry) as CacheEntry<T>;
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }
  
  return data;
};

const setCache = <T>(key: string, data: T): void => {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(entry));
};
```

### Request Batching

For weather data, we batch requests to reduce API calls:

```typescript
// Instead of 76 separate requests for 76 cities,
// we could use Open-Meteo's batch endpoint (future enhancement)
```

---

## Error Handling

### API Error Types

| Error | Cause | Handling |
|-------|-------|----------|
| 429 | Rate limit exceeded | Show cached data or "unavailable" |
| 500 | Server error | Retry with exponential backoff |
| Network | No connection | Show offline message |

### Example Error Handling

```typescript
const fetchWeather = async (lat: number, lon: number) => {
  try {
    const response = await fetch(buildWeatherUrl(lat, lon));
    
    if (response.status === 429) {
      console.warn('Rate limited, using cached data');
      return getCached('weather') || null;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setCache('weather', data);
    return data;
    
  } catch (error) {
    console.error('Weather fetch failed:', error);
    return getCached('weather') || null;
  }
};
```

---

## Adding New APIs

To add a new data source:

1. Create a new function in `src/services/api.ts`:

```typescript
export const fetchNewDataSource = async (): Promise<DataType[]> => {
  const response = await fetch(NEW_API_URL);
  const data = await response.json();
  return transformData(data);
};
```

2. Add types in `src/types/index.ts`:

```typescript
interface NewDataType {
  id: string;
  // ... other fields
}
```

3. Call from your component:

```typescript
useEffect(() => {
  fetchNewDataSource().then(setData);
}, []);
```
