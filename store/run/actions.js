export const RUNS_FETCH_REQUEST = 'RUNS_FETCH_REQUEST';
export const RUNS_FETCH_SUCCESS = 'RUNS_FETCH_SUCCESS';
export const RUNS_FETCH_FAILURE = 'RUNS_FETCH_FAILURE';

export const RUN_START_REQUEST = 'RUN_START_REQUEST';
export const RUN_START_SUCCESS = 'RUN_START_SUCCESS';
export const RUN_START_FAILURE = 'RUN_START_FAILURE';

export const RUN_SAVE_REQUEST = 'RUN_SAVE_REQUEST';
export const RUN_SAVE_SUCCESS = 'RUN_SAVE_SUCCESS';
export const RUN_SAVE_FAILURE = 'RUN_SAVE_FAILURE';

export const RUN_ADD_COORD_REQUEST = 'RUN_ADD_COORD_REQUEST';
export const RUN_ADD_COORD_SUCCESS = 'RUN_ADD_COORD_SUCCESS';
export const RUN_ADD_COORD_FAILURE = 'RUN_ADD_COORD_FAILURE';

const geolib = require('geolib');

import * as appErrorActions from '../appError/actions';
import * as RunEffects from './effects';
import { database } from '../../services/firebase';
import Run from './model';
import AppError from '../appError/model';
import runKalmanOnLocations from '../../services/kalman';
import noiseyRun from '../../fake-data/noiseyRun';

export const fetchUserRuns = () => {
  return async (dispatch, getState) => {
    dispatch({ type: RUNS_FETCH_REQUEST });

    try {
      const userId = getState().user.id;
      const userRuns = await RunEffects.fetchUserRuns(userId);

      dispatch({ type: RUNS_FETCH_SUCCESS, userRuns });
      return {};
    } catch (error) {
      dispatch({ type: RUNS_FETCH_FAILURE });
      throw error;
    }
  };
};

export const addCoord = coord => {
  return async (dispatch, getState) => {
    dispatch({ type: RUN_ADD_COORD_REQUEST });

    const isRunning = getState().runs.isRunning;

    // if at the beginninig of run throw out any coordinates that are not accurate
    // by removing any coordinates with move speeds too fast
    const coordinates = getState().runs.coordinates;
    let newCoords = [...coordinates];

    // this is to erase the first coordinate that comes through
    // when starting fetching coordinates in background. The first coord is inaccuarate
    if (newCoords.length === 2) {
      newCoords = newCoords.slice(1, newCoords.length);
      newCoords.push(coord);
    }
    newCoords.push(coord);

    if (isRunning) {
      dispatch({ type: RUN_ADD_COORD_SUCCESS, coords: newCoords });
    } else {
      dispatch({ type: RUN_ADD_COORD_FAILURE });
    }

    return {};
  };
};

export const startRun = () => {
  return async dispatch => {
    dispatch({ type: RUN_START_REQUEST });

    dispatch({
      type: RUN_START_SUCCESS,
      isRunning: true,
      startTime: Date.now()
    });
    return {};
  };
};

export const saveRun = (ignoreError = false) => {
  return async (dispatch, getState) => {
    dispatch({ type: RUN_SAVE_REQUEST });

    const endTime = Date.now();
    const userId = getState().user.id;
    let { coordinates, startTime } = getState().runs;

    // get rid of any coordinates with accuracy less than 25
    coordinates = coordinates.filter(c => c.accuracy < 25);

    // denoise run using Kalman's algorithm
    coordinates = runKalmanOnLocations(coordinates, 1000);

    coordinates = coordinates.map(coord => {
      return { latitude: coord.latitude, longitude: coord.longitude };
    });

    // Effect - convert coords to points
    let runPoints = RunEffects.convertCoordsToPoints(coordinates);

    // EFFECT - calculate run distance
    const runDistance = RunEffects.calculateRunLength(runPoints);

    // Effect - check if run is too short
    runPoints = RunEffects.checkTooShort(runPoints);
    if (runPoints instanceof AppError) {
      dispatch({ type: RUN_SAVE_FAILURE });
      dispatch(appErrorActions.createError(runPoints));
      return runPoints;
    }

    // Effect - check if start and finish of run are close enough
    let isValidTerritory = false;
    if (!ignoreError) {
      runPoints = RunEffects.checkStartFinishDistance(runPoints);
      const isError = runPoints instanceof AppError;
      if (isError) {
        dispatch(appErrorActions.createError(runPoints));
        return runPoints;
      }
      isValidTerritory = true;
    }

    // Effect - save new run
    let newRun = new Run(
      userId,
      runPoints,
      startTime,
      endTime,
      isValidTerritory,
      runDistance
    );
    newRun = await RunEffects.saveRun(newRun);
    const isError = newRun instanceof AppError;
    if (isError) {
      dispatch(appErrorActions.createError(newRun));
      return newRun;
    }

    // Reducers may handle this to show the data and reset isFetching
    dispatch({ type: RUN_SAVE_SUCCESS, newRun });
    return null;
  };
};
