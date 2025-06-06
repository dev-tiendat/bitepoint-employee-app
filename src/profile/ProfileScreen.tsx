import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { COLORS, FONTS, icons, SIZES } from 'common';
import { ProfileStackParamList } from 'navigation/ProfileNavigator';
import BackButton from 'components/BackButton';
import FastImage from 'react-native-fast-image';
import { User } from 'types/user';
import APIManager from 'managers/APIManager';
import axios, { CancelTokenSource } from 'axios';
import Icon, { IconType } from 'components/Icon';
import TextButton from 'components/TextButton';
import AlertUtils from 'utils/AlertUtils';
import UserManager from 'managers/UserManager';
import HistoryLogin from './HistoryLogin';

const AVATAR_SIZE = 100;

type ProfileScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'Profile'
>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [data, setData] = useState<User | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const loading = useRef(true);
  const cancelTokenSource = useRef<CancelTokenSource | undefined>(undefined);

  const cancelRequest = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = undefined;
    }
  }, []);

  const resetData = useCallback(() => {
    cancelRequest();
    loading.current = false;
    setData(undefined);
    setRefreshing(true);
  }, [cancelRequest]);

  const loadData = useCallback(async () => {
    if (loading.current) return;

    loading.current = true;
    cancelTokenSource.current = axios.CancelToken.source();
    const { response, error } = await APIManager.GET<User>(
      '/api/v1/account/profile',
      undefined,
      cancelTokenSource.current,
    );

    if (axios.isCancel(error)) return;

    cancelTokenSource.current = undefined;
    loading.current = false;
    if (!response && !APIManager.isSucceed(response)) {
      return;
    }

    setData(response?.data!);
    loading.current = false;
    setRefreshing(false);
  }, []);

  const refreshData = useCallback(async () => {
    resetData();
    await loadData();
  }, [resetData, loadData]);

  useEffect(() => {
    refreshData();

    return () => {
      cancelRequest();
    };
  }, [refreshData, cancelRequest]);

  const handlePressUpdate = useCallback(() => {
    navigation.navigate('User', { data, onSubmitSuccess: refreshData });
  }, [data, navigation]);

  const handlePressLogout = () => {
    AlertUtils.showCustom({
      title: 'Đăng xuất',
      description: 'Bạn có chắc chắn muốn đăng xuất?',
      actions: [
        {
          label: 'Hủy',
          style: 'cancel',
        },
        {
          label: 'Đăng xuất',
          onPress: UserManager.signOut,
          style: 'destructive',
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <BackButton title="Hồ sơ cá nhân" />
      <View style={styles.body}>
        <View style={[styles.card, styles.profile]}>
          {data?.avatar ? (
            <FastImage
              source={{ uri: data.avatar as string }}
              style={styles.avatar}
            />
          ) : (
            <Icon
              type={IconType.ION}
              name="person-circle"
              size={AVATAR_SIZE}
              color={COLORS.netral300}
            />
          )}
          <Text style={styles.name}>
            {data?.firstName + ' ' + data?.lastName}
          </Text>
          <Text style={styles.role}>
            {data?.roles.flatMap(r => r.name).join(' • ')}
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tên tài khoản</Text>
            <Text style={styles.value}>{data?.username}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{data?.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Số điện thoại</Text>
            <Text style={styles.value}>{data?.phone}</Text>
          </View>
          <View style={styles.actions}>
            <TextButton
              label="Cập nhật thông tin"
              onPress={handlePressUpdate}
              type="secondary"
              icon={{
                type: IconType.ION,
                name: 'person',
                size: 24,
                color: COLORS.netral_black,
              }}
            />
            <TextButton
              label="Đổi mật khẩu"
              onPress={() => {}}
              type="secondary"
              icon={{
                type: IconType.ION,
                name: 'keypad',
                size: 24,
                color: COLORS.netral_black,
              }}
            />
            <TextButton
              label="Đăng xuất"
              onPress={handlePressLogout}
              type="primary"
              style={styles.logoutBtn}
              icon={{
                type: IconType.ION,
                name: 'log-out-outline',
                size: 24,
                color: COLORS.netral_white,
              }}
            />
          </View>
        </View>
        <HistoryLogin style={styles.card} />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.backgroundPrimary,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    marginTop: SIZES.padding,
    gap: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  profile: {
    width: '35%',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  name: {
    ...FONTS.title2,
    marginTop: SIZES.base,
  },
  role: {
    ...FONTS.body3,
    color: COLORS.netral600,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.padding,
  },
  label: {
    width: '40%',
    textAlign: 'left',
    ...FONTS.body3,
    color: COLORS.netral600,
  },
  value: {
    width: '60%',
    textAlign: 'right',
    ...FONTS.body3,
    color: COLORS.netral_black,
  },
  actions: {
    marginTop: SIZES.padding,
    width: '100%',
    gap: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderTopColor: COLORS.netral200,
    borderTopWidth: 1,
  },
  icon: {
    width: 24,
    height: 24,
  },
  logoutBtn: {
    backgroundColor: COLORS.danger500,
  },
});
