import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { withTheme, Checkbox } from 'react-native-paper';

import BackButton from '../components/BackButton';
import { toggleDebugState, debugState } from '../constants/debugMode';

const SettingsScreen = ({ navigation, theme }) => {
  const [checked, setChecked] = useState(debugState());

  return (
    <View style={styles.screen}>
      <BackButton navigation={navigation} />
      <Text>SettingsScreen</Text>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked(!checked);
          toggleDebugState(!checked);
        }}
        uncheckedColor={theme.colors.accent}
        color={theme.colors.accent}
        style={{ backgroundColor: 'white' }}
      />
      <Text>Debug Mode</Text>
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
