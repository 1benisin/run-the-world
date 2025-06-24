import React from "react";
import { StyleSheet } from "react-native";
import { Button, Card, Modal, Portal, Text } from "react-native-paper";

interface LocationPermissionModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  visible,
  onDismiss,
  onConfirm,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Card>
          <Card.Title title="Location Permission" />
          <Card.Content>
            <Text>
              To map your entire run, even when your screen is off, Run The
              World needs access to your location in the background.
            </Text>
            <Text style={styles.subtext}>
              Your location data is only used to track your runs and is never
              shared.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button onPress={onConfirm}>Grant Permission</Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  subtext: {
    marginTop: 10,
    fontSize: 12,
  },
});

export default LocationPermissionModal;
