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
import MapView, { Polygon, Marker, Polyline } from 'react-native-maps';
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
          coordinates={[
            {
              accuracy: 16.002416547361754,
              altitude: 21.507646092706437,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.81037152459144,
              longitude: -122.377433260289,
              speed: 0.2637659013271332,
              timestamp: 1.5825943830002117e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.537001306706024,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.810370394014114,
              longitude: -122.37741575440707,
              speed: 0.15612049400806427,
              timestamp: 1.5825943840002075e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.596655839174325,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.81036665867007,
              longitude: -122.37740314118349,
              speed: 0.2838071882724762,
              timestamp: 1.5825943850002039e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.643488179990584,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.810370680182515,
              longitude: -122.37740480351067,
              speed: 0.2838071882724762,
              timestamp: 1.5825943860001997e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.642785431081943,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.81037901607903,
              longitude: -122.37739177155208,
              speed: 0.17891913652420044,
              timestamp: 1.5825943870001938e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.684938705080242,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.810384956644405,
              longitude: -122.37737736113274,
              speed: 0.3189775347709656,
              timestamp: 1.5825943880001902e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.73584383488829,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.810387826876884,
              longitude: -122.37736797484342,
              speed: 0.3854959309101105,
              timestamp: 1.582594389000186e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.77134587741011,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.81038665672582,
              longitude: -122.37735361200569,
              speed: 0.23561735451221466,
              timestamp: 1.5825943900001816e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.821431710696334,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.810382052729054,
              longitude: -122.37734437650947,
              speed: 0.23995888233184814,
              timestamp: 1.5825943910001777e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.856363286016,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.81038186620888,
              longitude: -122.3773459237456,
              speed: 0.23995888233184814,
              timestamp: 1.5825943920001736e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.85484339489913,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.81038056641276,
              longitude: -122.3773427330967,
              speed: 0.16734884679317474,
              timestamp: 1.5825943930001692e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.865029122128462,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.81037786644839,
              longitude: -122.37733590723323,
              speed: 0.13681013882160187,
              timestamp: 1.5825943940001653e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.88816347377443,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.81037402855295,
              longitude: -122.37731980019996,
              speed: 0.10467793047428131,
              timestamp: 1.5825943950001616e12
            },
            {
              accuracy: 16.002416547361754,
              altitude: 21.942663710968638,
              altitudeAccuracy: 3,
              heading: -1,
              latitude: 47.81037195228732,
              longitude: -122.37731991459455,
              speed: 0.21747536957263947,
              timestamp: 1.5825943960001577e12
            }
          ]}
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
