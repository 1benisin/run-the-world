import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Avatar, Title, Subheading, Text, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import BackButton from '../components/BackButton';
import theme from '../constants/theme';
import * as runActions from '../store/run/actions';
import * as utils from '../services/utils';

const ProfileScreen = ({ navigation }) => {
  const [totalDistance, setTotalDistance] = useState(0);
  const [editing, setEditing] = useState(false);

  const dispatch = useDispatch();

  let photoURL = useSelector(state => state.user.photoURL);
  let name = useSelector(state => state.user.name);
  let displayName = useSelector(state => state.user.displayName);
  let color = useSelector(state => state.user.color);
  let userRuns = useSelector(state =>
    state.runs.userRuns.sort((a, b) => b.startTime - a.startTime)
  );

  useEffect(() => {
    dispatch(runActions.fetchUserRuns());
  }, []);

  useEffect(() => {
    let dist = userRuns.reduce((acc, run) => {
      return acc + run.distance;
    }, 0);
    dist = utils.feetToMiles(dist);
    setTotalDistance(dist);
  }, [userRuns]);

  return (
    <View style={styles.container}>
      <View style={{ ...styles.header, backgroundColor: color }}>
        <SafeAreaView style={styles.headerContent}>
          <Title>Profile</Title>

          <Avatar.Image
            source={{ uri: photoURL }}
            style={{ backgroundColor: theme.colors.background }}
          />

          <Subheading>{displayName}</Subheading>
        </SafeAreaView>
      </View>

      <Text>Territory Color: {color}</Text>

      <Text>Total Distance Run: {totalDistance} </Text>

      <Divider />
      <BackButton navigation={navigation} />
      <Divider />

      <ScrollView contentContainerStyle={styles.runsContainer}>
        <Subheading>Your Runs</Subheading>
        {userRuns.map(run => (
          <View style={styles.runCard} key={run.id}>
            <Text>{utils.formatDate(run.startTime)}</Text>
            <Text>{utils.feetToMiles(run.distance)} mi</Text>
          </View>
        ))}
      </ScrollView>
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
  },
  runsContainer: {
    flex: 1,
    alignItems: 'center'
  },
  runCard: {
    // backgroundColor: 'blue',
    margin: 5,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default ProfileScreen;
