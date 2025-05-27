import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  createNavigationContainerRef,
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useToast } from 'hooks/useToast';
import useAuthentication from 'hooks/useAuthentication';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';
import AuthNavigator, { AuthStackParamList } from './AuthNavigator';
import ProfileNavigator, { ProfileStackParamList } from './ProfileNavigator';
import NavigationAlert, { NavigationAlertParams } from './NavigationAlert';

export type AppStackParamList = {
  AuthNavigator: NavigatorScreenParams<AuthStackParamList>;
  DrawerNavigator: NavigatorScreenParams<DrawerParamList>;
  ProfileNavigator: NavigatorScreenParams<ProfileStackParamList>;
  NavigationAlert: NavigationAlertParams;
};

export const navigationRef = createNavigationContainerRef<AppStackParamList>();

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = (): React.ReactElement => {
  const { isAuthenticated } = useAuthentication();
  const { hideAllToast } = useToast();

  useEffect(() => {
    navigationRef.addListener('state', () => {
      hideAllToast();
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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
