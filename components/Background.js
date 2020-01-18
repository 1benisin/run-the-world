import React, { memo } from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import theme from '../constants/theme';

const Background = ({ children }) => (
  <View style={styles.container}>
    {children}
    {/* <LinearGradient
      style={styles.gradient}
      colors={['#4c669f', '#3b5998', '#192f6a']}
    >
      <KeyboardAvoidingView behavior="padding">{children}</KeyboardAvoidingView>
    </LinearGradient> */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gradient: {}
});

export default memo(Background);
