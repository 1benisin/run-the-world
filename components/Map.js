import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Alert } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
var geodist = require('geodist');

import CurrentRun from './CurrentRun';
import * as runActions from '../store/run/actions';
import * as territoryActions from '../store/territory/actions';
import * as polyHelper from '../helpers/polyHelper';
import { auth } from '../services/firebase';

const Map = ({ onDebugMapTouch, currentRunCoords }) => {
  const dispatch = useDispatch();

  const territories = useSelector(state => state.territories);
  const user = useSelector(state => state.user);

  useEffect(() => {
    dispatch(territoryActions.fetchTerritories());
  }, []);

  const handleRegionChange = async region => {
    dispatch(territoryActions.fetchTerritories(region));
  };

  const simulateNewRunCoordinate = e => {
    // onDebugMapTouch(e.nativeEvent.coordinate);
    dispatch(runActions.addCoord(e.nativeEvent.coordinate));
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 47.620937,
        longitude: -122.35282,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221
      }}
      onPress={simulateNewRunCoordinate}
      showsPointsOfInterest={false}
    >
      {territories.map(ter => (
        <Polygon
          key={ter.id}
          coordinates={polyHelper.pointsToCoords(ter.coords)}
          strokeWidth={3}
          strokeColor="#000"
          fillColor={
            ter.userId === user.uid
              ? 'rgba(100, 100, 255, 0.4)'
              : 'rgba(255, 20, 0, 0.2)'
          }
        />
      ))}
      {/* {currentRunCoords && currentRunCoords.length > 2 && (
        <Polygon
          coordinates={currentRunCoords}
          strokeColor="#ccc"
          fillColor="rgb(200, 255, 255)"
        />
      )} */}
      <CurrentRun />
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
