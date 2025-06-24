import { PermissionStatus } from "expo-location";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Alert, Linking } from "react-native";
import LocationPermissionModal from "../components/LocationPermissionModal";
import { useLocationPermissions } from "../hooks/useLocationPermissions";

interface LocationContextType {
  permissionStatus: PermissionStatus | null;
  servicesEnabled: boolean | null;
  promptPermissions: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const { permissionStatus, servicesEnabled, requestPermissions } =
    useLocationPermissions();
  const [modalVisible, setModalVisible] = useState(false);

  const handlePermissionsResult = (status: PermissionStatus) => {
    if (status === PermissionStatus.DENIED) {
      setTimeout(() => {
        Alert.alert(
          "Permission Denied",
          'To track your run, "Always Allow" location permission is required. Please enable it in settings.',
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }, 500);
    }
    return status === PermissionStatus.GRANTED;
  };

  const promptPermissions = async (): Promise<boolean> => {
    if (servicesEnabled === false) {
      Alert.alert(
        "Location Services Disabled",
        "Please enable location services in system settings to use this feature.",
        [{ text: "OK" }]
      );
      return false;
    }

    if (permissionStatus === PermissionStatus.GRANTED) {
      return true;
    }

    if (permissionStatus === PermissionStatus.UNDETERMINED) {
      setModalVisible(true);
      // We can't know the result synchronously here.
      // The caller should not proceed with location-dependent actions.
      return false;
    }

    if (permissionStatus === PermissionStatus.DENIED) {
      // Re-show the alert to go to settings.
      handlePermissionsResult(permissionStatus);
      return false;
    }

    // This case handles if status is somehow null or unexpected.
    // Fallback to requesting permissions directly.
    const status = await requestPermissions();
    return handlePermissionsResult(status);
  };

  const handleModalConfirm = async () => {
    setModalVisible(false);
    const status = await requestPermissions();
    handlePermissionsResult(status);
  };

  const value = {
    permissionStatus,
    servicesEnabled,
    promptPermissions,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
      <LocationPermissionModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onConfirm={handleModalConfirm}
      />
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
