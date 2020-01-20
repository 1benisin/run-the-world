import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Alert } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
var geodist = require('geodist');

import * as runActions from '../store/actions/run';
import * as territoryActions from '../store/actions/territory';
import * as polyHelper from '../helpers/polyHelper';

const Map = ({ onDebugMapTouch, currentRunCoords }) => {
  const dispatch = useDispatch();

  const territories = useSelector(state => state.territories);

  console.log('dkc3', 'HHHH', territories);

  useEffect(() => {
    dispatch(territoryActions.fetchTerritories());
  }, []);

  const handleRegionChange = async region => {
    dispatch(territoryActions.fetchTerritories(region));
  };

  const simulateNewRunCoordinate = e => {
    onDebugMapTouch(e.nativeEvent.coordinate);
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
            ter.userId === 'user1'
              ? 'rgba(0, 0, 255, 0.2)'
              : 'rgba(255, 0, 0, 0.2)'
          }
        />
      ))}
      {currentRunCoords && currentRunCoords.length > 2 && (
        <Polygon
          coordinates={currentRunCoords}
          strokeColor="#ccc"
          fillColor="rgba(200, 255, 255, 0.4)"
        />
      )}
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
