import { LOGIN_USER, LOGOUT_USER, USER_SET_LOCATION } from '../user/actions';

const initialState = {
  location: {
    latitude: 47.65,
    longitude: -122.35282
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, ...action.user };

    case LOGOUT_USER:
      return {};

    case USER_SET_LOCATION:
      return { ...state, location: action.coord };

    default:
      return state;
  }
};
