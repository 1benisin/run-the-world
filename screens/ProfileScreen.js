import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Subheading, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import BackButton from '../components/BackButton';

const ProfileScreen = ({ navigation, theme }) => {
  let photoURL = useSelector(state => state.user.photoURL);
  let displayName = useSelector(state => state.user.displayName);
  let color = useSelector(state => state.user.color);
  let totalDistance = useSelector(state => state.user.totalDistance);

  photoURL = photoURL
    ? { uri: photoURL }
    : {
        uri:
          'https://icons-for-free.com/iconfiles/png/512/boy+character+man+school+boy+user+icon-1320085976501561317.png'
      };

  return (
    <View style={{ ...styles.screen, backgroundColor: color }}>
      <BackButton navigation={navigation} />

      <Title>Profile</Title>

      <Avatar.Image source={photoURL} />

      <Subheading>{displayName}</Subheading>

      <Text>Color: {color}</Text>

      <Text>Total Distance Run: {totalDistance} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ProfileScreen;
