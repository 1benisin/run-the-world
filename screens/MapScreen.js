import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { FAB } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
var geodist = require('geodist');

import * as polyHelper from '../services/polygons';
import Map from '../components/Map';
import Menu from '../components/Menu';
import * as runActions from '../store/actions/run';
import * as territoryActions from '../store/actions/territory';
import { auth } from '../services/firebase';

const MapScreen = ({ navigation }) => {
  const [currentRunStartTime, setCurrentRunStartTime] = useState();
  const [currentRunCoords, setCurrentRunCoords] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startButtonTitle, setStartButtonTitle] = useState('Start');

  const dispatch = useDispatch();

  const territories = useSelector(state => state.territories);
  const user = useSelector(state => state.user);

  const stopRun = () => {
    setIsRunning(false);
    setStartButtonTitle('Start');
    setCurrentRunCoords([]);
    setCurrentRunStartTime(null);
  };

  const _onRunButtonPress = async () => {
    const maxFinishDistanceFromStart_ft = 100;

    if (isRunning) {
      let runPoints = polyHelper.coordsToPoints(currentRunCoords);

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
        runActions.saveRun(auth.currentUser.uid, runPoints, currentRunStartTime)
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
          ter.userId !== auth.currentUser.uid &&
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
        territoryActions.saveTerritory(
          auth.currentUser.uid,
          newTerCoords,
          runIds
        )
      );

      // delete older merged territories
      const terrToDelete = overlappingTerrs.map(ter => ter.id);
      dispatch(territoryActions.deleteTerritories(terrToDelete));

      // handle territory subtractions
      const subtractedTerResults = subtractTerritories(
        newTerCoords,
        territories
      );

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

  const _onDebugMapTouch = coord => {
    if (isRunning) {
      const newCoord = [...currentRunCoords, coord];
      setCurrentRunCoords(newCoord);
    }
  };

  return (
    <View style={styles.screen}>
      <Map
        onDebugMapTouch={_onDebugMapTouch}
        currentRunCoords={currentRunCoords}
      />

      <SafeAreaView style={styles.SafeAreaView}>
        <Menu style={styles.menu} navigation={navigation} />
      </SafeAreaView>

      <FAB
        label={startButtonTitle}
        icon="run"
        style={styles.footerContainer}
        onPress={_onRunButtonPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill
  },
  SafeAreaView: {
    flex: 1,
    position: 'absolute',
    right: 10,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0
  },
  footerContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20
  }
});

export default MapScreen;

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

const mergeTerritories = (runCoords, allTerritories) => {
  // find all user territories that overlap current run
  const overlappingTerrs = allTerritories.filter(
    ter =>
      ter.userId === auth.currentUser.uid &&
      polyHelper.polysOverlap(runCoords, ter.coords)
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

const subtractTerritories = (userTerCoords, allTerritories) => {
  // find all non-user territories that overlap user territory
  const overlappingTerrs = allTerritories.filter(
    ter =>
      ter.userId !== auth.currentUser.uid &&
      polyHelper.polysOverlap(ter.coords, userTerCoords)
  );
  // subtract user territory from all non-user territories
  return overlappingTerrs.map(ter => {
    const alteredRegions = polyHelper.difference(ter.coords, userTerCoords);
    return {
      oldTer: ter,
      newRegions: alteredRegions
    };
  });
};
