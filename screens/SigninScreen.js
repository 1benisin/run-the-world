import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import Colors from '../constants/Colors';

const SigninScreen = props => {
  const onSigninHandler = () => {
    props.navigation.navigate({ routeName: 'RunStart' });
  };

  return (
    <View style={styles.screen}>
      <Text>Signin Screen</Text>
      <Button title="Signin" onPress={onSigninHandler} />
    </View>
  );
};

SigninScreen.navigationOptions = {
  headerTitle: 'RUN THE WORLD',
  headerStyle: {
    backgroundColor: Colors.primary
  },
  headerTintColor: 'white'
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SigninScreen;
