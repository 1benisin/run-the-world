import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocation } from "../context/LocationContext";
import { useUserLocation } from "../hooks/useUserLocation";

export function Map() {
  const { promptPermissions } = useLocation();
  const { location, getCurrentLocation, isLoading } = useUserLocation();
  const mapViewRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();

  const handleMyLocationPress = async () => {
    const hasPermission = await promptPermissions();
    if (hasPermission) {
      getCurrentLocation();
    }
  };

  useEffect(() => {
    if (location && mapViewRef.current) {
      const region: Region = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapViewRef.current.animateToRegion(region, 1000);
    }
  }, [location]);

  return (
    <View style={[styles.container]}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
      />
      <TouchableOpacity
        style={[styles.myLocationButton, { top: insets.top || 20 }]}
        onPress={handleMyLocationPress}
        disabled={isLoading}
      >
        <MaterialCommunityIcons name="crosshairs-gps" size={24} color="black" />
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  controlsContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    gap: 10,
  },
  zoomControls: {
    gap: 10,
  },
  controlButton: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  myLocationButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
