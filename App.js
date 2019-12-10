import React from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import Map from './components/Map';

// A placeholder until we get our own location
const region = {
  latitude: 37.321996988,
  longitude: -122.0325472123455,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

const App = () => {
  return (
    <View style={styles.container}>
      <Map
        region={region}
        // places={this.state.coffeeShops}
      />
    </View>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '80%'
  }
};

export default App;
