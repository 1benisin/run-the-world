import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import { ActivityIndicator, withTheme } from 'react-native-paper';
import { auth } from '../services/firebase';
import * as userActions from '../store/actions/user';

const LoadingScreen = ({ navigation, theme }) => {
  const dispatch = useDispatch();

  auth.onAuthStateChanged(user => {
    if (user) {
      // User is logged in
      dispatch(userActions.logInUser(user));
      navigation.navigate('MapScreen');
    } else {
      // User is not logged in
      navigation.navigate('LoginScreen');
    }
  });

  return (
    <View style={styles.indicator}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default withTheme(LoadingScreen);
