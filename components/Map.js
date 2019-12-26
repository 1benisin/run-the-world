import React, { useState, useEffect } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';

import latLngArrays from '../fake-data/fake-data';
import * as runActions from '../store/actions/run';
import * as territoryActions from '../store/actions/territory';
import * as polyHelper from '../helpers/polyHelper';

const Map = props => {
  const [currentRunStartTime, setCurrentRunStartTime] = useState();
  const [currentRunCoords, setCurrentRunCoords] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startButtonTitle, setStartButtonTitle] = useState('Start');

  const dispatch = useDispatch();

  const territoryCoordsList = useSelector(state => {
    const terrInView = state.territories.territories;
    return Object.keys(terrInView).map(key =>
      polyHelper.pointsToCoords(terrInView[key].coords)
    );
  });

  const regionChangeHandler = async region => {
    dispatch(territoryActions.fetchTerritories(region));
  };

  const simulateNewRunCoordinate = e => {
    if (isRunning) {
      const newCoord = [...currentRunCoords, e.nativeEvent.coordinate];
      setCurrentRunCoords(newCoord);
    }
  };

  const onStartButtonPressHandler = () => {
    if (isRunning) {
      setIsRunning(false);
      setStartButtonTitle('Start');
      dispatch(
        runActions.saveCurrentRun(
          'user1',
          polyHelper.coordsToPoly(currentRunCoords),
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}
        initialRegion={{
          latitude: 47.620937,
          longitude: -122.35282,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0221
        }}
        onRegionChangeComplete={regionChangeHandler}
        onPress={simulateNewRunCoordinate}
      >
        {territoryCoordsList.map((coords, key) => (
          <Polygon
            key={key}
            coordinates={coords}
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
        <Polygon
          coordinates={polyHelper.pointsToCoords([
            [47.62083620708049, -122.33744647353888],
            [47.61841198360306, -122.3413584753871],
            [47.61963350025978, -122.34389583240937],
            [47.62008999122647, -122.34373055398466],
            [47.62006980455917, -122.3448021317806],
            [47.62294055977313, -122.35076531767845],
            [47.62853458032193, -122.34092462807892]
          ])}
          strokeColor="#ccc"
          fillColor="rgba(200, 150, 255, 0.4)"
        />
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
