import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import { SigninScreen, RunStartScreen, LoadingScreen } from '../screens';

const MainNavigationRouter = createStackNavigator(
  {
    Loading: LoadingScreen,
    Signin: SigninScreen,
    RunStart: RunStartScreen
  }
  // {
  //   initialRouteName: 'LoadingScreen',
  //   headerMode: 'none'
  // }
);

export default createAppContainer(MainNavigationRouter);
