## Relevant Files

- `hooks/useLocationPermissions.ts` - A new custom hook to encapsulate all logic for checking and requesting location permissions.
- `components/LocationPermissionModal.tsx` - A new UI component for the pre-permission explanatory modal.
- `components/LocationPermissionModal.test.tsx` - Unit tests for the `LocationPermissionModal` component.
- `app/(tabs)/index.tsx` - The main map screen where the permission flow will be triggered before a user can start a run.
- `app.config.js` - Project configuration file to add necessary permissions and background modes for iOS and Android.

## Tasks

- [x] **1.0 Create a Reusable Location Permission Hook**

  - [x] 1.1 Create a new file at `hooks/useLocationPermissions.ts`.
  - [x] 1.2 Import necessary functions from `expo-location`, including `requestBackgroundPermissionsAsync`, `getBackgroundPermissionsAsync`, and `hasServicesEnabledAsync`.
  - [x] 1.3 Create a hook that exposes the current permission status (`granted`, `denied`, `undetermined`) and a function to request permissions.
  - [x] 1.4 Add a function within the hook to check if device location services are enabled using `hasServicesEnabledAsync` and expose this status.

- [x] **2.0 Develop the Pre-Permission Modal UI**

  - [x] 2.1 Create a new file at `components/LocationPermissionModal.tsx`.
  - [x] 2.2 Build a reusable modal component that accepts `visible`, `onDismiss`, and `onConfirm` props.
  - [x] 2.3 The modal should display a clear, friendly message explaining why background location is required, as specified in the PRD.
  - [x] 2.4 Style the component using `react-native-paper` components to match the app's design.

- [x] **3.0 Integrate Permission Flow into the Main Map Screen**

  - [x] 3.1 In `app/(tabs)/index.tsx`, import and use the `useLocationPermissions` hook to get the permission status.
  - [x] 3.2 When a user initiates a run, check the permission status.
  - [x] 3.3 If the status is `undetermined`, show the `LocationPermissionModal`. On confirmation, call the request function from the hook.
  - [x] 3.4 If the permission request is `denied`, show a native `Alert` with a message explaining the requirement.
  - [x] 3.5 The alert must have an "Open Settings" button that calls `Linking.openSettings()` to deeplink the user to the app's settings.
  - [x] 3.6 Ensure the "Start Run" functionality is disabled unless permission status is `granted`.

- [x] **4.0 Handle Device Location Service Status**

  - [x] 4.1 In `app/(tabs)/index.tsx`, use the status from the hook that checks if device location services are enabled.
  - [x] 4.2 If services are disabled, show a native `Alert` prompting the user to enable them in their device settings.

- [x] **5.0 Configure Project for Background Location**
  - [x] 5.1 In `app.config.js`, add the `expo-location` section to the `plugins` array.
  - [x] 5.2 Set the `locationAlwaysAndWhenInUsePermission` property with a user-facing string for the iOS permission dialog.
  - [x] 5.3 Enable background location by setting `isIosBackgroundLocationEnabled` to `true`.
  - [x] 5.4 For Android, ensure `ACCESS_BACKGROUND_LOCATION` is enabled by setting `isAndroidBackgroundLocationEnabled` to `true`.
