import React from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useAuthentication from 'hooks/useAuthentication';
import APIManager from 'managers/APIManager';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';
import AuthNavigator, { AuthStackParamList } from './AuthNavigator';
import ProfileNavigator, { ProfileStackParamList } from './ProfileNavigator';
import { Platform } from 'react-native';
import NavigationAlert, { NavigationAlertParams } from './NavigationAlert';

export type AppStackParamList = {
  AuthNavigator: NavigatorScreenParams<AuthStackParamList>;
  DrawerNavigator: NavigatorScreenParams<DrawerParamList>;
  ProfileNavigator: NavigatorScreenParams<ProfileStackParamList>;
  NavigationAlert: NavigationAlertParams;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = (): React.ReactElement => {
  const { isAuthenticated } = useAuthentication();

  return (
    <NavigationContainer
      ref={navigatorRef => {
        APIManager.setNavigationRef(navigatorRef);
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarHidden: Platform.OS === 'android',
        }}
        initialRouteName={
          isAuthenticated ? 'DrawerNavigator' : 'AuthNavigator'
        }>
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} />
        <Stack.Group
          screenOptions={{
            presentation: 'transparentModal',
            animation: 'fade',
          }}>
          <Stack.Screen name="NavigationAlert" component={NavigationAlert} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
