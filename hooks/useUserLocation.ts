import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { LOCATION_ACCURACY, LOCATION_UPDATE_INTERVAL } from "../constants/map";
import { LocationError, UseLocationReturn, UserLocation } from "../types/map";

const LOCATION_PERMISSION_KEY = "@location_permission_status";

export const useUserLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchId, setWatchId] = useState<Location.LocationSubscription | null>(
    null
  );

  const savePermissionStatus = useCallback(async (status: string) => {
    try {
      await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, status);
    } catch (err) {
      console.warn("Failed to save location permission status:", err);
    }
  }, []);

  const getPermissionStatus = useCallback(async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(LOCATION_PERMISSION_KEY);
    } catch (err) {
      console.warn("Failed to get location permission status:", err);
      return null;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      await savePermissionStatus(status);

      if (status !== "granted") {
        setError({
          code: "PERMISSION_DENIED",
          message: Platform.select({
            ios: "Location permission was denied. Please enable location services for this app in your iOS Settings.",
            android:
              "Location permission was denied. Please enable location services for this app in your Android Settings.",
            default: "Location permission was denied",
          }),
        });
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error requesting location permission:", err);
      setError({
        code: "PERMISSION_ERROR",
        message: "Error requesting location permission. Please try again.",
      });
      return false;
    }
  }, [savePermissionStatus]);

  const checkPermission = useCallback(async (): Promise<boolean> => {
    try {
      const savedStatus = await getPermissionStatus();
      if (savedStatus === "granted") {
        return true;
      }

      const { status } = await Location.getForegroundPermissionsAsync();
      await savePermissionStatus(status);
      return status === "granted";
    } catch (err) {
      console.error("Error checking location permission:", err);
      return false;
    }
  }, [getPermissionStatus, savePermissionStatus]);

  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setIsLoading(false);
          return;
        }
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Platform.select({
          ios: Location.Accuracy.Balanced,
          android: Location.Accuracy.Balanced,
          default: Location.Accuracy.Balanced,
        }),
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy ?? undefined,
        timestamp: currentLocation.timestamp,
      });
      setError(null);
    } catch (err) {
      console.error("Error getting current location:", err);
      setError({
        code: "LOCATION_ERROR",
        message: Platform.select({
          ios: "Unable to get your location. If you're using the simulator, you may need to simulate a location from the Debug menu.",
          android:
            "Unable to get your location. Please check if location services are enabled.",
          default: "Error getting current location",
        }),
      });
    } finally {
      setIsLoading(false);
    }
  }, [checkPermission, requestPermission]);

  const startTracking = useCallback(async () => {
    try {
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: LOCATION_UPDATE_INTERVAL,
          distanceInterval: LOCATION_ACCURACY.medium,
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy ?? undefined,
            timestamp: newLocation.timestamp,
          });
          setError(null);
        }
      );

      setWatchId(subscription);
    } catch (err) {
      console.error("Error starting location tracking:", err);
      setError({
        code: "TRACKING_ERROR",
        message: "Error starting location tracking. Please try again.",
      });
    }
  }, [checkPermission, requestPermission]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      watchId.remove();
      setWatchId(null);
    }
  }, [watchId]);

  // Get initial location on mount
  useEffect(() => {
    getCurrentLocation();
    return () => {
      stopTracking();
    };
  }, [getCurrentLocation, stopTracking]);

  return {
    location,
    error,
    isLoading,
    requestPermission,
    startTracking,
    stopTracking,
  };
};
