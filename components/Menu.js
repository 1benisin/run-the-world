import React, { useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { Menu as PaperMenu, Divider, FAB } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import * as userActions from '../store/actions/user';

const Menu = ({ navigation }) => {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const _openMenu = () => setVisible(true);

  const _closeMenu = () => setVisible(false);

  const _onLogoutUser = () => {
    dispatch(userActions.logOutUser());
  };

  return (
    <SafeAreaView style={styles.container}>
      <PaperMenu
        visible={visible}
        onDismiss={_closeMenu}
        anchor={
          <FAB icon="menu" onPress={_openMenu}>
            Show Menu
          </FAB>
        }
      >
        <PaperMenu.Item
          onPress={() => {
            _closeMenu();
            navigation.navigate('ProfileScreen');
          }}
          title="Profile"
          icon="account-circle"
        />
        <PaperMenu.Item
          onPress={() => {
            _closeMenu();
            navigation.navigate('SettingsScreen');
          }}
          title="Settings"
          icon="settings"
        />
        <Divider />
        <PaperMenu.Item
          onPress={() => {
            _closeMenu();
            _onLogoutUser();
          }}
          title="Logout"
          icon="logout"
        />
      </PaperMenu>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    right: 10,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0
  }
});

export default Menu;
