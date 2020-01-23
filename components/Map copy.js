import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Alert } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
var geodist = require('geodist');

import * as runActions from '../store/run/actions';
import * as territoryActions from '../store/territory/actions';
import * as polyHelper from '../helpers/polyHelper';

const Map = ({ navigation }) => {
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

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 47.620937,
        longitude: -122.35282,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221
      }}
      onPress={simulateNewRunCoordinate}
      showsPointsOfInterest={false}
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
  );
};

const styles = StyleSheet.create({
  map: {
    // flex: 1
    zIndex: -50,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});

export default Map;

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
