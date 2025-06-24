# Run The World

A React Native running application that allows users to track their runs, claim territories, and compete with other runners in a gamified environment.

## 🏗️ Architecture Overview

This is a **React Native** application built with **Expo** that uses **Supabase** as the backend service. The app features real-time location tracking, territory claiming, and social features for runners.

## 🛠️ Tech Stack

### Frontend Framework

- **React Native** (v0.79.4) - Cross-platform mobile development
- **Expo** (v53.0.12) - Development platform and build tools
- **TypeScript** (v5.8.3) - Type-safe JavaScript
- **React** (v19.0.0) - UI library

### Navigation & Routing

- **Expo Router** (v5.1.0) - File-based routing for React Native
- **React Navigation** (v7.1.14) - Navigation library
- **React Navigation Bottom Tabs** (v7.4.1) - Bottom tab navigation

### Backend & Database

- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth + Storage)
- **PostGIS** - Geospatial database extension for PostgreSQL
- **Row-Level Security (RLS)** - Database-level security policies

### Maps & Location Services

- **React Native Maps** (v1.24.3) - Google Maps integration
- **Expo Maps** (v0.11.0) - Expo's map utilities
- **Expo Location** (v18.1.5) - GPS and location services
- **Google Maps API** - Map rendering and geocoding

### Authentication & Storage

- **Supabase Auth** - User authentication and session management
- **AsyncStorage** (v2.2.0) - Local data persistence
- **React Native URL Polyfill** (v2.0.0) - URL compatibility

### UI & Styling

- **React Native Paper** (v5.14.5) - Material Design components
- **Expo Vector Icons** (v14.1.0) - Icon library
- **React Native Gesture Handler** (v2.26.0) - Touch handling
- **React Native Reanimated** (v3.18.0) - Animation library

### Development Tools

- **Babel** - JavaScript compiler
- **Jest** (v30.0.2) - Testing framework
- **Metro** - React Native bundler

## 🏃 Core Features

### 1. Run Tracking

- **Background Location Tracking** - Continuous GPS monitoring during runs
- **Real-time Metrics** - Distance, pace, speed calculations
- **Route Visualization** - Display run paths on maps
- **Data Persistence** - Store runs in PostGIS database

### 2. Territory System

- **Territory Claiming** - Users can claim geographic areas
- **Overlap Prevention** - Backend validation prevents overlapping claims
- **Visual Representation** - Territories displayed as polygons on maps
- **Ownership Management** - Edit and delete claimed territories

### 3. Authentication & User Management

- **Email/Password Auth** - Secure user registration and login (Supabase Auth) - eventually will use phone number auth
- **Session Management** - Persistent login sessions
- **Password Reset** - Email-based password recovery
- **User Profiles** - Personal information and preferences

### 4. Map Features

- **Interactive Maps** - Google Maps integration
- **Real-time Location** - Current user position
- **Run History** - Display past running routes
- **Territory Visualization** - Show claimed areas

## 📱 App Structure

tbd

## 🗄️ Database Schema

### Tables (PostgreSQL + PostGIS)

- **users** - User profiles and authentication data
- **runs** - Run records with PostGIS LineString geometry
- **territories** - Claimed areas with PostGIS Polygon geometry

### Geospatial Features

- **LineString** - Store run routes as geometric paths
- **Polygon** - Store territory boundaries
- **Spatial Queries** - Overlap detection and area calculations

## 🔧 Environment Setup

### Required Environment Variables

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Platform Configuration

- **iOS** - Location permissions, Google Maps API key
- **Android** - Location permissions, adaptive icons

## 🚀 Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

## 🍎 Current Development Setup

### Development Environment

- **Platform**: macOS with iOS Simulator
- **Build System**: Expo EAS (Expo Application Services)
- **Development Build**: Local development build for testing native features

### EAS Configuration

The project uses **Expo EAS** for building and deploying:

- **Development Builds** - Local builds for testing native features
- **iOS Simulator** - Primary development target on Mac
- **Native Dependencies** - Full access to native modules and APIs

### Getting Started

```bash
# Install EAS CLI (if not already installed)
npm install -g @expo/eas-cli

# Login to Expo account
eas login

# Configure EAS (first time setup)
eas build:configure

# Create development build for iOS simulator
eas build --platform ios --profile development --local

# Or use cloud build (recommended for first time)
eas build --platform ios --profile development
```

### Development Workflow

1. **Local Development** - Use `npm start` for Expo Go development
2. **Native Features** - Use EAS development build for testing location, maps, etc.
3. **iOS Simulator** - Primary testing environment on Mac
4. **Hot Reload** - Changes reflect immediately in development build

### EAS Profiles

The project includes different EAS build profiles:

- **development** - For testing native features locally
- **preview** - For internal testing and QA
- **production** - For App Store deployment

## 📋 Planned Features

### Phase 1: Core Infrastructure ✅

- [x] Supabase integration
- [x] Authentication system
- [x] Basic map functionality
- [x] Location permissions

### Phase 2: Run Tracking 🚧

- [ ] Background location tracking
- [ ] Run data persistence
- [ ] Route visualization
- [ ] Real-time metrics

### Phase 3: Territory System 🚧

- [ ] Territory claiming UI
- [ ] Backend overlap validation
- [ ] Territory visualization
- [ ] Ownership management

### Phase 4: Social Features 📋

- [ ] User profiles
- [ ] Leaderboards
- [ ] Social sharing
- [ ] Community features

## 🔒 Security & Permissions

### Location Permissions

- **When In Use** - For map display and basic tracking
- **Always** - For background run tracking
- **Permission Management** - Handle denied permissions gracefully

### Data Security

- **Row-Level Security (RLS)** - Database-level access control
- **User Authentication** - Secure user sessions
- **Data Validation** - Backend validation for all user inputs

## 🎯 Key Technical Decisions

### Why Supabase?

- **PostgreSQL + PostGIS** - Excellent geospatial support
- **Real-time subscriptions** - Live updates for social features
- **Built-in authentication** - Secure user management
- **Row-level security** - Data privacy and access control

### Why Expo?

- **Rapid development** - Quick iteration and testing
- **Cross-platform** - Single codebase for iOS/Android
- **Rich ecosystem** - Extensive library support
- **Easy deployment** - Over-the-air updates

### Why React Native Maps?

- **Google Maps integration** - Familiar and feature-rich
- **Performance** - Native map rendering
- **Customization** - Extensive styling options
- **Geospatial support** - Polygon and polyline rendering

## 📚 Additional Resources

- [Planning Document](./.ai/planning/top-level-planning.md) - Detailed feature planning
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)

---

**Note:** This project is actively under development. The README will be updated as new features are implemented and the architecture evolves.
