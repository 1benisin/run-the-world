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
var geodist = require('geodist');

import * as polyHelper from '../services/polygons';
import Map from '../components/Map';
import Menu from '../components/Menu';
import ErrorPopup from '../components/ErrorPopup';
import * as runActions from '../store/run/actions';
import * as territoryActions from '../store/territory/actions';
import { auth } from '../services/firebase';
import Run from '../store/run/model';

const MapScreen = ({ navigation }) => {
  const [currentRunStartTime, setCurrentRunStartTime] = useState();
  const [currentRunCoords, setCurrentRunCoords] = useState([]);

  const dispatch = useDispatch();

  const territories = useSelector(state => state.territories);
  const user = useSelector(state => state.user);
  const isRunning = useSelector(state => state.runs.isRunning);
  const error = useSelector(state => state.appError.error);
  const completedRun = useSelector(state => state.runs.completedRun);

  const stopRun = () => {
    dispatch(runActions.stopRun());
    setCurrentRunCoords([]);
    setCurrentRunStartTime(null);
  };

  const _onRunButtonPress = useCallback(async () => {
    if (isRunning) {
      // end run
      dispatch(runActions.stopRun());
      return;

      // if no Run in returned it means not to create a territory
      const terrError = await dispatch(territoryActions.createTerritory());
      console.log('terrError', terrError);

      // create territory
      const newTerr = await dispatch(territoryActions.createTerritory(newRun));

      console.log('STOP button', newTerr);
      return;

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
      dispatch(runActions.startRun());
      // setCurrentRunStartTime(Date.now());
      // setIsRunning(true);
    }
  }, [dispatch, isRunning]);

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

const alert_tooFarFromStart = async distBetweenStartFinish =>
  new Promise(resolve => {
    Alert.alert(
      'Too Far From Starting Point',
      Run.TOO_FAR_FROM_START_ERROR.message,
      [
        {
          text: 'Continue Running',
          onPress: () => resolve(false),
          style: 'cancel'
        },
        { text: 'End & Save Run', onPress: () => resolve(true) }
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
