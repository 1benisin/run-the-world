import React from "react";
import { StyleSheet, View } from "react-native";
import { Map } from "../../components/Map";

export default function LocationScreen() {
  return (
    <View style={styles.container}>
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
});
