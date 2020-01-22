import { LOGIN_USER, LOGOUT_USER } from '../actions/user';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return action.user;

    case LOGOUT_USER:
      return {};

    default:
      return state;
  }
};
