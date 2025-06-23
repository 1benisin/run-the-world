# Map Data & Geospatial Features - Product Requirements Document

**Document Version:** 1.0  
**Date:** June 23, 2025

## 1. Introduction/Overview

This Product Requirements Document (PRD) outlines the functionality, technical design, and requirements for the geospatial data management and mapping features within the running application. This document specifically focuses on how user run data and "claimed territories" will be stored, managed, and displayed on an interactive map, utilizing PostgreSQL with the PostGIS extension hosted on Supabase, and the Google Maps Platform APIs for rendering.

The feature addresses the need for runners to visualize their running routes, claim geographic territories, and engage in a competitive territorial discovery system.

## 2. Goals

- To enable users to visualize their past running routes accurately on a map
- To allow users to "claim" geographic territories and see their owned areas
- To display claimed territories of all users on the map, fostering a sense of competition and discovery
- To provide a scalable and performant solution for managing and querying geospatial data

## 3. User Stories

**As a Runner, I want to:**

- **Track my run data:** I want my app to record my GPS coordinates during a run
- **Save my run:** I want my complete run path to be saved and associated with my user account so I can review it later
- **View my past runs:** I want to see my historical run routes displayed on the map
- **Automatically claim territory:** When I finish a run, I want the system to automatically calculate and claim territory based on my route path
- **See claimed territories:** I want to see other users' claimed territories (and my own) visually represented on the map, perhaps with different colors or shading
- **Identify territory owner:** When I tap on a claimed territory, I want to see who owns it
- **Handle overlapping claims:** When my new territory overlaps with existing territories, I want the system to automatically resolve conflicts by removing the overlap from existing territories

## 4. Functional Requirements

### 4.1 Run Tracking & Storage

1. The system MUST be able to receive a series of GPS coordinates (latitude, longitude) representing a user's run
2. The system MUST store the received GPS coordinates as a single LINESTRING geometry in the runs table
3. Each run MUST be associated with a unique user_id
4. The system MUST record the start_time, end_time, distance_meters, and duration_seconds for each run
5. The system MUST automatically calculate and store a territory polygon based on the run route when a run is completed

### 4.2 Territory Claiming

6. When a run is completed, the system MUST automatically generate a territory polygon based on the run route (e.g., creating a buffer around the route or using the route as a boundary)
7. The system MUST query the database to check for overlapping territories with the newly generated territory
8. If overlaps are detected, the system MUST remove the overlapping portions from existing territories
9. The system MUST update or delete existing territory records that have been modified due to overlaps
10. The system MUST save the new territory polygon associated with the completed run
11. The system SHOULD automatically calculate and store the area_sq_meters of the claimed polygon
12. The system MUST record claimed_at and updated_at timestamps for each territory

### 4.3 Map Display

13. The map MUST display the current user's past runs as visible polylines
14. The map MUST display all claimed territories within the visible map viewport as shaded polygons
15. The display of current user's runs and territories MUST be visually distinguishable from other users' territories (e.g., different colors)
16. Tapping/clicking on a claimed territory on the map MUST display information about that territory, including its name and owner_user_id
17. The map should efficiently load and unload run paths and territories as the user pans and zooms the map

## 5. Non-Goals (Out of Scope)

This PRD does NOT cover:

- User authentication and profile management (assumed to be handled elsewhere)
- Real-time GPS tracking during a run (focus is on post-run storage and display)
- Complex gaming mechanics beyond basic territory claiming/display
- Frontend UI/UX details beyond map interaction

## 6. Design Considerations

### 6.1 Database Design

**Technology:** PostgreSQL with PostGIS extension hosted on Supabase

**Data Model:**

**runs Table:**

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `start_time`: TIMESTAMP WITH TIME ZONE
- `end_time`: TIMESTAMP WITH TIME ZONE
- `distance_meters`: NUMERIC
- `duration_seconds`: INTEGER
- `path`: GEOMETRY(LINESTRING, 4326) (GPS path as PostGIS LineString)
- `created_at`: TIMESTAMP WITH TIME ZONE

