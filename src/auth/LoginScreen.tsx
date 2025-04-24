import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';

import { images } from 'common';
import { COLORS, FONTS, SIZES } from 'common/theme';
import FormInput from 'components/FormInput';
import TextButton from 'components/TextButton';
import { AuthStackParamList } from 'navigation/AuthNavigator';
import APIManager from 'managers/APIManager';
import { AuthLogin } from 'types/auth';
import { useAppDispatch } from 'store/hooks';
import { updateUser } from 'store/user/userSlice';
import { AppStackParamList } from 'navigation/AppNavigator';
import BackgroundSlider from './BackgroundSlider';

export type LoginScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'Login'>,
  NativeStackScreenProps<AppStackParamList>
>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  const [usernameOrPhone, setUsernameOrPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useAppDispatch();

  const handlePressLogin = async () => {
    const data = {
      usernameOrPhone,
      password,
    };
    const { response, error } = await APIManager.POST<AuthLogin>(
      '/api/v1/auth/login',
      data,
    );

    if (response && !response.data) {
      let errorMessage = '';
      switch (response!.code) {
        case 1002:
          errorMessage = 'Tài khoản hoặc mật khẩu không chính xác';
          break;
      }
      Alert.alert('Thông báo', errorMessage);

      return;
    }
    dispatch(updateUser(response!.data!));

    navigation.navigate('DrawerNavigator', { screen: 'Home', initial: true });
  };

  return (
    <View style={styles.container}>
      <BackgroundSlider style={styles.backgroundSlideContainer} />
      <View style={styles.formContainer}>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.loginText}>Đăng nhập</Text>
        <Text style={styles.welcomeText}>Chào mừng bạn đã trở lại !</Text>
        <View style={styles.form}>
          <FormInput
            label="Tên tài khoản"
            value={usernameOrPhone}
            placeholder="Tên tài khoản hoặc số điện thoại"
            onChangeText={setUsernameOrPhone}
          />
          <FormInput
            label="Mật khẩu"
            value={password}
            placeholder="Nhập mật khẩu"
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextButton
            style={styles.loginBtn}
            label="Đăng nhập"
            onPress={handlePressLogin}
          />
          <View style={styles.serviceContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgetPassword')}>
              <Text style={[styles.forgetPasswordText]}>Quên mật khẩu ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.netral_white,
  },
  backgroundSlideContainer: {
    flex: 5.5,
  },
  formContainer: {
    flex: 4.5,
    backgroundColor: COLORS.netral_white,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  topContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    marginHorizontal: 'auto',
  },
  loginText: {
    ...FONTS.heading1,
    textAlign: 'center',
  },
  welcomeText: {
    ...FONTS.subtitle3,
    color: COLORS.netral600,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: SIZES.padding,
  },
  label: {
    ...FONTS.heading3,
  },
  input: {
    height: 40,
    marginVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 10,
  },
  serviceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  loginBtn: {
    marginTop: 30,
    // width: '70%',
    // paddingVertical: 16,
  },
  forgetPasswordText: {
    color: COLORS.warning600,
    marginLeft: 8,
    ...FONTS.title3,
  },
});

export default LoginScreen;
