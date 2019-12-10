import React from 'react';
import { View, Text } from 'react-native';
import MapView from 'react-native-maps';

// const Marker = MapView.Marker;

const Map = props => {
  // const renderMarkers = () => {
  //   return props.places.map((place, i) => (
  //     <Marker key={i} title={place.name} coordinate={place.coords} />
  //   ));
  // };

  const { region } = props;

  return (
    <MapView style={styles.container} region={region}>
      {/* {this.renderMarkers()} */}
    </MapView>
  );
};

const styles = {
  container: {
    // flex: 1,
    width: '100%',
    height: '80%'
  }
};

export default Map;
