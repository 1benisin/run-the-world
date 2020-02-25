import {
  RUN_START_REQUEST,
  RUN_START_SUCCESS,
  RUN_SAVE_REQUEST,
  RUN_SAVE_SUCCESS,
  RUN_SAVE_FAILURE,
  RUN_ADD_COORD_SUCCESS,
  RUNS_FETCH_SUCCESS
} from './actions';
import {
  TERRITORY_CREATE_SUCCESS,
  TERRITORY_CREATE_FAILURE
} from '../territory/actions';
import Run from '../../models/run';

const initialState = {
  isRunning: false,
  coordinates: [],
  startTime: null,
  endTime: null,
  completedRun: null,
  userRuns: []
};

export default (state = initialState, action) => {
  //
  switch (action.type) {
    //
    case RUNS_FETCH_SUCCESS:
      return { ...state, userRuns: action.userRuns };
    //
    case TERRITORY_CREATE_SUCCESS:
      return { ...state, completedRun: null };
    //
    case TERRITORY_CREATE_FAILURE:
      return { ...state, completedRun: null };

    case RUN_ADD_COORD_SUCCESS:
      return {
        ...state,
        coordinates: [...action.coords]
      };

    // RUN_START
    case RUN_START_REQUEST:
      return {
        ...state
      };

    case RUN_START_SUCCESS:
      return {
        ...state,
        isRunning: true,
        coordinates: [],
        startTime: action.startTime,
        endTime: null,
        completedRun: null
      };

    // RUN_STOP
    case RUN_SAVE_REQUEST:
      return {
        ...state,
        completedRun: null
      };

    case RUN_SAVE_SUCCESS:
      return {
        ...state,
        isRunning: false,
        coordinates: [],
        startTime: null,
        endTime: null,
        completedRun: action.newRun
      };

    case RUN_SAVE_FAILURE:
      return {
        ...state,
        isRunning: false,
        coordinates: [],
        startTime: null,
        endTime: null
      };

    default:
      return state;
  }
};
