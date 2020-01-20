export const FETCH_RUNS = 'FETCH_RUNS';
export const SAVE_RUN_REQUEST = 'SAVE_RUN_REQUEST';
export const SAVE_RUN_SUCCESS = 'SAVE_RUN_SUCCESS';
export const SAVE_RUN_FAILURE = 'SAVE_RUN_FAILURE';

import { database } from '../../services/firebase';

export const saveRun = (userId, coords, startTime) => {
  // Redux Thunk will inject dispatch here:
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
      database
        .ref('runs')
        .push(newRun)
        .then(ref => (newRun.id = ref.key));

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
