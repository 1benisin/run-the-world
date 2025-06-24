import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PermissionStatus } from "expo-location";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLocationPermissions } from "../hooks/useLocationPermissions";
import LocationPermissionModal from "./LocationPermissionModal";

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { permissionStatus, servicesEnabled, requestPermissions } =
    useLocationPermissions();
  const [modalVisible, setModalVisible] = useState(false);

  const handleTabPress = (routeName: string) => {
    navigation.navigate(routeName);
  };

  const handleRunButtonPress = async () => {
    if (servicesEnabled === false) {
      Alert.alert(
        "Location Services Disabled",
        "Please enable location services in system settings to use this feature.",
        [{ text: "OK" }]
      );
      return;
    }

    if (permissionStatus === PermissionStatus.GRANTED) {
      // TODO: Implement run start logic
      console.log("Starting run...");
      return;
    }

    if (permissionStatus === PermissionStatus.UNDETERMINED) {
      setModalVisible(true);
      return;
    }

    if (permissionStatus === PermissionStatus.DENIED) {
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
    }
  };

  const handleModalConfirm = async () => {
    setModalVisible(false);
    const status = await requestPermissions();
    if (status === PermissionStatus.DENIED) {
      // Give user a moment before showing the alert
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
  };

  return (
    <>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const iconName = getIconName(route.name, isFocused);

            // Add extra space between Location and Favorites
            const extraMargin =
              route.name === "Location"
                ? { marginRight: 40 }
                : route.name === "Favorites"
                ? { marginLeft: 40 }
                : {};

            return (
              <TouchableOpacity
                key={route.name}
                onPress={() => handleTabPress(route.name)}
                style={[styles.tabButton, extraMargin]}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={iconName}
                  size={24}
                  color={isFocused ? "#FF6B00" : "#666"}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Floating Run Button */}
        <TouchableOpacity
          style={styles.runButton}
          onPress={handleRunButtonPress}
          activeOpacity={0.8}
        >
          <View style={styles.runButtonInner}>
            <MaterialCommunityIcons name="run" size={32} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <LocationPermissionModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}

function getIconName(
  routeName: string,
  isFocused: boolean
): keyof typeof MaterialCommunityIcons.glyphMap {
  switch (routeName) {
    case "Home":
      return isFocused ? "home" : "home-outline";
    case "Location":
      return isFocused ? "map-marker" : "map-marker-outline";
    case "Favorites":
      return isFocused ? "heart" : "heart-outline";
    case "Profile":
      return isFocused ? "account" : "account-outline";
    default:
      return "help-circle-outline";
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "transparent",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 80,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  runButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  runButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
});
