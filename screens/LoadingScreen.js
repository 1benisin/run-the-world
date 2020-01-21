import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ActivityIndicator, withTheme } from 'react-native-paper';
import { auth } from '../services/firebase';

const LoadingScreen = ({ navigation, theme }) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is logged in
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
