import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';

import Map from './components/Map';
import MainTabNavigator from './navigation/MainTabNavigator';

const App = () => {
  return <MainTabNavigator />;
};

const styles = {
  container: {
    flex: 1
  }
};

export default App;
