import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Video } from 'expo-av';

import backgroundVideo from '../assets/loginBackground.mp4';

const Background = () => {
  return (
    <Video
      style={styles.video}
      source={backgroundVideo}
      rate={1}
      shouldPlay
      isLooping
      volume={1}
      muted={true}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

export default memo(Background);