**territories Table:**

- `id`: UUID (Primary Key)
- `owner_user_id`: UUID (Foreign Key)
- `run_id`: UUID (Foreign Key, links to the run that generated this territory)
- `polygon`: GEOMETRY(POLYGON, 4326) (Territory boundary as PostGIS Polygon)
- `area_sq_meters`: NUMERIC (Calculated area)
- `claimed_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

**Indexing:** Implement GiST spatial indexes on path and polygon columns for efficient spatial queries

### 6.2 Frontend Map Display

**Technology:** Google Maps JavaScript API (web) or Maps SDK for Android/iOS (mobile)

**Rendering:**

- Runs: Use `google.maps.Polyline` objects to render LINESTRING data
- Territories: Use `google.maps.Polygon` objects with styling to differentiate owners
- Consider Data Layer for large numbers of complex territories

## 7. Technical Considerations

### 7.1 Backend API Layer

Custom API layer mediating between frontend and PostGIS database with endpoints:

- `POST /api/runs`: Save new user run and automatically calculate/claim territory
- `GET /api/runs?user_id=[UUID]&bbox=[lat1,lng1,lat2,lng2]`: Retrieve user runs within bounding box
- `GET /api/territories?bbox=[lat1,lng1,lat2,lng2]`: Retrieve territories within bounding box
- `GET /api/territories/[UUID]`: Retrieve specific territory details

**Territory Calculation Process:**

1. When a run is completed, the system generates a territory polygon from the run route
2. The system queries for overlapping territories using PostGIS spatial functions (ST_Intersects)
3. For each overlap found, the system calculates the difference (ST_Difference) to remove overlapping portions
4. Existing territories are updated or deleted based on the overlap resolution
5. The new territory is saved with the calculated polygon

**Spatial Operations:**

- Territory generation: Use ST_Buffer on the run LINESTRING to create a polygon
- Overlap detection: Use ST_Intersects to find overlapping territories
- Overlap resolution: Use ST_Difference to remove overlapping portions from existing territories
- Area calculation: Use ST_Area to calculate territory sizes

### 7.2 Performance Requirements

- Map loads: Within 2-3 seconds for typical user interactions
- Spatial queries: Return results within 500ms under normal load
- Scalability: Handle thousands of users with hundreds of runs each and tens of thousands of territories

### 7.3 Security Requirements

- Row-Level Security (RLS) in Supabase for data protection
- Secure API key management for Google Maps Platform and Supabase
- Users can only access their own data or public data

## 8. Success Metrics

- Map loads within 2-3 seconds for typical user interactions
- Spatial queries return results within 500ms under normal load
- System can handle thousands of users with hundreds of runs each
- Zero overlapping territory claims (100% validation accuracy)
- GPS run paths and territory polygons stored with sufficient precision for real-world accuracy

## 9. Assumptions & Dependencies

- Supabase as the chosen backend service for PostgreSQL database hosting and API gateway
- Active Google Maps Platform API key available for necessary APIs (Maps JavaScript API, Routes API)
- Frontend framework (React Native with Expo) for user interface
- Client application responsible for acquiring accurate GPS location data during runs
- User authentication and profile management handled elsewhere in the application

## 10. Open Questions

- What is the buffer distance (in meters) to use when generating territory polygons from run routes? - we should use a buffer of 100 meters.
- Should there be a minimum/maximum area limit for automatically generated territories? - no, we should not have a minimum/maximum area limit for automatically generated territories.
- How should the system handle territory disputes when multiple users run overlapping routes? - we should handle this by removing the overlap from existing territories.
- What is the retention policy for old run data and associated territories? - we should keep all data
- Should there be any rate limiting on territory generation per user?
- How should the system handle very complex run routes that might generate irregular territory shapes? - yes, we should be able to handle this.
- Should users be able to manually adjust or delete their automatically generated territories? - no, we should not allow users to manually adjust or delete their automatically generated territories.
