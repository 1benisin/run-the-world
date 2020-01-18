import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import RunStartScreen from '../screens/RunStartScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const MainNavigationRouter = createStackNavigator(
  {
    LoadingScreen,
    LoginScreen,
    SignUpScreen,
    ForgotPasswordScreen,
    RunStartScreen,
    SettingsScreen,
    ProfileScreen
  },
  {
    initialRouteName: 'LoadingScreen',
    headerMode: 'none'
  }
);

export default createAppContainer(MainNavigationRouter);
