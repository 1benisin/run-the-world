import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import * as userActions from '../store/user/actions';
import * as territoryActions from '../store/territory/actions';
import store from '../store/store';
import { debugState } from '../constants/debugMode';
import { coordinateToRegionId } from '../services/utils';

const USER_LOCATION_IN_BACKGROUND = 'USER_LOCATION_IN_BACKGROUND';
const RUN_LOCATION_IN_BACKGROUND = 'RUN_LOCATION_IN_BACKGROUND';

const Map = props => {
  const [locationDialogVisible, setLocationDialogVisible] = useState(false);
  const [followingLocation, setFollowingLocation] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: 47.618554776633864,
    longitude: -122.35166501227786,
    latitudeDelta: 0.005,
    longitudeDelta: 0.001
  });
  const map = useRef(null);
  const dispatch = useDispatch();
  const location = useSelector(state => state.user.location);
  const isRunning = useSelector(state => state.runs.isRunning);

  useEffect(() => {
    // gets currnet location
    // then gets territores around that location
    // then moves map to current location
    _getTerritoriesAroundLocation();

    // registers event to handle app closed and reopened
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      console.log('map component unmounted');
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (debugState()) return;
    console.log('Running?', isRunning);
    if (isRunning) {
      Location.startLocationUpdatesAsync(RUN_LOCATION_IN_BACKGROUND, {
        accuracy: Location.Accuracy.High,
        showsBackgroundLocationIndicator: true
      });
    } else {
      Location.stopLocationUpdatesAsync(RUN_LOCATION_IN_BACKGROUND);
    }
  }, [isRunning]);

  _getTerritoriesAroundLocation = async () => {
    let loc;
    // get location
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.warn(
        'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      );
    } else {
      loc = await _getLocationAsync();
    }

    // get territories from DB
    dispatch(territoryActions.fetchTerritories([loc.latitude, loc.longitude]));

    // go to current location
    _animateToCurrentLocation();
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      setLocationDialogVisible(true);
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    console.log('getlocation', loc);
    dispatch(userActions.setUsersLocation(loc.coords));
    return loc.coords;
  };

  let _stopFetchingLocationAsync = async () => {
    // make sure task is registered before trying to stop it
    const taskRegistered = await TaskManager.isTaskRegisteredAsync(
      USER_LOCATION_IN_BACKGROUND
    );

    if (taskRegistered) {
      Location.stopLocationUpdatesAsync(USER_LOCATION_IN_BACKGROUND);
    }
  };

  const _startFetchingLocationAsync = async () => {
    // check for location permissions before starting location updates
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      await Location.startLocationUpdatesAsync(USER_LOCATION_IN_BACKGROUND, {
        accuracy: Location.Accuracy.Balanced
      });
      return status;
    } else {
      console.warn('Permission to access location was denied');
      setLocationDialogVisible(true);
      return;
    }
  };

  const _handleAppStateChange = async appState => {
    console.log('App State: ', appState);
    if (appState === 'active') {
      // _startFetchingLocationAsync();

      // hide or show prompt for user to grant location permissions
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        setLocationDialogVisible(false);
        return;
      } else {
        console.warn('Permission to access location was denied');
        setLocationDialogVisible(true);
        return;
      }
    }
    if (appState === 'background') {
      // _stopFetchingLocationAsync();
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
    if (isRunning)
      dispatch(
        runActions.addCoord({
          ...e.nativeEvent.coordinate,
          timestamp: Date.now(),
          accuracy: 5
        })
      );
  };

  const _animateToCurrentLocation = async () => {
    const loc = await _getLocationAsync();
    if (map && map.current) {
      map.current.animateToRegion(
        {
          latitude: loc.latitude,
          longitude: loc.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        },
        1000
      );
    }
  };

  const _updateUserLocation = c => {
    console.log('map location', c);
  };

  const _onRegionChangeComplete = r => {
    // if map has been moved to a new region fetch new territories
    const oldRegionId = coordinateToRegionId([
      mapRegion.latitude,
      mapRegion.longitude
    ]);
    const newRegionId = coordinateToRegionId([r.latitude, r.longitude]);
    if (oldRegionId !== newRegionId) {
      dispatch(territoryActions.fetchTerritories([r.latitude, r.longitude]));
      setMapRegion(r);
    }
  };

  return (
    <View>
      <MapView
        ref={map}
        onMapReady={() => {}}
        showsUserLocation={true}
        style={styles.map}
        initialRegion={mapRegion}
        showsPointsOfInterest={false}
        // followsUserLocation={followingLocation}
        // showsMyLocationButton={true}
        zoomTapEnabled={false}
        loadingEnabled={true}
        // onRegionChange={() => setFollowingLocation(false)}
        onRegionChangeComplete={_onRegionChangeComplete}
        onPress={e => debugState() && _simulateNewRunCoordinate(e)}
        // onPanDrag={() => setFollowingLocation(false)}
      >
        {props.children}
      </MapView>

      <FAB
        icon="crosshairs-gps"
        style={styles.locationButton}
        onPress={_animateToCurrentLocation}
        // onPress={() => setFollowingLocation(true)}
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

// TaskManager.defineTask(USER_LOCATION_IN_BACKGROUND, ({ data, error }) => {
//   if (error) {
//     // Error occurred - check `error.message` for more details.
//     console.warn(error);
//     return;
//   }
//   if (data) {
//     console.log(USER_LOCATION_IN_BACKGROUND, Date.now());

//     let currentLocation = {
//       latitude: data.locations[0].coords.latitude,
//       longitude: data.locations[0].coords.longitude
//     };
//     store.dispatch(userActions.setUsersLocation(currentLocation));
//   }
// });

TaskManager.defineTask(RUN_LOCATION_IN_BACKGROUND, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.warn(error);
    return;
  }
  if (data) {
    const location = {
      ...data.locations[0].coords,
      timestamp: data.locations[0].timestamp
    };

    store.dispatch(runActions.addCoord(location));
  }
});
