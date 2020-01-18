import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = ({ style }) => (
  <Image source={require('../assets/logo.png')} style={{ ...style }} />
);

const styles = StyleSheet.create({
  image: {}
});

export default memo(Logo);
