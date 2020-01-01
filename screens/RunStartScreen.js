import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import Colors from '../constants/Colors';
import Map from '../components/Map';

const RunStartScreen = props => {
  return (
    <View style={styles.screen}>
      <Map />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

RunStartScreen.navigationOptions = {
  headerTitle: 'Run Start',
  headerStyle: {
    backgroundColor: Colors.primary
  },
  headerTintColor: 'white'
};

export default RunStartScreen;
