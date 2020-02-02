import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Alert, View, Platform } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
var geodist = require('geodist');

import CurrentRun from './CurrentRun';
import * as runActions from '../store/run/actions';
import * as territoryActions from '../store/territory/actions';
import * as polygonService from '../services/polygons';
import { auth } from '../services/firebase';

const Map = props => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState({
    latitude: 47.65,
    longitude: -122.35282
  });
  // const [map, setMap] = useState(null);
  let map = useRef(null);

  const territories = useSelector(state => state.territories);
  const user = useSelector(state => state.user);

  useEffect(() => {
    dispatch(territoryActions.fetchTerritories());
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.warn(
        'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      );
    } else {
      _getLocationAsync();
    }
  }, []);

  const _onMapReady = () => {
    map.current.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5
      },
      500
    );
  };

  const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
    // console.log('location', location);
  };

  const simulateNewRunCoordinate = e => {
    dispatch(runActions.addCoord(e.nativeEvent.coordinate));
  };

  return (
    <MapView
      ref={map}
      onMapReady={_onMapReady}
      style={styles.map}
      region={{
        latitude: location.latitude || 47.65,
        longitude: location.longitude || -122.35282,
        latitudeDelta: 0.05,
        longitudeDelta: 0.0000001
      }}
      onPress={simulateNewRunCoordinate}
      showsPointsOfInterest={false}
    >
      {props.children}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  }
});

export default Map;
