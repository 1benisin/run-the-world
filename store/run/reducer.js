import {
  SAVE_RUN_REQUEST,
  SAVE_RUN_SUCCESS,
  SAVE_RUN_FAILURE,
  RUN_START_REQUEST,
  RUN_START_SUCCESS,
  RUN_STOP_REQUEST,
  RUN_STOP_SUCCESS,
  RUN_STOP_FAILURE,
  RUN_ADD_COORD_SUCCESS
} from '../run/actions';
import Run from '../../models/run';

const initialState = {
  isRunning: false,
  coordinates: [],
  startTime: null,
  endTime: null
};

export default (state = initialState, action) => {
  //
  switch (action.type) {
    //
    case SAVE_RUN_SUCCESS:
      return state;

    case RUN_ADD_COORD_SUCCESS:
      return {
        ...state,
        coordinates: [...state.coordinates, action.coord]
      };

    // RUN_START
    case RUN_START_REQUEST:
      return state;

    case RUN_START_SUCCESS:
      return {
        ...state,
        isRunning: true,
        coordinates: [],
        startTime: action.startTime,
        endTime: null
      };

    // RUN_STOP
    case RUN_STOP_REQUEST:
      return state;

    case RUN_STOP_SUCCESS:
      return {
        ...state,
        isRunning: false,
        coordinates: [],
        startTime: null,
        endTime: null
      };

    case RUN_STOP_FAILURE:
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
