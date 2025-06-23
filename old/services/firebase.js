import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDIQGLZtzWk-ws05gNM_fTLrRzuw1thx3c',
  authDomain: 'run-the-world-v1.firebaseapp.com',
  databaseURL: 'https://run-the-world-v1.firebaseio.com',
  projectId: 'run-the-world-v1',
  storageBucket: 'run-the-world-v1.appspot.com',
  messagingSenderId: '649089112688',
  appId: '1:649089112688:web:793c3b87950ece947c72b5',
  measurementId: 'G-NZEBQ3J0T9'
};

firebase.initializeApp(firebaseConfig);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
