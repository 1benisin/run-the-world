export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

import { auth } from '../../services/firebase';

export const logInUser = user => {
  return async dispatch => {
    const { displayName, email, photoURL, uid } = user;
    const userData = { displayName, email, photoURL, uid };

    dispatch({ type: LOGIN_USER, userData });
  };
};

export const logOutUser = () => {
  return async dispatch => {
    await auth.signOut();

    dispatch({ type: LOGOUT_USER });
  };
};
