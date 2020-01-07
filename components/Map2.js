import React, { useState, useEffect } from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
var geodist = require('geodist');

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

const asyncAlertRunTooShort = async () =>
  new Promise(resolve => {
    Alert.alert(
      'No Conq',
      `You ran ${Math.round(
        runTotalDistance
      )} feet. You must run at least 1000 ft`,
      [
        {
          text: 'Continue Run',
          onPress: () => resolve(true),
          style: 'cancel'
        },
        { text: 'End Run', onPress: () => resolve(false) }
      ],
      { cancelable: false }
    );
  });

const asyncAlertTooFarFromStart = async distBetweenStartFinish =>
  new Promise(resolve => {
    Alert.alert(
      'Too Far From Start',
      `Your run will be saved but no territory will be conquered. You must be less than 100 feet from starting point of your run to conquer territory. ${distBetweenStartFinish} feet away.`,
      [
        {
          text: 'Continue Running',
          onPress: () => resolve(true),
          style: 'cancel'
        },
        { text: 'End Run', onPress: () => resolve(false) }
      ],
      { cancelable: false }
    );
  });

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

  const handleRunButtonPress = async () => {
    const maxFinishDistanceFromStart_ft = 100;
    const stopRun = () => {
      setIsRunning(false);
      setStartButtonTitle('Start');
      setCurrentRunCoords([]);
      setCurrentRunStartTime(null);
    };

    if (isRunning) {
      let runPoints = polyHelper.coordsToPoly(currentRunCoords);

      // check if run is too short
      if (runPoints.length < 3) {
        Alert.alert('Run too short', 'Not enough geo data points to log run', [
          { text: 'OK' }
        ]);
        stopRun();
        return;
      }

      // check if start and finish of run are close enough
      let continueRun;
      const distBetweenStartFinish = () =>
        geodist(runPoints[0], runPoints[runPoints.length - 1], {
          exact: true,
          unit: 'feet'
        });
      if (distBetweenStartFinish() > maxFinishDistanceFromStart_ft) {
        // check if they ran past start point
        // look back through half the run to see if there is a point that is close enough to start point
        // if there is slice off the tail of the run back to that point
        for (let k = runPoints.length - 1; k > runPoints.length / 2; k--) {
          const p = runPoints[k];
          const distFromStart = geodist(runPoints[0], p, {
            exact: true,
            unit: 'feet'
          });
          if (distFromStart < maxFinishDistanceFromStart_ft) {
            runPoints = runPoints.slice(0, k + 1);
            break;
          }
        }
        // if distance is still too far check if user wants to continue run
        if (distBetweenStartFinish() > maxFinishDistanceFromStart_ft) {
          if (await asyncAlertTooFarFromStart(distBetweenStartFinish())) return;
        }
      }

      // save new run
      const savedRun = await dispatch(
        runActions.saveRun('user1', runPoints, currentRunStartTime)
      );

      // untwist tangled polygon for runs that overlap themselves
      runTerritoriesCoords = polyHelper.untwistPolygon(runPoints);

      // handle territory unions
      const { newTerCoords, overlappingTerrs } = mergeTerritories(
        runTerritoriesCoords,
        territories
      );

      // check if new territory is fully contained inside non-user territroy
      const terrToCheck = territories.filter(
        ter =>
          ter.userId !== 'user1' &&
          polyHelper.polysOverlap(newTerCoords, ter.coords)
      );
      if (
        terrToCheck.length === 1 &&
        polyHelper.poly1FullyContainsPoly2(terrToCheck[0].coords, newTerCoords)
      ) {
        Alert.alert(
          'No Conquest Made',
          "You cannot conquer an area fully contained inside someone's else territory",
          [{ text: 'OK' }]
        );
        stopRun();
        return;
      }

      // save new territory
      const mergedRunIds = combineTerritoryRunIds(overlappingTerrs);

      const runIds = [...mergedRunIds, savedRun.id];
      await dispatch(
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

      stopRun();
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
            strokeWidth={3}
            strokeColor="#000"
            fillColor={
              ter.userId === 'user1'
                ? 'rgba(0, 0, 255, 0.2)'
                : 'rgba(255, 0, 0, 0.2)'
            }
          />
        ))}
        <Marker
          coordinate={{
            latitude: 47.607861110364084,
            longitude: -122.34542939811946
          }}
          title={'marker'}
          description={'description'}
        />
        {/* {testData.selfCrossing.multiCrossingMerge.map((ter, i) => (
          <Polygon
            key={i}
            coordinates={polyHelper.pointsToCoords(ter)}
            strokeColor="#ccc"
            fillColor="rgba(0, 255, 0, 0.4)"
          />
        ))} */}
        {currentRunCoords && currentRunCoords.length > 2 && (
          // <Text>more that 2 coords in currentRun</Text>
          <Polygon
            coordinates={currentRunCoords}
            strokeColor="#ccc"
            fillColor="rgba(200, 255, 255, 0.4)"
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          title={startButtonTitle}
          color="#003B00"
          accessibilityLabel="Learn more about this purple button"
          style={styles.button}
          onPress={handleRunButtonPress}
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
