import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RawAxiosRequestHeaders } from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import UserAgent from 'react-native-user-agent';

import { ErrorCode, images } from 'common';
import { COLORS, FONTS, SIZES } from 'common/theme';
import FormInput from 'components/FormInput';
import TextButton from 'components/TextButton';
import PasswordInput from 'components/PasswordInput';
import { useToast } from 'hooks/useToast';
import APIManager from 'managers/APIManager';
import { AuthStackParamList } from 'navigation/AuthNavigator';
import { AppStackParamList } from 'navigation/AppNavigator';
import { AuthLogin } from 'types/auth';
import { useAppDispatch } from 'store/hooks';
import { updateUser } from 'store/user/userSlice';
import BackgroundSlider from './BackgroundSlider';

export type LoginScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'Login'>,
  NativeStackScreenProps<AppStackParamList>
>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [usernameOrPhone, setUsernameOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isDisableSubmit, setIsDisableSubmit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsDisableSubmit(!usernameOrPhone || !password);
  }, [usernameOrPhone, password]);

  const handlePressLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const data = {
      usernameOrPhone,
      password,
    };
    const headers: RawAxiosRequestHeaders = {
      'User-Agent': UserAgent.getUserAgent(),
    };

    const { response } = await APIManager.request<AuthLogin>(
      'POST',
      '/api/v1/auth/login',
      headers,
      undefined,
      data,
    );

    if (!APIManager.isSucceed(response)) {
      setIsLoading(false);

      let errorMessage = '';
      switch (response?.code) {
        case ErrorCode.INVALID_USERNAME_PASSWORD:
          errorMessage = 'Tài khoản hoặc mật khẩu không chính xác';
          setIsDisableSubmit(true);
          break;
        default:
          errorMessage = 'Đã có lỗi xảy ra';
          break;
      }

      showToast(errorMessage, 'error', 'Đăng nhập không thành công');
      return;
    }
    dispatch(updateUser(response!.data!));
    setIsLoading(false);

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
          <PasswordInput
            label="Mật khẩu"
            value={password}
            placeholder="Nhập mật khẩu"
            onChangeText={setPassword}
          />
          <View style={styles.serviceContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgetPassword')}>
              <Text style={[styles.forgetPasswordText]}>Quên mật khẩu ?</Text>
            </TouchableOpacity>
          </View>
          <TextButton
            style={styles.loginBtn}
            label="Đăng nhập"
            onPress={handlePressLogin}
            loading={isLoading}
            disabled={isDisableSubmit}
            type="primary"
          />
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
  },
  loginBtn: {
    marginTop: SIZES.padding,
  },
  forgetPasswordText: {
    color: COLORS.warning600,
    marginLeft: 8,
    ...FONTS.title3,
  },
});

export default LoginScreen;
