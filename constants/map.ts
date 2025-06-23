// Default map settings
export const DEFAULT_ZOOM_LEVEL = 14;

// Default center location (San Francisco)
export const DEFAULT_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Territory color scheme
export const TERRITORY_COLORS = {
  primary: "#4A90E2", // Main territory color
  secondary: "#50E3C2", // Secondary territory color
  highlight: "#F5A623", // Highlight color for selected territory
  border: "#2C3E50", // Border color for territories
};

// Map style settings
export const MAP_STYLE = {
  default: "standard",
  satellite: "satellite",
  hybrid: "hybrid",
};

// Animation settings
export const ANIMATION_DURATION = 500; // milliseconds

// Location tracking settings
export const LOCATION_ACCURACY = {
  high: 5, // meters
  medium: 10, // meters
  low: 20, // meters
};

// Update intervals
export const LOCATION_UPDATE_INTERVAL = 5000; // milliseconds
