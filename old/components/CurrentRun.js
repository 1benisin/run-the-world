import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Polygon, Polyline } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';

import store from '../store/store';
import * as runActions from '../store/run/actions';
import * as territoryActions from '../store/territory/actions';

const CurrentRun = () => {
  const dispatch = useDispatch();

  const coordinates = useSelector(state => state.runs.coordinates);
  const isRunning = useSelector(state => state.runs.isRunning);
  const completedRun = useSelector(state => state.runs.completedRun);

  useEffect(() => {
    if (completedRun) {
      console.log('completedRun');
      dispatch(
        territoryActions.fetchTerritories(completedRun.coords[0])
      ).then(_ => dispatch(territoryActions.createTerritory()));
    }
  }, [completedRun]);

  return isRunning && coordinates.length > 2 ? (
    <Polyline
      key={'Current Run'}
      coordinates={coordinates}
      strokeColor="red"
      strokeWidth={3}
    />
  ) : null;
};

StyleSheet.create({});

export default CurrentRun;
