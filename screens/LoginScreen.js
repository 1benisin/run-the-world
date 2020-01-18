import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  Headline,
  Title,
  Button,
  Divider,
  Text,
  Subheading
} from 'react-native-paper';

import TextInput from '../components/TextInput';
import Background from '../components/Background';
import Logo from '../components/Logo';
import NotificationPopup from '../components/NotificationPopup';
import { emailValidator, passwordValidator } from '../services/utils';
import { loginWithEmail, loginWithFacebook } from '../api/auth-api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const _onLoginPressed = async () => {
    if (loading) return;

    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);

    const response = await loginWithEmail({
      email: email.value,
      password: password.value
    });

    if (response.error) {
      setError(response.error);
    } else {
      navigation.navigate('MapScreen');
    }

    setLoading(false);
  };

  return (
    <Background>
      <View style={styles.viewContainer}>
        <Headline>Are You Ready To</Headline>
        <Headline>Run The World?</Headline>
        <Logo style={styles.logo} />
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={text => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />

        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={text => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          loading={loading}
          mode="contained"
          onPress={_onLoginPressed}
          style={styles.signInButton}
        >
          Sign in
        </Button>

        <Text>Or With</Text>

        <Button mode="outlined" onPress={loginWithFacebook}>
          Facebook
        </Button>

        <View style={styles.row}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <NotificationPopup message={error} onDismiss={() => setError('')} />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%'
  },
  logo: {
    height: Dimensions.get('window').height / 5,
    resizeMode: 'contain'
  },
  signInButton: {
    borderRadius: 30,
    width: '100%'
  },
  screen: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%'
  },
  row: {
    flexDirection: 'row'
  }
});

export default LoginScreen;
