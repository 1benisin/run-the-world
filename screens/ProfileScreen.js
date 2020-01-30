import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Avatar, Title, Subheading, Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import BackButton from '../components/BackButton';
import theme from '../constants/theme';
import * as runActions from '../store/run/actions';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  let photoURL = useSelector(state => state.user.photoURL);
  let name = useSelector(state => state.user.name);
  let userName = useSelector(state => state.user.userName);
  let color = useSelector(state => state.user.color);
  let userRuns = useSelector(state => state.runs.userRuns);

  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    dispatch(runActions.fetchUserRuns());
  }, []);

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

      <View>
        <Subheading>Your Runs</Subheading>
        {userRuns.map(run => (
          <Text key={run.id}>{run.id}</Text>
        ))}
      </View>
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
