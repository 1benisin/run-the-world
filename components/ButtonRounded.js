import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import theme from '../constants/theme';

const ButtonRounded = props => {
  return (
    <Button
      style={{ ...styles.button, ...props.style }}
      loading={props.loading}
      mode="contained"
      onPress={props.onPress}
    >
      {props.children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    padding: 5,
    margin: 5,
    backgroundColor: theme.colors.accent
  }
});

export default ButtonRounded;
