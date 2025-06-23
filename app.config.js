export default {
  expo: {
    name: "run_the_world",
    slug: "run_the_world",
    version: "1.0.0",
    scheme: ["runtheworld"],
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.runtheworld.app",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          "This app needs access to your location to show you nearby running routes and track your runs.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This app needs access to your location to track your runs and show you nearby running routes even when the app is in the background.",
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "3f623a39-f198-4645-92f5-5b8a551809ad",
      },
    },
    owner: "1benisin",
    plugins: ["expo-maps"],
  },
};
