import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { FAB } from 'react-native-paper';

import Map from '../components/Map';
import Menu from '../components/Menu';

const RunStartScreen = ({ navigation }) => {
  const [startButtonTitle, setStartButtonTitle] = useState('Start');

  const _onRunButtonPress = async () => {
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
    <View style={styles.screen}>
      {/* <Map /> */}

      <SafeAreaView style={styles.mapOverlay}>
        <View style={styles.headerContainer}>
          <Menu style={styles.menu} navigation={navigation} />
        </View>

        <View style={styles.footerContainer}>
          <FAB
            label={startButtonTitle}
            icon="run"
            onPress={_onRunButtonPress}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapOverlay: {
    ...StyleSheet.absoluteFill,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
    flex: 1,
    alignItems: 'center'
  },
  headerContainer: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'flex-end'
  },
  footerContainer: {
    position: 'absolute',
    bottom: 20,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

export default RunStartScreen;
