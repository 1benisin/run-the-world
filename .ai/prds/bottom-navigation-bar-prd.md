# Bottom Navigation Bar PRD

## 1. Introduction/Overview

This feature introduces a bottom navigation bar to the app, providing users with quick access to primary sections. The navigation bar includes four icons (Home, Location, Favorites, and Star) and a prominent floating central action button. The goal is to improve navigation, modernize the UI, and enhance user experience.

## 2. Goals

- Enable users to easily switch between main app sections.
- Provide a visually appealing, modern navigation bar.
- Highlight a primary action with a central floating button.

## 3. User Stories

- As a user, I want to tap the Home icon to return to the main screen.
- As a user, I want to tap the Location icon to view location-based features.
- As a user, I want to tap the Favorites icon to see my saved items.
- As a user, I want to tap the Star icon to access featured or bookmarked content.
- As a user, I want to tap the central button to quickly start a primary action (e.g. start a run).

## 4. Functional Requirements

1. The navigation bar must be fixed to the bottom of the screen and be visible on all screens.
2. The navigation bar must display four icons: Home, Location, Favorites, and Star.
3. The central button must be circular, visually prominent, and float above the bar.
4. Tapping each icon must navigate to the corresponding screen (e.g. Home -> Home screen, Location -> Location screen, Favorites -> Favorites screen, Star -> Star screen). Create a skeleton screen for each icon.
5. The active tab must be visually highlighted.
6. The navigation bar must be responsive to different device sizes.
7. The navigation bar must not overlap with system gestures (e.g., iOS home indicator).

## 5. Non-Goals (Out of Scope)

- No dynamic notification badges or counters on icons.
- No custom animations beyond basic highlighting and floating effect.
- No support for more than five navigation items.

## 6. Design Considerations

- Use a white background with subtle shadow for the bar.
- Use outlined icons for inactive tabs and filled/colored icons for the active tab.
- The central button should use the app's primary accent color (e.g., orange as in the image).
- Icons should be sourced from a standard icon library. Whatever library you think is best and commonly used in the industry in react native development.
- The bar should have rounded corners to match modern device UIs.

## 7. Technical Considerations

- Use React Navigation's Bottom Tab Navigator with a custom tab bar component.
- Use `react-native-safe-area-context` to avoid overlap with system UI.
- Ensure compatibility with both iOS and Android.

## 8. Success Metrics

- Users can navigate to all main sections via the bar without confusion.
- The central button is visually prominent and functional.
- No UI overlap or layout issues on supported devices.
- Positive user feedback on navigation experience.
