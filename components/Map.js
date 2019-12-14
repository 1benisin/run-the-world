import React, { useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';

import latLngArrays from '../fake-data/fake-data';
import * as runActions from '../store/actions/run';

const Map = props => {
  const [currentRunStartTime, setCurrentRunStartTime] = useState();
  const [currentRunCoords, setCurrentRunCoords] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startButtonTitle, setStartButtonTitle] = useState('Start');

  // const currentRun = useSelector(state =>
  //   state.runs.currentRun ? state.runs.currentRun.coords : null
  // );
  const allRuns = useSelector(state =>
    state.runs.previousRuns.map(run => run.coords)
  );

  const dispatch = useDispatch();

  const simulateNewRunCoordinate = e => {
    if (isRunning) {
      const newCoords = [...currentRunCoords, e.nativeEvent.coordinate];
      setCurrentRunCoords(newCoords);
      // dispatch(runActions.updateCurrentRun(e.nativeEvent.coordinate));
    }
  };

  const onStartButtonPressHandler = () => {
    if (isRunning) {
      setIsRunning(false);
      setStartButtonTitle('Start');
      dispatch(
        runActions.saveCurrentRun(
          'user1',
          currentRunCoords,
          currentRunStartTime
        )
      );
      setCurrentRunCoords([]);
      setCurrentRunStartTime(null);
    } else {
      setCurrentRunStartTime(Date.now());
      setIsRunning(true);
      setStartButtonTitle('Stop');
    }
  };

  const region = {
    latitude: 47.620937,
    longitude: -122.35282,
    latitudeDelta: 0.0422,
    longitudeDelta: 0.0221
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}
        region={region}
        onPress={simulateNewRunCoordinate}
      >
        {allRuns.map((territory, key) => (
          <Polygon
            key={key}
            coordinates={territory}
            strokeColor="#ccc"
            fillColor="rgba(0, 255, 255, 0.4)"
          />
        ))}
        {currentRunCoords && currentRunCoords.length > 2 && (
          // <Text>more that 2 coords in currentRun</Text>
          <Polygon
            coordinates={currentRunCoords}
            strokeColor="#ccc"
            fillColor="rgba(200, 0, 255, 0.4)"
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          title={startButtonTitle}
          color="#003B00"
          accessibilityLabel="Learn more about this purple button"
          style={styles.button}
          onPress={onStartButtonPressHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc'
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  mapStyle: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  button: {
    width: '50%'
  },
  buttonContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10
  }
});

export default Map;
