import {
  SAVE_RUN_REQUEST,
  SAVE_RUN_SUCCESS,
  SAVE_RUN_FAILURE
} from '../actions/run';
import Run from '../../models/run';

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_RUN_SUCCESS:
      return [...state, action.newRun];

    default:
      return state;
  }
};
