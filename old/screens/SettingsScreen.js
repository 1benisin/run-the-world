import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { withTheme, Checkbox, Switch } from 'react-native-paper';
import { useSelector } from 'react-redux';

import BackButton from '../components/BackButton';
import { toggleDebugState, debugState } from '../constants/debugMode';
import theme from '../constants/theme';

const SettingsScreen = ({ navigation, theme }) => {
  const [checked, setChecked] = useState(debugState());
  const userEmail = useSelector(state => state.user.email);

  // if user is a Dev display debugToggle
  let showDebugToggle = false;
  if (
    userEmail === 'user1@test.com' ||
    userEmail === 'user2@test.com' ||
    userEmail === 'user3@test.com' ||
    userEmail === 'benisin@gmail.com'
  )
    showDebugToggle = true;

  return (
    <View style={styles.screen}>
      <BackButton navigation={navigation} />
      <Text>SettingsScreen</Text>
      {showDebugToggle && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Switch
            value={checked}
            onValueChange={() => {
              setChecked(!checked);
              toggleDebugState(!checked);
            }}
            color={'green'}
          />
          <Text> Debug Mode</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface
  }
});

export default withTheme(SettingsScreen);
