import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Avatar, Title, Subheading, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import BackButton from '../components/BackButton';
import theme from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
  let photoURL = useSelector(state => state.user.photoURL);
  let name = useSelector(state => state.user.name);
  let userName = useSelector(state => state.user.userName);
  let color = useSelector(state => state.user.color);
  let totalDistance = useSelector(state => state.user.totalDistance);

  return (
    <View style={styles.container}>
      <View style={{ ...styles.header, backgroundColor: color }}>
        <SafeAreaView style={styles.headerContent}>
          <Title>Profile</Title>

          <Avatar.Image
            source={{ uri: photoURL }}
            style={{ backgroundColor: theme.colors.background }}
          />

          <Subheading>{name}</Subheading>
        </SafeAreaView>
      </View>

      <Subheading>User Name: {userName}</Subheading>

      <Text>Color: {color}</Text>

      <Text>Total Distance Run: {totalDistance} </Text>

      <BackButton navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    width: '100%',
    height: '30%'
  },
  headerContent: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ProfileScreen;
