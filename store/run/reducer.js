import {
  SAVE_RUN_REQUEST,
  SAVE_RUN_SUCCESS,
  SAVE_RUN_FAILURE,
  RUN_START_SUCCESS,
  RUN_STOP_REQUEST,
  RUN_STOP_SUCCESS,
  RUN_ADD_COORD_SUCCESS
} from '../run/actions';
import Run from '../../models/run';

const initialState = {
  isRunning: false,
  coordinates: [],
  startTime: null,
  stopTime: null
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

    case RUN_START_SUCCESS:
      return {
        ...state,
        isRunning: action.isRunning,
        startTime: action.startTime
      };

    case RUN_STOP_REQUEST:
      return {
        ...state,
        isRunning: action.isRunning,
        stopTime: action.stopTime
      };

    case RUN_STOP_SUCCESS:
      return {
        ...state,
        isRunning: false,
        coordinates: [],
        startTime: null,
        stopTime: null
      };

    default:
      return state;
  }
};
