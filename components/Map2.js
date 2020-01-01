import React, { useState, useEffect } from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';

import * as runActions from '../store/actions/run';
import * as territoryActions from '../store/actions/territory';
import * as polyHelper from '../helpers/polyHelper';
import * as testData from '../fake-data/fake-data';

const mergeTerritories = (runCoords, allTerritories) => {
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

const subtractTerritories = (userTerCoords, allTerritories) => {
  // find all non-user territories that overlap user territory
  const overlappingTerrs = allTerritories.filter(
    ter =>
      ter.userId !== 'user1' &&
      polyHelper.polysOverlap(ter.coords, userTerCoords)
  );
  // subtract user territory from all non-user territories
  console.log('overlapping territories', overlappingTerrs);
  return overlappingTerrs.map(ter => {
    const alteredRegions = polyHelper.difference(ter.coords, userTerCoords);
    return {
      oldTer: ter,
      newRegions: alteredRegions
    };
  });
};

const combineTerritoryRunIds = territories => {
  return territories.reduce((acc, terr) => {
    terr.runs.forEach(run => {
      if (!acc.includes(run)) {
        acc.push(run);
      }
    });
    return acc;
  }, []);
};

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
      const { newTerCoords, overlappingTerrs } = mergeTerritories(
        runCoords,
        territories
      );
      // check if new territory is fully combined inside non-user territroy
      // throw an alert
      const terrToCheck = territories.filter(
        ter =>
          ter.userId !== 'user1' &&
          polyHelper.polysOverlap(newTerCoords, ter.coords)
      );
      console.log('terrToCheck', terrToCheck);
      if (
        terrToCheck.length === 1 &&
        polyHelper.poly1FullyContainsPoly2(terrToCheck[0].coords, newTerCoords)
      ) {
        Alert.alert('Alert Title', 'My Alert Msg', [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ]);
      } else {
        // save new territory
        const mergedRunIds = combineTerritoryRunIds(overlappingTerrs);

        const runIds = [...mergedRunIds, savedRun.id];
        const savedTerr = await dispatch(
          territoryActions.saveTerritory('user1', newTerCoords, runIds)
        );
        // delete older merged territories
        const terrToDelete = overlappingTerrs.map(ter => ter.id);
        dispatch(territoryActions.deleteTerritories(terrToDelete));

        // handle territory subtractions
        const subtractedTerResults = subtractTerritories(
          newTerCoords,
          territories
        );
        console.log('subtractedTerResults', subtractedTerResults);
        for (let i = 0; i < subtractedTerResults.length; i++) {
          const result = subtractedTerResults[i];
          // create new territory for each region
          for (let j = 0; j < result.newRegions.length; j++) {
            const coords = result.newRegions[j];
            await dispatch(
              territoryActions.saveTerritory(
                result.oldTer.userId,
                coords,
                result.oldTer.runs
              )
            );
          }
        }
        // delete old territory
        await dispatch(
          territoryActions.deleteTerritories(
            subtractedTerResults.map(result => result.oldTer.id)
          )
        );
        // console.log('subtractedTerResults', subtractedTerResults);
      }
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
            fillColor={
              ter.userId === 'user1'
                ? 'rgba(255, 100, 100, 0.4)'
                : 'rgba(0, 100, 255, 0.4)'
            }
          />
        ))}
        {/* {testData.snake.difference.map(ter => (
          <Polygon
            key={ter.id}
            coordinates={polyHelper.pointsToCoords(ter)}
            strokeColor="#ccc"
            fillColor="rgba(50, 200, 100, 0.4)"
          />
        ))} */}
        {currentRunCoords && currentRunCoords.length > 2 && (
          // <Text>more that 2 coords in currentRun</Text>
          <Polygon
            coordinates={currentRunCoords}
            strokeColor="#ccc"
            fillColor="rgba(200, 140, 255, 0.4)"
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
