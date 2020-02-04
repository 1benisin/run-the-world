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

const GET_LOCATION_IN_BACKGROUND = 'GET_LOCATION_IN_BACKGROUND';

const MapScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const territories = useSelector(state => state.territories);
  const user = useSelector(state => state.user);
  const isRunning = useSelector(state => state.runs.isRunning);
  const error = useSelector(state => state.appError.error);
  const completedRun = useSelector(state => state.runs.completedRun);

  useEffect(() => {
    Location.startLocationUpdatesAsync(GET_LOCATION_IN_BACKGROUND, {
      accuracy: Location.Accuracy.Balanced
    });

    console.log('start');

    return () => {
      Location.stopLocationUpdatesAsync(GET_LOCATION_IN_BACKGROUND);
    };
  }, []);

  const _onRunButtonPress = useCallback(async () => {
    if (isRunning) {
      dispatch(runActions.saveRun());
    } else {
      dispatch(runActions.startRun());
    }
  }, [dispatch, isRunning]);

  const _toggleLocationUpdates = async () => {
    const updatesStarted = await Location.hasStartedLocationUpdatesAsync(
      GET_LOCATION_IN_BACKGROUND
    );

    if (!isRunning && updatesStarted) {
      console.log('stop');
      Location.stopLocationUpdatesAsync(GET_LOCATION_IN_BACKGROUND);
    } else {
      if (updatesStarted) {
        console.log('start');
      }
    }
    return;
  };

  return (
    <View style={styles.screen}>
      <Map>
        <Polygon
          coordinates={polygonService.pointsToCoords([
            [47.65704464462624, -122.34229708767208],
            [47.655584373698616, -122.34098026663901],
            [47.65563305005415, -122.34266643991307],
            [47.65702841961803, -122.34080361991501],
            [47.657050052961125, -122.34229708767208]
          ])}
          // strokeWidth={0}
          // strokeColor="#000"
          // fillColor={'rgba(255, 20, 0, 0.2)'}
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

TaskManager.defineTask(GET_LOCATION_IN_BACKGROUND, ({ data, error }) => {
  console.log('location fetched');

  if (error) {
    // Error occurred - check `error.message` for more details.
    console.warn(error);
    return;
  }
  if (data && store.getState().runs.isRunning) {
    const { latitude, longitude } = data.locations[0].coords;
    console.log(latitude, longitude);
    if (latitude && longitude)
      store.dispatch(runActions.addCoord({ latitude, longitude }));
  }
});
