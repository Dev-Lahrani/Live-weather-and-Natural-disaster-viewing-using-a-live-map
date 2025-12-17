import type { CategoryInfo, DisasterCategory } from '../types';

export const CATEGORY_INFO: Record<DisasterCategory, CategoryInfo> = {
  earthquakes: {
    id: 'earthquakes',
    label: 'Earthquakes',
    color: '#ff0055',
    bgColor: 'rgba(255, 0, 85, 0.2)',
    borderColor: 'rgba(255, 0, 85, 0.5)',
  },
  floods: {
    id: 'floods',
    label: 'Floods',
    color: '#00a8ff',
    bgColor: 'rgba(0, 168, 255, 0.2)',
    borderColor: 'rgba(0, 168, 255, 0.5)',
  },
  wildfires: {
    id: 'wildfires',
    label: 'Wildfires',
    color: '#ff6600',
    bgColor: 'rgba(255, 102, 0, 0.2)',
    borderColor: 'rgba(255, 102, 0, 0.5)',
  },
  severeStorms: {
    id: 'severeStorms',
    label: 'Storms',
    color: '#bf00ff',
    bgColor: 'rgba(191, 0, 255, 0.2)',
    borderColor: 'rgba(191, 0, 255, 0.5)',
  },
  volcanoes: {
    id: 'volcanoes',
    label: 'Volcanoes',
    color: '#ff3300',
    bgColor: 'rgba(255, 51, 0, 0.2)',
    borderColor: 'rgba(255, 51, 0, 0.5)',
  },
  weather: {
    id: 'weather',
    label: 'Weather',
    color: '#00f5ff',
    bgColor: 'rgba(0, 245, 255, 0.2)',
    borderColor: 'rgba(0, 245, 255, 0.5)',
  },
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

// Convert coordinates to map position (for SVG viewBox 0 0 1000 500)
export function coordsToMapPosition(lon: number, lat: number): { x: number; y: number } {
  // Map longitude (-180 to 180) to x (0 to 1000)
  const x = ((lon + 180) / 360) * 1000;
  // Map latitude (90 to -90) to y (0 to 500)
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}
