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

import * as polygonService from '../services/polygons';
import CurrentRun from '../components/CurrentRun';
import * as polyHelper from '../services/polygons';
import Map from '../components/Map';
import Menu from '../components/Menu';
import ErrorPopup from '../components/ErrorPopup';
import * as runActions from '../store/run/actions';
import * as territoryActions from '../store/territory/actions';
import { auth } from '../services/firebase';
import Run from '../store/run/model';

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
