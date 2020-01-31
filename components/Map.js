import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Alert, View } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
var geodist = require('geodist');

import CurrentRun from './CurrentRun';
import * as runActions from '../store/run/actions';
import * as territoryActions from '../store/territory/actions';
import * as polygonService from '../services/polygons';
import { auth } from '../services/firebase';

const Map = props => {
  const dispatch = useDispatch();

  const territories = useSelector(state => state.territories);
  const user = useSelector(state => state.user);

  useEffect(() => {
    dispatch(territoryActions.fetchTerritories());
  }, []);

  const simulateNewRunCoordinate = e => {
    dispatch(runActions.addCoord(e.nativeEvent.coordinate));
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 47.65,
        longitude: -122.35282,
        latitudeDelta: 0.06,
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
