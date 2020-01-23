import React from 'react';
import { StyleSheet } from 'react-native';
import { Polygon } from 'react-native-maps';
import { useSelector } from 'react-redux';

const CurrentRun = () => {
  const coordinates = useSelector(state => state.runs.coordinates);
  const isRunning = useSelector(state => state.runs.isRunning);

  return isRunning && coordinates.length > 2 ? (
    <Polygon
      coordinates={coordinates}
      strokeColor="#ccc"
      fillColor="rgb(200, 255, 255)"
    />
  ) : null;
};

StyleSheet.create({});

export default CurrentRun;
