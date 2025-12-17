// Disaster event types
export type DisasterCategory = 
  | 'earthquakes'
  | 'floods'
  | 'wildfires'
  | 'severeStorms'
  | 'volcanoes'
  | 'weather';

export type SeverityLevel = 'minor' | 'moderate' | 'severe' | 'extreme' | 'catastrophic';

export type AlertLevel = 'green' | 'yellow' | 'orange' | 'red';

export interface DisasterEvent {
  id: string;
  title: string;
  description: string;
  category: DisasterCategory;
  coordinates: [number, number]; // [longitude, latitude]
  date: string;
  sources: Array<{
    id: string;
    url: string;
  }>;
  closed?: string;
  
  // Earthquake specific
  magnitude?: number;
  depth?: number; // km
  
  // Enhanced data
  severity?: SeverityLevel;
  alertLevel?: AlertLevel;
  estimatedAffected?: number; // Estimated people affected
  impactRadius?: number; // km
  location?: {
    country?: string;
    region?: string;
    nearestCity?: string;
    distanceFromCity?: number; // km
  };
  
  // Additional metrics
  tsunami?: boolean;
  felt?: number; // Number of felt reports (USGS)
  mmi?: number; // Modified Mercalli Intensity
  cdi?: number; // Community Decimal Intensity
  sig?: number; // Significance (0-1000)
  status?: string;
  eventType?: string; // earthquake, quarry blast, etc.
}

// NASA EONET API Response types
export interface EONETCategory {
  id: string;
  title: string;
}

export interface EONETSource {
  id: string;
  url: string;
}

export interface EONETGeometry {
  magnitudeValue: number | null;
  magnitudeUnit: string | null;
  date: string;
  type: string;
  coordinates: [number, number];
}

export interface EONETEvent {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: EONETCategory[];
  sources: EONETSource[];
  geometry: EONETGeometry[];
}

export interface EONETResponse {
  title: string;
  description: string;
  link: string;
  events: EONETEvent[];
}

// Weather types
export interface WeatherData {
  city: string;
  country: string;
  coordinates: [number, number];
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  description: string;
  isDay: boolean;
  
  // Enhanced weather data
  feelsLike?: number;
  tempMin?: number;
  tempMax?: number;
  pressure?: number; // hPa
  visibility?: number; // km
  uvIndex?: number;
  cloudCover?: number; // percentage
  precipitation?: number; // mm
  precipitationProbability?: number; // percentage
  windDirection?: number; // degrees
  windGusts?: number; // km/h
  dewPoint?: number;
  
  // Air quality
  airQualityIndex?: number;
  airQualityLevel?: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  pm25?: number;
  pm10?: number;
  
  // Sun/Moon
  sunrise?: string;
  sunset?: string;
  
  // Alerts
  weatherAlerts?: Array<{
    event: string;
    severity: string;
    headline: string;
    description: string;
    start: string;
    end: string;
  }>;
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature?: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m?: number;
    wind_gusts_10m?: number;
    relative_humidity_2m: number;
    surface_pressure?: number;
    cloud_cover?: number;
    precipitation?: number;
    is_day: number;
    uv_index?: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
  };
}

// City data for weather
export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

// Filter state
export interface FilterState {
  earthquakes: boolean;
  floods: boolean;
  wildfires: boolean;
  severeStorms: boolean;
  volcanoes: boolean;
  weather: boolean;
}

// Category mapping for colors and icons
export interface CategoryInfo {
  id: DisasterCategory;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// App state
export interface AppState {
  disasters: DisasterEvent[];
  weather: WeatherData[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  selectedEvent: DisasterEvent | WeatherData | null;
  lastUpdated: Date | null;
}
