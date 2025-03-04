import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ForgetPasswordScreen from 'auth/ForgetPasswordScreen';
import LoginScreen from 'auth/LoginScreen';

export type AuthStackParamList = {
  Login: undefined;
  ForgetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
