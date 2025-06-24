import * as Location from "expo-location";
import { PermissionStatus } from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";

export const useLocationPermissions = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED
  );
  const [servicesEnabled, setServicesEnabled] = useState<boolean | null>(null);

  const checkPermissions = useCallback(async () => {
    const { status } = await Location.getBackgroundPermissionsAsync();
    setPermissionStatus(status);
  }, []);

  const checkServices = useCallback(async () => {
    const enabled = await Location.hasServicesEnabledAsync();
    setServicesEnabled(enabled);
  }, []);

  const requestPermissions = useCallback(async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== PermissionStatus.GRANTED) {
      setPermissionStatus(foregroundStatus);
      return foregroundStatus;
    }

    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    setPermissionStatus(backgroundStatus);
    return backgroundStatus;
  }, []);

  useEffect(() => {
    checkPermissions();
    checkServices();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkPermissions();
        checkServices();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkPermissions, checkServices]);

  return { permissionStatus, servicesEnabled, requestPermissions };
};
