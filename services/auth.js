// import firebase from 'firebase/app';
// import 'firebase/auth';
import { f, auth } from '../services/firebase';
import * as Facebook from 'expo-facebook';

export const logoutUser = () => {
  auth.signOut();
};

export const signUpUser = async ({ name, email, password }) => {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    auth.currentUser.updateProfile({
      displayName: name
    });

    return {};
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return {
          error: 'E-mail already in use.'
        };
      case 'auth/invalid-email':
        return {
          error: 'Invalid e-mail address format.'
        };
      case 'auth/weak-password':
        return {
          error: 'Password is too weak.'
        };
      case 'auth/too-many-requests':
        return {
          error: 'Too many request. Try again in a minute.'
        };
      default:
        return {
          error: 'Check your internet connection.'
        };
    }
  }
};

export const loginWithEmail = async ({ email, password }) => {
  try {
    return await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return {
          error: 'Invalid email address format.'
        };
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return {
          error: 'Invalid email address or password.'
        };
      case 'auth/too-many-requests':
        return {
          error: 'Too many request. Try again in a minute.'
        };
      default:
        return {
          error: 'Check your internet connection.'
        };
    }
  }
};

export const sendEmailWithPassword = async email => {
  try {
    await auth.sendPasswordResetEmail(email);
    return {};
  } catch (error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return {
          error: 'Invalid email address format.'
        };
      case 'auth/user-not-found':
        return {
          error: 'User with this email does not exist.'
        };
      case 'auth/too-many-requests':
        return {
          error: 'Too many request. Try again in a minute.'
        };
      default:
        return {
          error: 'Check your internet connection.'
        };
    }
  }
};

export const loginWithFacebook = async () => {
  try {
    const facebookUser = await Facebook.logInWithReadPermissionsAsync(
      '816660942131041',
      {
        permissions: ['email', 'public_profile']
      }
    );
    console.log(facebookUser);

    const { type, token } = facebookUser;

    if (type === 'success') {
      const credentials = f.auth.FacebookAuthProvider.credential(token);
      try {
        const signinResponse = await auth.signInWithCredential(credentials);
        console.log('signinResponse', signinResponse);
      } catch (error) {
        console.log(error);
      }
    } else {
      // type === 'cancel'
    }
  } catch ({ message }) {
    console.log(`Facebook Login Error: ${message}`);
  }
};
