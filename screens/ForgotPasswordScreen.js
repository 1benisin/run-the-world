import React, { memo, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Headline, FAB } from 'react-native-paper';

import Background from '../components/Background';
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
    <Background>
      <BackButton navigation={navigation} />

      <Logo />

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

      <NotificationPopup
        type={toast.type}
        message={toast.value}
        onDismiss={() => setToast({ value: '', type: '' })}
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 12
  },
  label: {
    color: theme.colors.secondary,
    width: '100%'
  }
});

export default memo(ForgotPasswordScreen);
