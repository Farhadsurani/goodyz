import React, { Component } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import Splash from './components/splash';
import AuthStack from './navigation/authStack';
import TabsStack from './navigation/tabsStack';

const RootNavigator = createSwitchNavigator(
  {
    Splash: Splash,
    Auth: AuthStack,
    Tabs: TabsStack
  },
  {
    initialRouteParams: 'Splash'
  }
);

const AppNavigator = createAppContainer(RootNavigator)

export default class App extends Component {
  render() {  
    return ( 
      <AppNavigator />
    );
  }
}
