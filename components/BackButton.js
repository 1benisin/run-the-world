import React from 'react';
import { View, Button } from 'react-native';
import { FAB } from 'react-native-paper';

const BackButton = ({ style, navigation }) => {
  return (
    <View style={{ ...style }}>
      <FAB small icon="arrow-left" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default BackButton;
