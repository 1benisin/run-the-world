# Location Permissions Module PRD

## 1. Introduction/Overview

This document outlines the requirements for the location permissions system in the "Run The World" application. To accurately track user runs when the app is in the background, we need to secure "Always Allow" location permission from the user. This feature is critical for the core run-tracking functionality. The goal is to create a clear, user-friendly, and robust process for requesting and managing these permissions, including handling cases where permissions are denied or revoked.

## 2. Goals

- To reliably obtain "Always Allow" location permissions required for background run tracking.
- To provide a clear and helpful user experience for the permission-requesting flow.
- To gracefully handle all permission states (granted, denied, revoked, not yet requested).
- To ensure the app can guide users to system settings to manually grant permissions if they initially deny them.
- To detect and prompt users if device-level location services are disabled.

## 3. User Stories

- **As a new user preparing for my first run,** I want to be clearly informed why the app needs background location access, so I feel confident granting it.
- **As a user who wants to start a run,** I want the app to check for the necessary permissions and prompt me if they are missing, so I can start my run without issues.
- **As a user who initially denied "Always Allow" permission,** I want the app to give me simple instructions on how to enable it later in my phone's settings, so I can use the run-tracking feature.
- **As a user whose device location services are turned off,** I want the app to notify me and guide me on how to turn them on, so my run can be tracked.

## 4. Functional Requirements

1.  **Pre-Permission Explanatory UI:**

    - Before the official OS permission dialog is shown, the app MUST display a custom pop-up/modal.
    - This modal MUST explain _why_ "Always Allow" location access is necessary for tracking runs even when the app is in the background.
    - The modal MUST have a button like "Continue" or "Grant Permission" that triggers the OS permission request.

2.  **Permission Request Flow:**

    - The app MUST request "Always Allow" (background) location permission.
    - The app MUST also request foreground location permission, as it's often a prerequisite for background permissions on modern OS versions (e.g., iOS).

3.  **Permission Status Checks:**

    - Before a user can start a run, the app MUST check if "Always Allow" permission has been granted.
    - If permission is already granted, the user can proceed to the run screen.
    - If permission has not been requested, the pre-permission UI (FR1) and OS dialog (FR2) MUST be shown.
    - If permission is denied, the "Denied State" handling (FR4) MUST be triggered.

4.  **Denied State Handling:**

    - If the user denies the permission request, the app MUST display an alert.
    - This alert MUST inform the user that "Always Allow" permission is required to track runs.
    - The alert MUST include a button (e.g., "Open Settings") that deeplinks the user directly to the app's location settings screen within the device's System Settings.
    - The run-tracking feature MUST be disabled until the permission is granted.

5.  **Device Location Services Check:**
    - Before starting a run, the app MUST check if the device's global location service (GPS) is enabled.
    - If it is disabled, the app MUST display an alert prompting the user to turn on location services.
    - This alert SHOULD include a button that opens the device's main location settings screen.

## 5. Non-Goals (Out of Scope)

- Allowing users to track a run with only "While In Use" permission. The feature will be disabled entirely without "Always Allow" permission.
- Creating a complex, multi-screen tutorial for enabling permissions. A single alert with a deeplink is sufficient.

## 6. Design Considerations

- The pre-permission modal should be friendly and reassuring, not technical. It should focus on the user benefit (e.g., "To map your entire run, even when your screen is off, we need access to your location.").
- Alerts should use clear, direct language.

## 7. Technical Considerations

- Use the `expo-location` library to handle permission requests and status checks (`requestBackgroundPermissionsAsync`, `getBackgroundPermissionsAsync`, etc.).
- The deeplinking to settings can be achieved using `Linking.openSettings()` from Expo. This works on both iOS and Android.
- The flow for requesting permissions can be complex across different OS versions (e.g., iOS requires requesting foreground permission before background). The implementation must account for this.
- The app should check for permissions when the user attempts to access the run-tracking feature, not necessarily on app launch.

## 8. Success Metrics

- High percentage of users successfully granting "Always Allow" permission after seeing the pre-permission prompt.
- Low number of user complaints or support tickets related to confusion about location permissions.
- Successful and accurate tracking of runs, indicating the permission system is working as intended.

## 9. Open Questions

- None at this time.
