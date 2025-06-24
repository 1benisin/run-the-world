## Relevant Files

- `context/LocationContext.tsx` - **New File.** Will contain the React Context, Provider, and `useLocation` hook for managing location permissions across the app.
- `app/_layout.tsx` - To be modified to wrap the entire application with the new `LocationProvider`.
- `components/CustomTabBar.tsx` - To be refactored to remove local permission logic and use the global `useLocation` hook.
- `components/Map.tsx` - To be modified to use the `useLocation` hook for a new "current location" button.
- `components/LocationPermissionModal.tsx` - No major changes needed, but its usage will be centralized within the new `LocationProvider`.

### Notes

- This refactor centralizes all location permission logic into a single provider, making it easier to maintain and use from any component.
- Unit tests can be added for the `LocationProvider` to ensure the logic for showing the modal and handling permissions works as expected.

## Tasks

- [ ] 1.0 Create Location Context and Provider

  - [ ] 1.1 Create a new directory `context/`.
  - [ ] 1.2 Create a new file `context/LocationContext.tsx`.
  - [ ] 1.3 In `LocationContext.tsx`, define the context shape (`LocationContextType`) to include permission status, modal visibility, and a function to prompt for permissions.
  - [ ] 1.4 Create the `LocationProvider` component that uses the `useLocationPermissions` hook, manages state, and provides the context value.
  - [ ] 1.5 Implement the permission-prompting logic within the provider, which will control the visibility of the `LocationPermissionModal`.
  - [ ] 1.6 Render `LocationPermissionModal` inside the `LocationProvider` and wire up its state.
  - [ ] 1.7 Create and export a `useLocation` custom hook for easy context consumption.

- [ ] 2.0 Integrate Location Provider into the App

  - [ ] 2.1 Open `app/_layout.tsx`.
  - [ ] 2.2 Import the `LocationProvider`.
  - [ ] 2.3 Wrap the root layout component (e.g., `<Slot />` or `<Stack />`) with `<LocationProvider>`.

- [ ] 3.0 Refactor `CustomTabBar.tsx`

  - [ ] 3.1 Open `components/CustomTabBar.tsx`.
  - [ ] 3.2 Remove the `useLocationPermissions` hook and all related state (`modalVisible`) and handler functions (`handleModalConfirm`).
  - [ ] 3.3 Import and use the new `useLocation` hook to get the `promptPermissions` function.
  - [ ] 3.4 In `handleRunButtonPress`, replace the existing permission logic with a single call to the `promptPermissions` function from the context.
  - [ ] 3.5 Remove the `<LocationPermissionModal>` from the component's render output.

- [ ] 4.0 Add Location-Aware Feature to `Map.tsx`

  - [ ] 4.1 Open `components/Map.tsx`.
  - [ ] 4.2 Add a new UI element (e.g., a button) for "Go to My Location".
  - [ ] 4.3 Import and use the `useLocation` hook.
  - [ ] 4.4 In the `onPress` handler for the new button, call the `promptPermissions` function. If permission is granted, proceed to get the user's location and move the map.
  - [ ] 4.5 (Optional) Use a `useEffect` to check permissions on component mount if the map should center on the user's location automatically.

- [ ] 5.0 Cleanup
  - [ ] 5.1 Verify that all previous locations where `useLocationPermissions` was called have been refactored.
  - [ ] 5.2 Ensure the `LocationPermissionModal` is no longer rendered in any component other than the `LocationProvider`.
