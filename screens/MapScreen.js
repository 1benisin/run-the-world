import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { FAB, Dialog, Portal, Button, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Polygon, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import * as polygonService from '../services/polygons';
import CurrentRun from '../components/CurrentRun';
import * as polyHelper from '../services/polygons';
import Map from '../components/Map';
import Menu from '../components/Menu';
import ErrorPopup from '../components/ErrorPopup';
import * as runActions from '../store/run/actions';
import store from '../store/store';
import noiseyRun from '../fake-data/noiseyRun';
import runKalmanOnLocations from '../services/kalman';

const MapScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const territories = useSelector(state => state.territories);
  const user = useSelector(state => state.user);
  const isRunning = useSelector(state => state.runs.isRunning);
  const error = useSelector(state => state.appError.error);
  const completedRun = useSelector(state => state.runs.completedRun);

  const _onRunButtonPress = useCallback(async () => {
    if (isRunning) {
      dispatch(runActions.saveRun());
    } else {
      dispatch(runActions.startRun());
    }
  }, [dispatch, isRunning]);

  return (
    <View style={styles.screen}>
      <Map>
        <Polygon
          coordinates={polygonService.pointsToCoords([
            [47.79554551320853, -122.33573728858224],
            [47.79554832824738, -122.33576642551813],
            [47.79555134458204, -122.33579995413525]
          ])}
          // coordinates={noiseyRun}
          strokeWidth={4}
          // strokeColor="#000"
          fillColor={'rgba(255, 255, 0, 0.2)'}
        />

        {territories.map(ter => (
          <Polygon
            key={ter.id}
            coordinates={polygonService.pointsToCoords(ter.coords)}
            // strokeWidth={0}
            // strokeColor="#000"
            fillColor={
              ter.userId === user.id
                ? 'rgba(100, 100, 255, 0.4)'
                : 'rgba(255, 20, 0, 0.2)'
            }
          />
        ))}

        <CurrentRun />
      </Map>

      <Menu navigation={navigation} />
      <FAB
        label={isRunning ? 'STOP' : 'START'}
        icon="run"
        style={styles.footerContainer}
        onPress={_onRunButtonPress}
      />
      {!!error && <ErrorPopup error={error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill
  },
  footerContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20
  }
});

export default MapScreen;
