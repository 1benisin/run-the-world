import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { auth } from '../services/firebase';

const loadingScreen = ({ navigation }) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is logged in
      navigation.navigate('RunStart');
    } else {
      // User is not logged in
      navigation.navigate('Signin');
    }
  });

  return (
    <View>
      <ActivityIndicator style={styles.indicator} size="large" color="#CCC" />
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

export default loadingScreen;
