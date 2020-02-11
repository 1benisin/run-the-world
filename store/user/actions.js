export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const USER_SET_LOCATION = 'USER_SET_LOCATION';

import { auth, database } from '../../services/firebase';
import theme from '../../constants/theme';
import User from './model';
import * as runActions from '../run/actions';

export const logInUser = authUserData => {
  return async dispatch => {
    // destructure authUserData object
    const { displayName, email, photoURL, uid } = authUserData;

    // get user info from database
    const userRef = database.ref('users/' + uid);
    const dataSnapshot = await userRef.once('value');
    let user = dataSnapshot.val();

    if (user) {
      // if user exist in DB

      user = new User().initWithID(uid, user);
    } else {
      // if user doesn't exist in DB

      user = new User(displayName, email, photoURL, undefined);
      userRef
        .set(user)
        .then(function() {
          console.log(`RunTheWorld: New user ${uid} added to database`);
        })
        .catch(function(error) {
          throw Error(`RunTheWorld: adding new user ${uid} to database failed`);
        });
      user = new User().initWithID(uid, user);
    }

    dispatch({ type: LOGIN_USER, user });
  };
};

export const logOutUser = () => {
  return async dispatch => {
    await auth.signOut();

    dispatch({ type: LOGOUT_USER });
  };
};

export const setUsersLocation = coord => {
  // return { type: USER_SET_LOCATION, coord };
  return async (dispatch, getState) => {
    dispatch({ type: USER_SET_LOCATION, coord });

    dispatch(runActions.addCoord(coord));

    return {};
  };
};
