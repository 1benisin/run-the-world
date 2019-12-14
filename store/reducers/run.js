import {
  SAVE_CURRENT_RUN,
  FETCH_RUNS,
  START_CURRENT_RUN,
  UPDATE_CURRENT_RUN
} from '../actions/run';
import Run from '../../models/run';

const initialState = {
  currentRun: {},
  previousRuns: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CURRENT_RUN:
      let currentRun;
      // figure out if run is just starting or updating
      if (state.currentRun.coords) {
        currentRun = {
          ...state.currentRun,
          coords: [...state.currentRun.coords, action.coord]
        };
      } else {
        currentRun = new Run(Date.now(), [action.coord], Date.now(), null);
      }

      return {
        ...state,
        currentRun: currentRun
      };

    case SAVE_CURRENT_RUN:
      return {
        ...state,
        previousRuns: [...state.previousRuns, action.newRun]
      };

    default:
      return state;
  }
};
