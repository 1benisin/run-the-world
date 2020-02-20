import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Headline, Text } from 'react-native-paper';

import TextInput from '../components/TextInput';
import BackgroundVideo from '../components/BackgroundVideo';
import Logo from '../components/Logo';
import NotificationPopup from '../components/NotificationPopup';
import ButtonRounded from '../components/ButtonRounded';
import { emailValidator, passwordValidator } from '../services/utils';
import { loginWithEmail, loginWithFacebook } from '../services/auth';
import theme from '../constants/theme';

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
      setEmail({ value: '', error: '' });
      setPassword({ value: '', error: '' });
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <BackgroundVideo />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Headline>Ready To</Headline>
            <Headline>Run The World?</Headline>

            <View style={styles.logoContainer}>
              <Logo />
            </View>
          </View>

          <View style={styles.content}>
            <TextInput
              label="Email"
              returnKeyType="done"
              value={email.value}
              onChangeText={text => setEmail({ value: text, error: '' })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              blurOnSubmit={true}
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
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
            >
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>

            <ButtonRounded
              style={styles.loginButton}
              loading={loading}
              onPress={_onLoginPressed}
            >
              Sign in
            </ButtonRounded>

            <Text>Or With</Text>

            <ButtonRounded
              onPress={loginWithFacebook}
              style={styles.facebookButton}
            >
              Facebook
            </ButtonRounded>
          </View>

          <View style={{ flex: 1 }} />

          <View style={styles.row}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUpScreen')}
            >
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <NotificationPopup message={error} onDismiss={() => setError('')} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '90%'
  },
  header: {
    height: '40%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  content: {
    width: '100%',
    alignItems: 'center'
  },
  logoContainer: {
    height: '70%',
    alignItems: 'center',
    width: '100%'
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    padding: 5
  },
  link: {
    color: theme.colors.accent,
    fontWeight: 'bold'
  },
  loginButton: {
    width: '80%'
  },
  facebookButton: {
    width: '80%',
    backgroundColor: theme.colors.primary,
    marginVertical: 10
  },
  screen: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%'
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10
  },
  whiteText: {
    color: 'white'
  }
});

export default LoginScreen;
