import {
  END_CURRENT_RUN,
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
    case START_CURRENT_RUN:
      const newRun = new Run(Date.now(), [action.startCoord], Date.now(), null);
      console.log('newRun', newRun);
      return {
        ...state,
        currentRun: newRun
      };

    case UPDATE_CURRENT_RUN:
      let currentRun;

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

    default:
      return state;
  }
};
