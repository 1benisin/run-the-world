import React, { memo, useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { Headline, FAB } from 'react-native-paper';

import BackgroundVideo from '../components/BackgroundVideo';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import TextInput from '../components/TextInput';
import NotificationPopup from '../components/NotificationPopup';
import { emailValidator } from '../services/utils';
import theme from '../constants/theme';
import { sendEmailWithPassword } from '../services/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ value: '', type: '' });

  const _onSendPressed = async () => {
    if (loading) return;

    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    setLoading(true);

    const response = await sendEmailWithPassword(email.value);

    if (response.error) {
      setToast({ type: 'error', value: response.error });
    } else {
      setToast({
        type: 'success',
        value: 'Email with password has been sent.'
      });
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

          <View style={styles.resetContainer}>
            <Headline>Reset Password</Headline>

            <TextInput
              label="E-mail address"
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

            <FAB
              label="Send Reset Instructions"
              icon="email"
              loading={loading}
              onPress={_onSendPressed}
              style={styles.button}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <BackButton navigation={navigation} />

      <NotificationPopup
        type={toast.type}
        message={toast.value}
        onDismiss={() => setToast({ value: '', type: '' })}
      />
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
  resetContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
    // marginTop: 20
    // backgroundColor: 'purple'
  },
  button: {
    marginTop: 12
  },
  label: {
    color: theme.colors.secondary,
    width: '100%'
  }
});

export default memo(ForgotPasswordScreen);
