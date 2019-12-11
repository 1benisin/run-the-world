import React from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import latLngArrays from '../fake-data/fake-data';

const Map = props => {
  const region = {
    latitude: 47.620937,
    longitude: -122.35282,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0221
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.mapStyle} region={region}>
        {latLngArrays.map((territory, key) => (
          <Polygon
            key={key}
            coordinates={territory}
            strokeColor="#ccc"
            fillColor="rgba(0, 255, 255, 0.4)"
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          title="START"
          color="#003B00"
          accessibilityLabel="Learn more about this purple button"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc'
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  mapStyle: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  button: {
    // borderRadius: 100
  },
  buttonContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10
  }
});

export default Map;
