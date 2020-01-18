import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';

import BackButton from '../components/BackButton';

const SettingsScreen = ({ navigation, theme }) => {
  return (
    <View style={styles.screen}>
      <BackButton navigation={navigation} />
      <Text>SettingsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green'
  }
});

export default withTheme(SettingsScreen);
