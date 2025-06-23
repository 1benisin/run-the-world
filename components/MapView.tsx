import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import RNMapView, {
  MapType,
  Polygon,
  PROVIDER_GOOGLE,
  MapViewProps as RNMapViewProps,
} from "react-native-maps";
import { DEFAULT_REGION, TERRITORY_COLORS } from "../constants/map";
import { useUserLocation } from "../hooks/useUserLocation";
import { MapRegion, Territory } from "../types/map";
import { LocationError } from "./LocationError";

interface MapViewProps extends Omit<RNMapViewProps, "initialRegion"> {
  initialRegion?: MapRegion;
  onRegionChange?: (region: MapRegion) => void;
  territories?: Territory[];
  onTerritoryPress?: (territory: Territory) => void;
  showUserLocation?: boolean;
}

const ZOOM_LEVELS = {
  IN: 0.5,
  OUT: 2,
  DEFAULT: 14,
};

export function MapView({
  initialRegion,
  onRegionChange,
  showUserLocation = true,
  territories = [],
  onTerritoryPress,
  style,
  ...props
}: MapViewProps) {
  const { location, error, isLoading } = useUserLocation();
  const mapRef = useRef<RNMapView>(null);
  const [mapType, setMapType] = useState<MapType>("standard");
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(
    null
  );

  const handleRegionChange = (region: MapRegion) => {
    onRegionChange?.(region);
  };

  const handleMyLocationPress = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.getCamera().then((camera) => {
        mapRef.current?.animateCamera(
          {
            ...camera,
            zoom: (camera.zoom ?? ZOOM_LEVELS.DEFAULT) + ZOOM_LEVELS.IN,
          },
          { duration: 300 }
        );
      });
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.getCamera().then((camera) => {
        mapRef.current?.animateCamera(
          {
            ...camera,
            zoom: (camera.zoom ?? ZOOM_LEVELS.DEFAULT) - ZOOM_LEVELS.OUT,
          },
          { duration: 300 }
        );
      });
    }
  };

  const toggleMapType = () => {
    setMapType((current) =>
      current === "standard" ? "satellite" : "standard"
    );
  };

  const handleTerritoryPress = (territory: Territory) => {
    setSelectedTerritoryId(territory.id);
    onTerritoryPress?.(territory);
  };

  const handleUseDefaultLocation = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(DEFAULT_REGION, 1000);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <RNMapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion || DEFAULT_REGION}
        onRegionChange={handleRegionChange}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={true}
        rotateEnabled={false}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={false}
        mapType={mapType}
        onMapReady={() => setIsMapReady(true)}
        {...props}
      >
        {territories.map((territory) => (
          <Polygon
            key={territory.id}
            coordinates={territory.points}
            fillColor={territory.color ?? TERRITORY_COLORS.primary}
            strokeColor={TERRITORY_COLORS.border}
            strokeWidth={2}
            tappable={true}
            onPress={() => handleTerritoryPress(territory)}
            zIndex={territory.id === selectedTerritoryId ? 1 : 0}
          />
        ))}
      </RNMapView>
      <View style={styles.controlsContainer}>
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleZoomIn}
            disabled={!isMapReady}
          >
            <MaterialIcons name="add" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleZoomOut}
            disabled={!isMapReady}
          >
            <MaterialIcons name="remove" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleMapType}
          disabled={!isMapReady}
        >
          <MaterialIcons
            name={mapType === "standard" ? "terrain" : "map"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.myLocationButton, !isMapReady && styles.disabledButton]}
        onPress={handleMyLocationPress}
        disabled={!location || !isMapReady}
      >
        <MaterialIcons name="my-location" size={24} color="#000" />
      </TouchableOpacity>
      {!isMapReady && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
      <LocationError
        error={error}
        onDismiss={() => setIsMapReady(true)}
        onUseDefaultLocation={handleUseDefaultLocation}
      />
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
    bottom: 20,
    right: 20,
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
