export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

import { auth, database } from '../../services/firebase';
import theme from '../../constants/theme';

export const logInUser = authUserData => {
  return async dispatch => {
    // destructure authUserData object
    const { displayName, email, photoURL, uid } = authUserData;

    // get user info form database
    const userRef = database.ref('users/' + uid);
    const dataSnapshot = await userRef.once('value');
    let user = dataSnapshot.val();

    // if user doesn't exist create user
    if (!user) {
      user = {
        ...user,
        name: displayName,
        email,
        photoURL: photoURL
          ? photoURL
          : 'http://cdn.onlinewebfonts.com/svg/img_184513.png',
        uid,
        color: theme.colors.primary,
        totalDistance: 0,
        userName: 'Anonymous User'
      };

      userRef
        .set(user)
        .then(function() {
          console.log(`RunTheWorld: New user ${uid} added to database`);
        })
        .catch(function(error) {
          throw Error(`RunTheWorld: adding new user ${uid} to database failed`);
        });
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
