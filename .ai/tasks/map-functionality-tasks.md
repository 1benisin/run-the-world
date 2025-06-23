## Relevant Files

- `app/(tabs)/location.tsx` - Main location screen component that will display the map
- `app/(tabs)/running.tsx` - Future running screen that will also use the map
- `hooks/useUserLocation.ts` - Custom hook for managing location permissions and tracking
- `components/MapView.tsx` - Reusable map component
- `components/LocationError.tsx` - Component for displaying location permission errors
- `constants/map.ts` - Map-related constants (default zoom, center location, etc.)
- `types/map.ts` - TypeScript types for map-related data
- `utils/mapHelpers.ts` - Utility functions for map operations

### Notes

- The map component should be reusable between Location and Running screens
- Location permissions should be requested only once and stored
- Dummy territory data should be easily replaceable with real data later
- Map styling should be consistent across the app

## Tasks

- [x] 1.0 Setup Map Dependencies and Configuration

  - [x] 1.1 Install required packages (expo-location, react-native-maps)
  - [x] 1.2 Create map constants file with default settings
    - Default zoom level (suggested: 14)
    - Default center location (suggested: San Francisco)
    - Territory color scheme
  - [x] 1.3 Create TypeScript types for map data
  - [x] 1.4 Create map utility functions for common operations

- [x] 2.0 Implement Location Services

  - [x] 2.1 Create useUserLocation custom hook
    - Location permission request logic
    - Current location tracking
    - Error state management
  - [x] 2.2 Create LocationError component
    - Error message display
    - Settings button implementation
    - Fallback to default location
  - [x] 2.3 Implement location permission persistence
  - [x] 2.4 Add location permission request to app startup

- [x] 3.0 Create Map UI Components

  - [x] 3.1 Create base MapView component
    - Full-screen implementation
    - Fixed north orientation
    - Pinch-to-zoom functionality
  - [x] 3.2 Add "My Location" button
    - Position in bottom right corner
    - Smooth animation to user location
  - [x] 3.3 Implement map controls
    - Zoom controls
    - Map type controls (if needed)
  - [x] 3.4 Add loading states
    - Initial map load
    - Location permission request
    - Location tracking

- [x] 4.0 Implement Territory Display

  - [x] 4.1 Create dummy territory data structure
    - Polygon coordinates
    - Territory metadata
  - [x] 4.2 Implement territory polygon rendering
    - Color assignment
    - Opacity settings
  - [x] 4.3 Add territory interaction handlers
    - Touch events
    - Selection state
  - [x] 4.4 Implement territory update mechanism
    - Data refresh logic
    - Visual updates
