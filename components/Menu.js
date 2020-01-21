import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  Paragraph,
  Menu as PaperMenu,
  Divider,
  FAB
} from 'react-native-paper';

import { logoutUser } from '../services/auth';

const Menu = ({ navigation }) => {
  const [visible, setVisible] = useState(false);

  const _openMenu = () => setVisible(true);

  const _closeMenu = () => setVisible(false);

  return (
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
          logoutUser();
        }}
        title="Logout"
        icon="logout"
      />
    </PaperMenu>
  );
};

export default Menu;
