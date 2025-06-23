import React from 'react';
import {
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { FAB } from 'react-native-paper';

const BackButton = ({ style, navigation }) => {
  return (
    <SafeAreaView style={{ ...styles.container, ...style }}>
      <FAB small icon="arrow-left" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 10,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0
  }
});

export default BackButton;
