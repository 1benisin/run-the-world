import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Headline,
  Title,
  Button,
  Divider,
  TextInput
} from 'react-native-paper';

import { auth } from '../services/firebase';

const SigninScreen = props => {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [error, setError] = useState('');

  const onSigninHandler = () => {
    //mock login
    auth
      .createUserWithEmailAndPassword('testemail@test.com', '123456')
      .then(userObj => console.log(userObj))
      .catch(console.log);
    navigation.navigate({ routeName: 'RunStart' });
  };

  return (
    <View style={styles.screen}>
      <Headline>Are You Ready To Run The World</Headline>
      <TextInput
        label="Email Address"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      {errorText ? <Text>{errorText}</Text> : null}
      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <Button mode="contained" onPress={onSigninHandler}>
        Sign in
      </Button>
    </View>
  );
};

// SigninScreen.navigationOptions = {
//   headerTitle: 'RUN THE WORLD',
//   headerStyle: {
//     backgroundColor: Colors.primary
//   },
//   headerTintColor: 'white'
// };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SigninScreen;
