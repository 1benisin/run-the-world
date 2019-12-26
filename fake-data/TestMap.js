/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import MapView from 'react-native-maps';
import pkg from '../package.json';

export default class TestMap extends Component {
  state = {
    mapBoundaries: ''
  };
  mapRef = null;
  setMapRef = ref => (this.mapRef = ref);

  handleRegionChange = async region => {
    // console.log(this.mapRef);
    // try {
    //   const result = await this.mapRef.getMapBoundaries();
    //   this.setState({ mapBoundaries: JSON.stringify(result) });
    // } catch (error) {
    //   console.error(error);
    // }
  };

  render() {
    const { dependencies: deps } = pkg;
    return (
      <>
        <Text>Map boundaries: {this.state.mapBoundaries}</Text>
        <Text>
          react-native: {deps['react-native']}, react-native-maps:
          {deps['react-native-maps']}
        </Text>
        <MapView
          ref={this.setMapRef}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          onRegionChangeComplete={this.handleRegionChange}
          style={styles.container}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});
