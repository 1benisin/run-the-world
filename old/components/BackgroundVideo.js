import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';

import backgroundVideo from '../assets/loginBackground.mp4';

const Background = () => {
  return (
    <View style={styles.container}>
      <Video
        style={styles.video}
        source={backgroundVideo}
        rate={1}
        shouldPlay
        isLooping
        volume={1}
        muted={true}
        // resizeMode="cover"
        resizeMode={Video.RESIZE_MODE_COVER}
        useTextureView={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0

    // width: 300,
    // height: 100
  },
  video: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0
    width: '100%',
    height: '100%'
  }
});

export default memo(Background);
