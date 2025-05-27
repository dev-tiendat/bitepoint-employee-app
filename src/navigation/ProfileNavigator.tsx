import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from 'profile/ProfileScreen';
import UserScreen from 'profile/UserScreen';
import { User } from 'types/user';

export type ProfileStackParamList = {
  Profile: undefined;
  User: {
    data?: User;
    onSubmitSuccess?: () => void;
  };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="User" component={UserScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
