import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';

import NavigationRouter from './navigation/NavigationRouter';
import store from './store/store';
import theme from './constants/theme';

const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationRouter />
      </PaperProvider>
    </StoreProvider>
  );
};

const styles = {
  container: {
    flex: 1
  }
};

export default App;
