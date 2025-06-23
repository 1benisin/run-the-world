## Relevant Files

- `App.tsx` - Main entry point for the app, where navigation is initialized.
- `navigation/BottomTabNavigator.tsx` - Contains the bottom tab navigator and custom tab bar component.
- `components/CustomTabBar.tsx` - Custom tab bar UI and logic.
- `screens/HomeScreen.tsx` - Skeleton screen for the Home tab.
- `screens/LocationScreen.tsx` - Skeleton screen for the Location tab.
- `screens/FavoritesScreen.tsx` - Skeleton screen for the Favorites tab.
- `screens/StarScreen.tsx` - Skeleton screen for the Star tab.
- `components/CustomTabBar.test.tsx` - Unit tests for the custom tab bar component.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `CustomTabBar.tsx` and `CustomTabBar.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Set up React Navigation and required dependencies

  - [x] 1.1 Install `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-screens`, and `react-native-safe-area-context`.
  - [x] 1.2 Install a popular icon library (e.g., `@expo/vector-icons` or `react-native-vector-icons`).
  - [x] 1.3 Configure navigation container in `App.tsx`.
  - [x] 1.4 Ensure the app builds and runs after installation.

- [x] 2.0 Implement the bottom tab navigator with four tabs

  - [x] 2.1 Create `navigation/BottomTabNavigator.tsx` and set up a bottom tab navigator.
  - [x] 2.2 Define four tabs: Home, Location, Favorites, and Star.
  - [x] 2.3 Link each tab to its corresponding screen component.
  - [x] 2.4 Set up navigation structure in `App.tsx` to use the bottom tab navigator.

- [x] 3.0 Create a custom tab bar component with a floating central button

  - [x] 3.1 Create `components/CustomTabBar.tsx` for the custom tab bar UI.
  - [x] 3.2 Implement four tab icons and a central floating button.
  - [x] 3.3 Make the central button visually prominent and floating above the bar.
  - [x] 3.4 Add navigation logic for the central button (e.g., placeholder action or navigation).
  - [x] 3.5 Highlight the active tab visually.
  - [x] 3.6 Ensure the tab bar does not overlap with system gestures (use safe area context).

- [x] 4.0 Create skeleton screens for each tab (Home, Location, Favorites, Star)

  - [x] 4.1 Create `screens/HomeScreen.tsx` with a placeholder UI.
  - [x] 4.2 Create `screens/LocationScreen.tsx` with a placeholder UI.
  - [x] 4.3 Create `screens/FavoritesScreen.tsx` with a placeholder UI.
  - [x] 4.4 Create `screens/StarScreen.tsx` with a placeholder UI.
  - [x] 4.5 Ensure each screen is accessible via its tab.

- [x] 5.0 Style the navigation bar according to design considerations

  - [x] 5.1 Apply a white background and subtle shadow to the bar.
  - [x] 5.2 Use outlined icons for inactive tabs and filled/colored icons for the active tab.
  - [x] 5.3 Style the central button with the app's primary accent color (e.g., orange).
  - [x] 5.4 Add rounded corners to the bar.
  - [x] 5.5 Make the navigation bar responsive to different device sizes.
