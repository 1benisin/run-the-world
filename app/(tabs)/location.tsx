import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapViewSimple } from "../../components/MapViewSimple";

export default function LocationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <MapViewSimple />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
