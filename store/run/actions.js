export const FETCH_RUNS = 'FETCH_RUNS';

export const SAVE_RUN_REQUEST = 'SAVE_RUN_REQUEST';
export const SAVE_RUN_SUCCESS = 'SAVE_RUN_SUCCESS';
export const SAVE_RUN_FAILURE = 'SAVE_RUN_FAILURE';

export const RUN_START_REQUEST = 'RUN_START_REQUEST';
export const RUN_START_SUCCESS = 'RUN_START_SUCCESS';
export const RUN_START_FAILURE = 'RUN_START_FAILURE';

export const RUN_STOP_REQUEST = 'RUN_STOP_REQUEST';
export const RUN_STOP_SUCCESS = 'RUN_STOP_SUCCESS';
export const RUN_STOP_FAILURE = 'RUN_STOP_FAILURE';

export const RUN_ADD_COORD_REQUEST = 'RUN_ADD_COORD_REQUEST';
export const RUN_ADD_COORD_SUCCESS = 'RUN_ADD_COORD_SUCCESS';
export const RUN_ADD_COORD_FAILURE = 'RUN_ADD_COORD_FAILURE';

import * as RunEffects from './effects';
import { database } from '../../services/firebase';

export const addCoord = coord => {
  return async dispatch => {
    dispatch({ type: RUN_ADD_COORD_REQUEST });

    dispatch({ type: RUN_ADD_COORD_SUCCESS, coord });
    return {};
  };
};

export const startRun = () => {
  return async dispatch => {
    dispatch({ type: RUN_START_REQUEST });

    dispatch({ type: RUN_START_SUCCESS, isRunning: true, startTime: Date() });
    return {};
  };
};

export const stopRun = (ignoreErrors = []) => {
  return async (dispatch, getState) => {
    dispatch({ type: RUN_STOP_REQUEST });

    const stopTime = Date();

    // Effect - convert coords to points
    const coords = getState().runs.coordinates;
    let runPoints = RunEffects.convertCoordsToPoints(coords);

    // Effect - check if run is too short
    runPoints = RunEffects.checkTooShort(runPoints);
    if (runPoints.error) return { error: runPoints.error };

    // Effect - check if start and finish of run are close enough
    runPoints = RunEffects.checkStartFinishDistance(runPoints);
    if (runPoints.error) return { error: runPoints.error };
    return runPoints;

    // Effect - save new run
    //TODO
    dispatch({ type: RUN_STOP_SUCCESS, isRunning: false, stopTime });
    return {};
  };
};

export const saveRun = (userId, coords, startTime) => {
  //
  return async dispatch => {
    // Reducers may handle this to set a flag like isFetching
    dispatch({ type: SAVE_RUN_REQUEST });

    try {
      const newRun = {
        userId,
        coords,
        startTime,
        endTime: Date.now()
      };
      // Perform the Firebase API call
      const newRunRef = await database.ref('runs').push(newRun);
      newRun.id = newRunRef.key;

      // Reducers may handle this to show the data and reset isFetching
      dispatch({ type: SAVE_RUN_SUCCESS, newRun });
      return newRun;
    } catch (error) {
      // Reducers may handle this to reset isFetching
      dispatch({ type: SAVE_RUN_FAILURE, error });
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
};
