import React, { useState, useEffect } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';

import * as runActions from '../store/actions/run';
import * as territoryActions from '../store/actions/territory';
import * as polyHelper from '../helpers/polyHelper';

const Map = props => {
  const [currentRunStartTime, setCurrentRunStartTime] = useState();
  const [currentRunCoords, setCurrentRunCoords] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startButtonTitle, setStartButtonTitle] = useState('Start');

  const dispatch = useDispatch();

  const territories = useSelector(state => state.territories);

  useEffect(() => {
    dispatch(territoryActions.fetchTerritories());
  }, []);

  const handleRegionChange = async region => {
    dispatch(territoryActions.fetchTerritories(region));
  };

  const simulateNewRunCoordinate = e => {
    if (isRunning) {
      const newCoord = [...currentRunCoords, e.nativeEvent.coordinate];
      setCurrentRunCoords(newCoord);
    }
  };

  const mergeTerritories = async (runCoords, allTerritories) => {
    // find all user territories that overlap current run
    const overlappingTerrs = allTerritories.filter(
      ter =>
        ter.userId === 'user1' && polyHelper.polysOverlap(runCoords, ter.coords)
    );

    // merge all overlapping territories together
    let newTerCoords = overlappingTerrs.reduce((acc, ter) => {
      return polyHelper.merge(ter.coords, acc);
    }, runCoords);

    return {
      newTerCoords,
      overlappingTerrs
    };
  };

  const handleStartButtonPress = async () => {
    if (isRunning) {
      setIsRunning(false);
      setStartButtonTitle('Start');
      const runCoords = polyHelper.coordsToPoly(currentRunCoords);
      // save new run
      const savedRun = await dispatch(
        runActions.saveRun('user1', runCoords, currentRunStartTime)
      );
      // handle territory unions
      const mergeResult = await mergeTerritories(runCoords, territories);
      // save new territory
      const mergedRunIds = mergeResult.overlappingTerrs.reduce((acc, terr) => {
        return [...acc, ...terr.runs];
      }, []);
      const runIds = [...mergedRunIds, savedRun.id];
      const savedTerr = await dispatch(
        territoryActions.saveTerritory(
          'user1',
          mergeResult.newTerCoords,
          runIds
        )
      );
      // delete older merged territories
      const terrToDelete = mergeResult.overlappingTerrs.map(ter => ter.id);
      dispatch(territoryActions.deleteTerritories(terrToDelete));
      // handle territory subtractions

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
        onPress={simulateNewRunCoordinate}
      >
        {territories.map(ter => (
          <Polygon
            key={ter.id}
            coordinates={polyHelper.pointsToCoords(ter.coords)}
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
          onPress={handleStartButtonPress}
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
