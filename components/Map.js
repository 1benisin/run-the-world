import React, { useState, useEffect, useRef } from 'react';
import {
  Dimensions,
  StyleSheet,
  Alert,
  View,
  Platform,
  Linking,
  AppState
} from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Permissions from 'expo-permissions';
import { FAB, Dialog, Portal, Button, Paragraph } from 'react-native-paper';

import * as runActions from '../store/run/actions';
import * as territoryActions from '../store/territory/actions';

const Map = props => {
  const [location, setLocation] = useState({
    latitude: 47.65,
    longitude: -122.35282
  });
  const [locationDialogVisible, setLocationDialogVisible] = useState(false);
  const map = useRef(null);
  const dispatch = useDispatch();
  const isRunning = useSelector(state => state.runs.isRunning);

  useEffect(() => {
    // registers event to handle app closed and reopened
    AppState.addEventListener('change', _handleAppStateChange);

    // get territories from DB
    dispatch(territoryActions.fetchTerritories());

    // get location
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.warn(
        'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      );
    } else {
      _getLocationAsync();
    }

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    // _animateToCurrentLocation();
  }, [location]);

  const _handleAppStateChange = async appState => {
    if (appState === 'active') {
      console.log('App has come to the foreground!');

      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        _getLocationAsync();
        return;
      } else {
        console.warn('Permission to access location was denied');
        setLocationDialogVisible(true);
        return;
      }
    }
  };

  const _getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      return;
    } else {
      console.warn('Permission to access location was denied');
      setLocationDialogVisible(true);
      return;
    }
  };

  const _openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      IntentLauncher.startActivityAsync(
        IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
      );
    }
  };

  const _simulateNewRunCoordinate = e => {
    if (isRunning) dispatch(runActions.addCoord(e.nativeEvent.coordinate));
  };

  const _animateToCurrentLocation = () => {
    if (map && map.current)
      map.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        },
        1000
      );
  };

  return (
    <View>
      <MapView
        ref={map}
        onMapReady={() => {}}
        showsUserLocation={true}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.0000001
        }}
        // onPress={_simulateNewRunCoordinate}
        showsPointsOfInterest={false}
      >
        {props.children}
      </MapView>

      <FAB
        icon="crosshairs-gps"
        style={styles.locationButton}
        onPress={_animateToCurrentLocation}
        small
      />

      <Portal>
        <Dialog visible={locationDialogVisible} dismissable={false}>
          {/* <Dialog.Title>{title}</Dialog.Title> */}
          <Dialog.Content>
            <Paragraph>
              Your location services have to be enabled to use this app.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setLocationDialogVisible(false);
                _openSettings();
              }}
            >
              Enable Location Services
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  },
  locationButton: {
    // flex: 1,
    position: 'absolute',
    right: 20,
    bottom: 20
  }
});

export default Map;

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   if (error) {
//     // Error occurred - check `error.message` for more details.
//     console.warn(error);
//     return;
//   }
//   if (data) {
//     const { latitude, longitude } = data.locations[0].coords;
//     store.dispatch(runActions.addCoord({ latitude, longitude }));
//     console.log('dispatched addCoord');
//     // do something with the locations captured in the background
//   }
// });
