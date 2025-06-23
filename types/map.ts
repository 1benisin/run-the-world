import { Region } from "react-native-maps";

// Basic map region type
export type MapRegion = Region;

// Territory types
export interface TerritoryPoint {
  latitude: number;
  longitude: number;
}

export interface Territory {
  id: string;
  name: string;
  points: TerritoryPoint[];
  color?: string;
  isSelected?: boolean;
  metadata?: {
    population?: number;
    area?: number;
    description?: string;
    [key: string]: any;
  };
}

// Location types
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface LocationError {
  code: string;
  message: string;
}

// Map state types
export interface MapState {
  region: MapRegion;
  userLocation?: UserLocation;
  error?: LocationError;
  isLoading: boolean;
  selectedTerritory?: string;
}

// Map component props
export interface MapViewProps {
  initialRegion?: MapRegion;
  territories?: Territory[];
  onTerritoryPress?: (territory: Territory) => void;
  showUserLocation?: boolean;
  onRegionChange?: (region: MapRegion) => void;
  style?: any;
}

// Location hook return type
export interface UseLocationReturn {
  location: UserLocation | null;
  error: LocationError | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}
