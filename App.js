import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';

import NavigationRouter from './navigation/NavigationRouter';
import store from './store/store';

import TestMap from './fake-data/TestMap';

const App = () => {
  return (
    <ReduxProvider store={store}>
      <NavigationRouter />
    </ReduxProvider>
  );
};

const styles = {
  container: {
    flex: 1
  }
};

export default App;
