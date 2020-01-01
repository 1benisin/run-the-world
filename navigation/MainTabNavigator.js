import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import SigninScreen from '../screens/SigninScreen';
import RunStartScreen from '../screens/RunStartScreen';

const MainStackNavigator = createStackNavigator({
  RunStart: RunStartScreen,
  Signin: SigninScreen
});

export default createAppContainer(MainStackNavigator);
