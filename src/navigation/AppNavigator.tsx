import React from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useAuthentication from 'hooks/useAuthentication';
import { NewAPIManager } from 'managers/APIManager';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';
import AuthNavigator, { AuthStackParamList } from './AuthNavigator';
import ProfileNavigator, { ProfileStackParamList } from './ProfileNavigator';

export type AppStackParamList = {
  AuthNavigator: NavigatorScreenParams<AuthStackParamList>;
  DrawerNavigator: NavigatorScreenParams<DrawerParamList>;
  ProfileNavigator: NavigatorScreenParams<ProfileStackParamList>;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = (): React.ReactElement => {
  const { isAuthenticated } = useAuthentication();

  return (
    <NavigationContainer
      ref={navigatorRef => {
        NewAPIManager.setNavigationRef(navigatorRef);
      }}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={
          isAuthenticated ? 'DrawerNavigator' : 'AuthNavigator'
        }>
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
