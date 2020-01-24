// CONSTANTS
const MAX_START_FINISH_DIST_FT = 100;
const PERCENTAGE_NOT_CHECK_FOR_COMPLETION = 0.8; // used when checking if start and finish are close enough
export const TOO_SHORT_ERROR = 'Not enough geo data points to log run';
export const TOO_FAR_FROM_START_ERROR = `You must be less than ${MAX_START_FINISH_DIST_FT} feet from starting point of your run to conquer territory`;

import * as PolygonService from '../../services/polygons';
var geodist = require('geodist');

export const convertCoordsToPoints = coords => {
  return PolygonService.coordsToPoints(coords);
};

export const checkTooShort = runPoints => {
  return runPoints.length < 4 ? { error: TOO_SHORT_ERROR } : runPoints;
};

export const checkStartFinishDistance = runPoints => {
  const distBetweenStartFinish = () =>
    geodist(runPoints[0], runPoints[runPoints.length - 1], {
      exact: true,
      unit: 'feet'
    });

  // -- start and finish of run are close enough
  if (distBetweenStartFinish() < MAX_START_FINISH_DIST_FT) {
    return runPoints;
  }

  // -- start and finish NOT close enough
  // look back through a percentage of the run to see if there is a point that is close enough to start point
  for (
    let k = runPoints.length - 1;
    k > runPoints.length / PERCENTAGE_NOT_CHECK_FOR_COMPLETION;
    k--
  ) {
    const p = runPoints[k];
    const distFromStart = geodist(runPoints[0], p, {
      exact: true,
      unit: 'feet'
    });
    // if there is a point close enough slice run back to that point
    if (distFromStart < MAX_START_FINISH_DIST_FT) {
      runPoints = runPoints.slice(0, k + 1);
      return runPoints;
    }
  }

  // -- distance too far
  return { error: TOO_FAR_FROM_START_ERROR };
};

export const saveRun = coords => {};
