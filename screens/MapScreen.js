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
      <Map />

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
