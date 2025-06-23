import { CREATE_ERROR, CLEAR_ERROR } from './actions';

const initialState = {
  error: null
};

export default (state = initialState, action) => {
  //
  switch (action.type) {
    //
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case CREATE_ERROR:
      return {
        ...state,
        error: action.error
      };

    default:
      return state;
  }
};
