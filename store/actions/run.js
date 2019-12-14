export const START_CURRENT_RUN = 'START_CURRENT_RUN';
export const UPDATE_CURRENT_RUN = 'UPDATE_CURRENT_RUN';
export const SAVE_CURRENT_RUN = 'SAVE_CURRENT_RUN';
export const FETCH_RUNS = 'FETCH_RUNS';

import Run from '../../models/run';

export const startCurrentRun = startCoord => {
  return { type: START_CURRENT_RUN, startCoord: startCoord };
};

export const updateCurrentRun = coordToAdd => {
  return { type: UPDATE_CURRENT_RUN, coord: coordToAdd };
};

export const saveCurrentRun = (userId, coords, startTime) => {
  return async dispatch => {
    // create new run
    const endTime = Date.now();
    const finishedRun = {
      userId,
      coords,
      startTime,
      endTime
    };
    // do polygon math
    // update territories
    const response = await fetch(
      'https://run-the-world-v1.firebaseio.com/runs.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finishedRun)
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong with saveCurrentRun action');
    }

    const resData = await response.json();
    console.log('resData', resData);

    const newRun = new Run(resData.name, userId, coords, startTime, endTime);
    dispatch({ type: SAVE_CURRENT_RUN, newRun: newRun });
  };
};
