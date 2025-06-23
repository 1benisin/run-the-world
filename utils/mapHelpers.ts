import { DEFAULT_REGION } from "../constants/map";
import {
  MapRegion,
  Territory,
  TerritoryPoint,
  UserLocation,
} from "../types/map";

/**
 * Calculate the center point of a territory
 */
export const calculateTerritoryCenter = (
  points: TerritoryPoint[]
): TerritoryPoint => {
  if (points.length === 0) {
    return { latitude: 0, longitude: 0 };
  }

  const sum = points.reduce(
    (acc, point) => ({
      latitude: acc.latitude + point.latitude,
      longitude: acc.longitude + point.longitude,
    }),
    { latitude: 0, longitude: 0 }
  );

  return {
    latitude: sum.latitude / points.length,
    longitude: sum.longitude / points.length,
  };
};

/**
 * Calculate the distance between two points in kilometers
 */
export const calculateDistance = (
  point1: TerritoryPoint,
  point2: TerritoryPoint
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);
  const lat1 = toRad(point1.latitude);
  const lat2 = toRad(point2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (point: TerritoryPoint): string => {
  return `${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`;
};

/**
 * Create a region centered on a point with specified zoom level
 */
export const createRegionFromPoint = (
  point: TerritoryPoint,
  zoomLevel: number = 14
): MapRegion => {
  const delta = Math.pow(2, 20 - zoomLevel) / 1000;
  return {
    latitude: point.latitude,
    longitude: point.longitude,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
};

/**
 * Check if a point is within a territory
 */
export const isPointInTerritory = (
  point: TerritoryPoint,
  territory: Territory
): boolean => {
  // Simple bounding box check first
  const bounds = territory.points.reduce(
    (acc, p) => ({
      minLat: Math.min(acc.minLat, p.latitude),
      maxLat: Math.max(acc.maxLat, p.latitude),
      minLon: Math.min(acc.minLon, p.longitude),
      maxLon: Math.max(acc.maxLon, p.longitude),
    }),
    {
      minLat: Infinity,
      maxLat: -Infinity,
      minLon: Infinity,
      maxLon: -Infinity,
    }
  );

  if (
    point.latitude < bounds.minLat ||
    point.latitude > bounds.maxLat ||
    point.longitude < bounds.minLon ||
    point.longitude > bounds.maxLon
  ) {
    return false;
  }

  // Ray casting algorithm for point-in-polygon
  let inside = false;
  for (
    let i = 0, j = territory.points.length - 1;
    i < territory.points.length;
    j = i++
  ) {
    const xi = territory.points[i].latitude;
    const yi = territory.points[i].longitude;
    const xj = territory.points[j].latitude;
    const yj = territory.points[j].longitude;

    const intersect =
      yi > point.longitude !== yj > point.longitude &&
      point.latitude < ((xj - xi) * (point.longitude - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

/**
 * Get the nearest territory to a point
 */
export const getNearestTerritory = (
  point: TerritoryPoint,
  territories: Territory[]
): Territory | null => {
  if (territories.length === 0) return null;

  return territories.reduce((nearest, territory) => {
    const center = calculateTerritoryCenter(territory.points);
    const distance = calculateDistance(point, center);
    const nearestDistance = nearest
      ? calculateDistance(point, calculateTerritoryCenter(nearest.points))
      : Infinity;

    return distance < nearestDistance ? territory : nearest;
  }, null as Territory | null);
};

/**
 * Format location data for display
 */
export const formatLocation = (location: UserLocation): string => {
  return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
};

/**
 * Get a default region if none is provided
 */
export const getDefaultRegion = (): MapRegion => {
  return DEFAULT_REGION;
};
