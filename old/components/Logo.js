import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = ({ style }) => (
  <Image
    source={require('../assets/logo.png')}
    style={{ ...styles.image, ...style }}
  />
);

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%'
  }
});

export default memo(Logo);
