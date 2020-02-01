// RUN-EFFECTS

import Run from './model';
import * as PolygonService from '../../services/polygons';
import { database } from '../../services/firebase';
import { Polygon } from 'react-native-maps';
var geodist = require('geodist');

export const convertCoordsToPoints = coords => {
  return PolygonService.coordsToPoints(coords);
};

export const checkTooShort = runPoints => {
  return runPoints.length < Run.MIN_GEO_POINTS
    ? Run.TOO_SHORT_ERROR
    : runPoints;
};

export const checkStartFinishDistance = runPoints => {
  const distBetweenStartFinish = () =>
    geodist(runPoints[0], runPoints[runPoints.length - 1], {
      exact: true,
      unit: 'feet'
    });

  // -- start and finish of run are close enough
  if (distBetweenStartFinish() < Run.MAX_START_FINISH_DIST_FT) {
    return runPoints;
  }

  // -- start and finish NOT close enough
  // look back through a percentage of the run to see if there is a point that is close enough to start point
  for (
    let k = runPoints.length - 1;
    k > runPoints.length * Run.PERCENTAGE_NOT_CHECK_FOR_COMPLETION;
    k--
  ) {
    const p = runPoints[k];
    const distFromStart = geodist(runPoints[0], p, {
      exact: true,
      unit: 'feet'
    });
    // if there is a point close enough slice run back to that point
    if (distFromStart < Run.MAX_START_FINISH_DIST_FT) {
      runPoints = runPoints.slice(0, k + 1);

      return runPoints;
    }
  }

  // -- distance too far
  return Run.TOO_FAR_FROM_START_ERROR;
};

export const calculateRunLength = runPoints => {
  let runLength = 0;
  for (let i = 0; i < runPoints.length - 1; i++) {
    const a = runPoints[i];
    const b = runPoints[i + 1];
    const dist = geodist(a, b, { exact: true, unit: 'feet' });
    runLength += dist;
  }
  return Math.round(runLength);
};

export const saveRun = async newRun => {
  try {
    // Perform the Firebase API call
    const runId = Run.uuid();
    await database.ref('runs/' + runId).set(newRun);
    newRun.id = runId;
    return newRun;
  } catch (error) {
    //
    console.warn(error);
    return Run.SAVE_FAILED_ERROR;
  }
};

export const fetchUserRuns = async userId => {
  try {
    const snapshot = await database
      .ref('runs')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');
    const data = snapshot.val();

    const userRuns = Object.keys(data).map(key => {
      const run = data[key];
      return new Run().initWithID(key, run);
    });

    return userRuns;
  } catch (error) {
    console.warn(error);
    throw error;
  }
};
