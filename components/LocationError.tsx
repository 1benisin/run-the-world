import React from "react";
import { Linking, Platform, StyleSheet } from "react-native";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";
import { LocationError as LocationErrorType } from "../types/map";

interface LocationErrorProps {
  error: LocationErrorType | null;
  onDismiss: () => void;
  onUseDefaultLocation: () => void;
}

export function LocationError({
  error,
  onDismiss,
  onUseDefaultLocation,
}: LocationErrorProps) {
  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  if (!error) return null;

  return (
    <Portal>
      <Dialog visible={!!error} dismissable={false}>
        <Dialog.Title>Location Access Required</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            {error.message ||
              "This app needs access to your location to show you nearby running routes and track your runs."}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onUseDefaultLocation}>Use Default Location</Button>
          <Button onPress={openSettings}>Open Settings</Button>
          <Button onPress={onDismiss}>Dismiss</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
