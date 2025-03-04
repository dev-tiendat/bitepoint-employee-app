import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from 'profile/ProfileScreen';

export type ProfileStackParamList = {
  Profile: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
