export const FETCH_RUNS = 'FETCH_RUNS';
export const SAVE_RUN_REQUEST = 'SAVE_RUN_REQUEST';
export const SAVE_RUN_SUCCESS = 'SAVE_RUN_SUCCESS';
export const SAVE_RUN_FAILURE = 'SAVE_RUN_FAILURE';

export const saveRun = (userId, coords, startTime) => {
  // Redux Thunk will inject dispatch here:
  return async dispatch => {
    // Reducers may handle this to set a flag like isFetching
    dispatch({ type: SAVE_RUN_REQUEST });

    try {
      // Perform the actual API call
      const newRun = {
        userId,
        coords,
        startTime,
        endTime: Date.now()
      };
      const response = await fetch(
        'https://run-the-world-v1.firebaseio.com/runs.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newRun)
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong with saveRun action');
      }

      const resData = await response.json();
      newRun.id = resData.name;
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
