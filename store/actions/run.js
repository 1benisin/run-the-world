export const START_CURRENT_RUN = 'START_CURRENT_RUN';
export const UPDATE_CURRENT_RUN = 'UPDATE_CURRENT_RUN';
export const END_CURRENT_RUN = 'END_CURRENT_RUN';
export const FETCH_RUNS = 'FETCH_RUNS';

export const startCurrentRun = startCoord => {
  return { type: START_CURRENT_RUN, startCoord: startCoord };
};

export const updateCurrentRun = coordToAdd => {
  return { type: UPDATE_CURRENT_RUN, coord: coordToAdd };
};

export const endCurrentRun = () => {
  return { type: END_CURRENT_RUN };
};
