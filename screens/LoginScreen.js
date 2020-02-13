import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
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
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <BackgroundVideo />

      <SafeAreaView style={styles.default}>
        <KeyboardAvoidingView style={styles.viewContainer}>
          <View style={styles.header}>
            <Headline>Ready To</Headline>
            <Headline>Run The World?</Headline>
            <Logo style={styles.logo} />
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
              <Text style={styles.clickableText}>Forgot Password?</Text>
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

          <View style={styles.row}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUpScreen')}
            >
              <Text style={styles.clickableText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <NotificationPopup message={error} onDismiss={() => setError('')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center'
  },
  default: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%'

    // backgroundColor: 'pink'
  },
  header: {
    // flex: 1,
    // backgroundColor: 'blue',
    height: '30%',
    width: '100%',
    alignItems: 'center'
    // justifyContent: 'space-around'
  },
  content: {
    width: '100%',
    alignItems: 'center'
  },
  logo: {
    height: '70%',
    // height: Dimensions.get('window').height / 5,
    resizeMode: 'contain'
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    padding: 5
  },
  clickableText: {
    color: theme.colors.accent,
    textDecorationLine: 'underline'
    // textDecorationStyle: 'solid'
  },
  loginButton: {
    width: '80%'
  },
  facebookButton: {
    width: '80%',
    backgroundColor: theme.colors.primary
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
    bottom: 10
  },
  whiteText: {
    color: 'white'
  }
});

export default LoginScreen;
