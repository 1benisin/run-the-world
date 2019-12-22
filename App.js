import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { Provider } from 'react-redux';

import MainTabNavigator from './navigation/MainTabNavigator';
import store from './store/store';

import TestMap from './fake-data/TestMap';

const App = () => {
  return (
    <Provider store={store}>
      <MainTabNavigator />
    </Provider>
  );
};

const styles = {
  container: {
    flex: 1
  }
};

export default App;
