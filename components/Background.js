import React, { memo, useRef, useEffect } from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';

import theme from '../constants/theme';
import backgroundVideo from '../assets/loginBackground.mp4';
import backgroundImage from '../assets/loginBackgroundCover.jpg';

const Background = ({ children }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.loadAsync(
      backgroundVideo,
      {
        shouldPlay: true,
        rate: 1.0,
        isMuted: true,
        isLooping: true
      },
      true
    );

    return () => {
      videoRef.current.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={backgroundVideo}
        style={styles.backgroundVideo}
        posterSource={backgroundImage}
        usePoster={true}
        posterStyle={{
          width: '100%',
          height: '100%'
        }}
        rate={1}
        shouldPlay
        isLooping
        volume={1}
        muted={true}
        resizeMode="cover"
      />
      {children}
      {/* <LinearGradient
      style={styles.gradient}
      colors={['#4c669f', '#3b5998', '#192f6a']}
    >
      <KeyboardAvoidingView behavior="padding">{children}</KeyboardAvoidingView>
    </LinearGradient> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gradient: {},
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

export default memo(Background);
