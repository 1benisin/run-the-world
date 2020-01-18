import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';

import BackButton from '../components/BackButton';

const ProfileScreen = ({ navigation, theme }) => {
  return (
    <View style={styles.screen}>
      <BackButton navigation={navigation} />
      <Text>ProfileScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple'
  }
});

export default withTheme(ProfileScreen);
