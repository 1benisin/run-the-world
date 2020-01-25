// CONSTANTS

import Run from './model';
import * as PolygonService from '../../services/polygons';
import { database } from '../../services/firebase';
var geodist = require('geodist');

export const convertCoordsToPoints = coords => {
  return PolygonService.coordsToPoints(coords);
};

export const checkTooShort = runPoints => {
  return runPoints.length < Run.MIN_GEO_POINTS
    ? { error: Run.TOO_SHORT_ERROR }
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
  return { error: Run.TOO_FAR_FROM_START_ERROR };
};

export const saveRun = async newRun => {
  try {
    // Perform the Firebase API call
    const newRunRef = await database.ref('runs').push(newRun);
    newRun.id = newRunRef.key;
    return newRun;
  } catch (error) {
    //
    console.warn(error);
    return { error: Run.SAVE_FAILED_ERROR };
  }
};
