import React, { useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';

import latLngArrays from '../fake-data/fake-data';
import * as runActions from '../store/actions/run';

const Map = props => {
  const [currentRun, setCurrentRun] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startButtonTitle, setStartButtonTitle] = useState('Start');

  const currentRunFromRedux = useSelector(state => state.runs.currentRun);

  const dispatch = useDispatch();

  // setCurrentRun([
  //   { latitude: 47.623286, longitude: -122.353454 },
  //   { latitude: 47.623361, longitude: -122.351116 },
  //   { latitude: 47.624067, longitude: -122.345782 }
  // ]);

  const longMapPressHandler = e => {
    console.log(currentRunFromRedux);
    if (isRunning && currentRunFromRedux < 4) {
      setCurrentRun([...currentRun, e.nativeEvent.coordinate]);
    }
    // dispatch(runActions.startCurrentRun);
  };

  const onStartButtonPressHandler = () => {
    if (isRunning) {
      setIsRunning(false);
      setStartButtonTitle('Start');
    } else {
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
        onLongPress={longMapPressHandler}
      >
        {latLngArrays.map((territory, key) => (
          <Polygon
            key={key}
            coordinates={territory}
            strokeColor="#ccc"
            fillColor="rgba(0, 255, 255, 0.4)"
          />
        ))}
        {currentRun.length > 2 && (
          // <Text>more that 2 coords in currentRun</Text>
          <Polygon
            coordinates={currentRun}
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
