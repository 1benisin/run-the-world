**Summary:** Core Components & Modules

This document outlines the major functional areas and technical components required for the [Your App Name] running application. Each section represents a distinct module that will likely require its own detailed planning and implementation.

**Summary:** I. Core Infrastructure & Data Management

## 1. Supabase Integration Module

Purpose: Handles all communication with your Supabase backend (PostgreSQL database, Auth, Storage, Edge Functions).

### 1.1 Database Connection and Client Setup

Details: Setting up the initial Supabase client in your React Native application, including API URL and public key configuration.

### 1.2 Querying, Inserting, Updating, and Deleting Data

Details: Implementing functions for CRUD (Create, Read, Update, Delete) operations on the runs and territories tables in PostgreSQL, utilizing Supabase client methods.

### 1.3 Row-Level Security (RLS) Management

Details: Configuring and verifying Row-Level Security policies in Supabase to ensure data privacy and appropriate access controls for users.

### 1.4 Supabase Realtime Integration (Optional)

Details: Considering and, if decided, implementing Supabase Realtime subscriptions for live updates on data (e.g., new territory claims appearing instantly on other users' maps).

## 2. Authentication (Auth) Module

Purpose: Manages user identity, sign-up, login, and session persistence.

### 2.1 User Registration

Details: Implementing the user sign-up flow, including email/password creation and storing basic user profile information.

### 2.2 User Login and Logout

Details: Handling user authentication, session creation upon login, and session invalidation upon logout using Supabase Auth.

### 2.3 Password Reset Functionality

Details: Implementing the flow for users to reset forgotten passwords via email.

### 2.4 Session Management

Details: Ensuring user sessions persist across app restarts and handling token refreshing to keep users logged in securely.

### 2.5 Supabase Auth Listener Integration

Details: Setting up listeners to react to authentication state changes (e.g., user logged in, logged out, or session expired) to update app UI and data access accordingly.

## 3. User Profile Management Module

Purpose: Allows users to view and update their personal information.

### 3.1 User Profile Screen UI

Details: Designing and implementing the user interface for displaying personal profile details.

### 3.2 Editing User Information

Details: Implementing functionality for users to modify their display name, profile picture (if applicable), or other preferences stored in Supabase.

### 3.3 Storing User Preferences

Details: Defining and managing additional user-specific preferences within the Supabase database.

**Summary:** II. Location & Geospatial Features

## 4. Location Permissions Module

Purpose: Handles requesting and managing necessary device location permissions.

### 4.1 Requesting Foreground Location Permission

Details: Implementing the prompt to request When In Use location permission (for when the app is active).

### 4.2 Requesting Background Location Permission

Details: Implementing the prompt to request Always location permission (crucial for tracking runs when the app is backgrounded or closed).

### 4.3 Checking Current Permission Status

Details: Regularly checking the current status of location permissions to provide appropriate user feedback or alter app behavior.

### 4.4 Guiding Users to Device Settings

Details: Implementing logic to detect if permissions are permanently denied and guiding users to their device settings to manually enable them.

### 4.5 Handling Permission Changes

Details: Setting up listeners or checks to react to users changing location permissions while the app is running.

## 5. Run Location Tracking Module

Purpose: Captures and processes GPS data during an active run.

### 5.1 Starting and Stopping Background Location Updates

Details: Implementing the functions to initiate and terminate expo-location's background tracking service, including Location.startLocationUpdatesAsync and Location.stopLocationUpdatesAsync.

### 5.2 Defining Background Task (TaskManager.defineTask)

Details: Setting up the TaskManager to handle location updates even when the app is not in the foreground, processing location data received in the background.

### 5.3 Accumulating Raw GPS Data

Details: Collecting the sequence of latitude, longitude, timestamp, speed, accuracy, and heading points from LocationObjectCoords during a run.

### 5.4 Filtering/Smoothing GPS Data

Details: Implementing algorithms to reduce GPS noise and improve the quality of the recorded path, potentially discarding inaccurate points.

### 5.5 Calculating Real-time Run Metrics

Details: Performing on-the-fly calculations for current distance, speed, and pace during an active run.

## 6. Run Data Persistence Module

Purpose: Stores a completed run's data into the Supabase PostGIS database.

### 6.1 Converting GPS Points to LineString

Details: Implementing logic to convert the collected array of {latitude, longitude} points into a GEOMETRY(LINESTRING, 4326) format suitable for PostGIS.

### 6.2 Calculating Total Run Distance

Details: Utilizing PostGIS's ST_Length function (or a similar client-side geodesic calculation) on the generated LINESTRING to get the accurate total distance.

### 6.3 Storing Run Details

Details: Inserting the full run record (including start_time, end_time, duration, distance, and the LINESTRING) into the runs table via Supabase client.

### 6.4 Error Handling for Run Saving

Details: Implementing robust error handling for network issues, database errors, or data conversion failures during the save process.

## 7. Map Display Module (User Runs)

Purpose: Renders the user's past running routes on the Google Map.

### 7.1 Fetching User Run Data

Details: Querying the Supabase runs table to retrieve run data for the currently authenticated user, potentially filtered by a visible map bounding box.

### 7.2 Converting PostGIS LineString to Google Maps Polyline

Details: Transforming the LINESTRING geometry from the database into the format required by google.maps.Polyline for display on the map.

### 7.3 Styling Run Polylines

Details: Applying visual styles (color, stroke weight, opacity) to the displayed run polylines to clearly represent the user's path.

### 7.4 Map Interaction for Run Display

Details: Implementing logic to dynamically load and unload run data as the user pans and zooms the map, ensuring performance.

## 8. Territory Claiming & Management Module

Purpose: Enables users to define, claim, and manage their territories.

### 8.1 Territory Drawing UI

Details: Providing interactive tools on the Google Map (e.g., drawing controls) for users to create new polygon shapes.

### 8.2 Claim Submission Logic

Details: Sending the coordinates of the proposed territory polygon from the frontend to the backend API for validation and storage.

### 8.3 Backend Overlap Validation

Details: Implementing a PostGIS query using ST_Intersects to check if the new territory POLYGON overlaps with any existing POLYGON in the territories table.

### 8.4 Territory Area Calculation

Details: Using PostGIS's ST_Area function to compute the area of the claimed polygon for storage and potential leaderboard/ranking features.

### 8.5 Storing/Updating Territory Polygons

Details: Inserting the new valid POLYGON into the territories table or updating an existing one if the claim is an modification.

### 8.6 Claim Feedback

Details: Providing clear success or error messages to the user based on the validation results (e.g., "Territory claimed successfully!" or "This territory overlaps with an existing claim.").

### 8.7 Editing/Deleting Claimed Territories

Details: Implementing functionality for territory owners to modify or remove their claimed territories, including authorization checks.

## 9. Map Display Module (Territories)

Purpose: Renders both individual user's claimed territories and public/global claimed territories on the Google Map.

### 9.1 Fetching Territory Data

Details: Querying the Supabase territories table to retrieve all claimed territories within the current map viewport.

### 9.2 Converting PostGIS Polygon to Google Maps Polygon

Details: Transforming the POLYGON geometry from the database into the format required by google.maps.Polygon for display.

### 9.3 Styling Territories for Differentiation

Details: Applying distinct visual styles (fill color, stroke, opacity) to differentiate the current user's territories from others, and potentially variations for different territory statuses.

### 9.4 Click/Tap Interaction on Territories

Details: Implementing event listeners so that tapping on a territory reveals information such as the owner's user_id and the territory name.

### 9.5 Efficient Territory Loading

Details: Optimizing the loading and rendering of potentially many territory polygons as the user pans and zooms the map, considering strategies like clustering or simplified rendering for high-density areas.

**Summary:** III. User Data Management (Admin/User Actions)

## 10. Run Data Deletion Module

    Purpose: Allows users to delete their recorded runs.

### 10.1 UI for Run Deletion

Details: Designing an interface that allows users to select one or more of their runs and initiate a deletion.

### 10.2 Deletion Confirmation

Details: Implementing a confirmation step to prevent accidental deletion of run data.

### 10.3 Backend Run Deletion Logic

Details: Developing the Supabase function or API endpoint to securely delete specific run records from the runs table, ensuring the requesting user is the owner.

## 11. User Account Deletion Module

    Purpose: Provides functionality for users to delete their entire account and associated data.

### 11.1 UI for Account Deletion

Details: Designing a clear and unambiguous user interface for the account deletion process, emphasizing the finality of the action.

### 11.2 Multi-Step Confirmation

Details: Implementing a robust confirmation process, potentially requiring password re-entry or a specific confirmation phrase, to prevent accidental deletions.

### 11.3 Backend Account Deletion Logic

Details: Developing the Supabase function or API endpoint that handles the deletion of the user's account from Supabase Auth and then cascades to delete all associated runs and territories records.

### 11.4 Data Anonymization/Soft Delete (Consideration)

Details: Discussing and deciding whether to fully delete user data or to anonymize it (e.g., set user_id to null on runs/territories) for historical data purposes, if allowed by privacy policies.
