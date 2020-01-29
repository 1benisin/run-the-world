import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Polygon } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';

import * as territoryActions from '../store/territory/actions';

const CurrentRun = () => {
  const dispatch = useDispatch();

  const coordinates = useSelector(state => state.runs.coordinates);
  const isRunning = useSelector(state => state.runs.isRunning);
  const completedRun = useSelector(state => state.runs.completedRun);

  useEffect(() => {
    if (completedRun) {
      dispatch(territoryActions.fetchTerritories()).then(_ =>
        dispatch(territoryActions.createTerritory())
      );
    }
  }, [completedRun]);

  return isRunning && coordinates.length > 2 ? (
    <Polygon
      key={'Current Run'}
      coordinates={coordinates}
      strokeColor="#ccc"
      fillColor="rgb(200, 255, 255)"
    />
  ) : null;
};

StyleSheet.create({});

export default CurrentRun;
