## Relevant Files

- `index.ts` - To be modified to set the app's entry point to Expo Router.
- `app/_layout.tsx` - To be modified to become the new root layout, handling auth logic and global providers.
- `app/(tabs)/_layout.tsx` - **New File.** Will define the tab navigator using Expo Router and integrate `CustomTabBar`.
- `app/login.tsx` - **New File.** A simple screen to render the existing `Auth` component.
- `App.tsx` - To be deleted after its logic is migrated.
- `navigation/BottomTabNavigator.tsx` - To be deleted as it will be replaced by `app/(tabs)/_layout.tsx`.

### Notes

- This refactor will align the project with current Expo best practices, simplifying navigation and state management.
- The `(tabs)` directory is a "route group" in Expo Router, which helps organize routes without affecting the URL.

## Tasks

- [x] 1.0 Reconfigure App Entry Point for Expo Router

  - [x] 1.1 Open `index.ts`.
  - [x] 1.2 Replace its entire content with a single line: `import 'expo-router/entry';`. This directs Expo to use the file-based routing system.

- [x] 2.0 Establish Root Layout and Authentication Flow in Expo Router

  - [x] 2.1 Create a new file `app/login.tsx`.
  - [x] 2.2 In `app/login.tsx`, import and export the existing `Auth` component from `components/Auth.tsx` as the default export. This makes it a navigable screen.
  - [x] 2.3 Open `app/_layout.tsx`.
  - [x] 2.4 Copy the session management logic (the `useState` and `useEffect` hooks for Supabase) from `App.tsx` into `app/_layout.tsx`.
  - [x] 2.5 Use a `useEffect` hook to watch the session. If the user is logged out, use `router.replace('/login')`. If they are logged in, use `router.replace('/(tabs)')`.
  - [x] 2.6 The main return function should handle the loading state, similar to the old `App.tsx`.

- [x] 3.0 Implement Tab Navigation with Expo Router

  - [x] 3.1 Create a new file `app/(tabs)/_layout.tsx`.
  - [x] 3.2 In this new file, import the `Tabs` component from `expo-router`.
  - [x] 3.3 Import the `CustomTabBar` from `components/CustomTabBar.tsx`.
  - [x] 3.4 Set up the component to use the `<Tabs>` navigator, passing your `CustomTabBar` to the `tabBar` prop.
  - [x] 3.5 Define each tab screen using `<Tabs.Screen>`. For example: `<Tabs.Screen name="index" />`, `<Tabs.Screen name="location" />`, etc.

- [x] 4.0 Consolidate Providers

  - [x] 4.1 In `app/_layout.tsx`, wrap the root `<Stack>` component with all necessary providers: `<PaperProvider>`, `<SafeAreaProvider>`, and our `<LocationProvider>`.
  - [x] 4.2 The `<Stack>` navigator should have screens for `(tabs)` and `login`, both with `headerShown: false`.

- [x] 5.0 Cleanup and Removal of Redundant Files
  - [x] 5.1 After verifying the new navigation structure works correctly, delete `App.tsx`.
  - [x] 5.2 Delete the entire `navigation/` directory, including `BottomTabNavigator.tsx`.
  - [x] 5.3 Run the app and test the full authentication flow and tab navigation.
