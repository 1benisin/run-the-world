import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { Headline, FAB } from 'react-native-paper';

import BackgroundVideo from '../components/BackgroundVideo';
import Logo from '../components/Logo';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import ButtonRounded from '../components/ButtonRounded';
import theme from '../constants/theme';
import {
  emailValidator,
  passwordValidator,
  nameValidator
} from '../services/utils';
import { signUpUser } from '../services/auth';
import NotificationPopup from '../components/NotificationPopup';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const _onSignUpPressed = async () => {
    if (loading) return;

    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);

    const response = await signUpUser({
      name: name.value,
      email: email.value,
      password: password.value
    });

    if (response.error) {
      setError(response.error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <BackgroundVideo />

      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior="height"
        // keyboardVerticalOffset={100}
        enabled
      >
        <SafeAreaView style={styles.content}>
          <View style={styles.logoContainer}>
            <Logo />
          </View>

          <View style={styles.form}>
            <Headline>Create Account</Headline>

            <TextInput
              label="User Name"
              returnKeyType="next"
              value={name.value}
              onChangeText={text => setName({ value: text, error: '' })}
              error={!!name.error}
              errorText={name.error}
            />

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

            <ButtonRounded
              loading={loading}
              onPress={_onSignUpPressed}
              style={styles.button}
            >
              Sign Up
            </ButtonRounded>
          </View>

          <View style={styles.row}>
            <Text>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <BackButton navigation={navigation} />
      <NotificationPopup message={error} onDismiss={() => setError('')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
  },

  avoidingView: {
    flex: 1,
    alignItems: 'center',
    width: '90%'
    // justifyContent: 'center'
    // backgroundColor: 'pink'
  },
  logoContainer: {
    flex: 1,
    height: '50%',
    alignItems: 'center',
    width: '100%'
    // backgroundColor: 'blue'
  },
  form: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
    // marginTop: 20
    // backgroundColor: 'purple'
  },
  button: {
    width: '80%'
  },
  row: {
    flexDirection: 'row',
    bottom: 10
  },
  link: {
    color: theme.colors.accent,
    fontWeight: 'bold'
  }
});

export default memo(RegisterScreen);
