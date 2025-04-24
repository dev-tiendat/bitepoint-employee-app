import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Formik, FormikProps } from 'formik';
import axios, { CancelTokenSource } from 'axios';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';
import FastImage from 'react-native-fast-image';
import DateTimePicker from 'react-native-ui-datepicker';

import { User, UserGender, UserInput, UserValidationSchema } from 'types/user';
import APIManager from 'managers/APIManager';
import { COLORS, FONTS, PROPS, SIZES } from 'common';
import BackButton from 'components/BackButton';
import Icon, { IconType } from 'components/Icon';
import FormInput from 'components/FormInput';
import TextButton from 'components/TextButton';

const AVATAR_SIZE = 80;

const ProfileScreen = () => {
  const formRef = useRef<FormikProps<UserInput> | null>(null);
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(true);
  const loading = useRef(false);
  const cancelTokenSource = useRef<CancelTokenSource | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const cancelRequest = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = undefined;
    }
  }, []);

  const resetData = useCallback(() => {
    cancelRequest();
    loading.current = false;
    setUserData(undefined);
    setRefreshing(true);
  }, [cancelRequest]);

  const loadData = useCallback(async () => {
    if (loading.current) return;

    loading.current = true;
    cancelTokenSource.current = axios.CancelToken.source();
    const { response, error } = await APIManager.GET<User>(
      '/api/v1/account/profile',
    );

    if (axios.isCancel(error)) return;

    cancelTokenSource.current = undefined;
    loading.current = false;
    if (!response || !APIManager.isSucceed(response)) {
      loading.current = false;
      setRefreshing(false);
      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra',
      });
      return;
    }
    setUserData(response.data);
    formRef.current?.setValues(response.data as any);
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

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const getUserGenderText = (gender: UserGender) => {
    switch (gender) {
      case UserGender.MALE:
        return 'Nam';
      case UserGender.FEMALE:
        return 'Nữ';
      case UserGender.OTHER:
        return 'Khác';
      default:
        return 'Không xác định';
    }
  };

  const renderCalendarIcon = () => (
    <TouchableOpacity
      activeOpacity={PROPS.touchable_active_opacity}
      onPress={toggleCalendar}>
      <Icon
        type={IconType.ION}
        name="calendar-outline"
        size={30}
        color={COLORS.netral_black}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Thông tin cá nhân" />
      </View>
      <View style={styles.profileContainer}>
        <Formik
          validationSchema={UserValidationSchema}
          initialValues={{
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            birthDate: userData?.birthDate || dayjs().unix(),
            gender: userData?.gender || UserGender.MALE,
            email: userData?.email || '',
            phone: userData?.phone || '',
            avatar: userData?.avatar,
          }}
          innerRef={formRef}
          onSubmit={() => {}}>
          {({ handleChange, handleSubmit, values, errors }) => (
            <View>
              <View style={styles.row}>
                {userData?.avatar ? (
                  <FastImage
                    source={{ uri: userData?.avatar }}
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
                <Text style={styles.username}>{userData?.username}</Text>
              </View>
              <View style={styles.row}>
                <FormInput
                  label="Họ"
                  placeholder="Nguyễn Văn"
                  value={values.firstName}
                  style={styles.input}
                  errorMessage={errors.firstName}
                  onChangeText={handleChange('firstName')}
                />
                <FormInput
                  label="Tên"
                  placeholder="Anh"
                  value={values.lastName}
                  style={styles.input}
                  errorMessage={errors.lastName}
                  onChangeText={handleChange('lastName')}
                />
              </View>
              <View style={styles.row}>
                <FormInput
                  label="Ngày sinh"
                  placeholder="Chọn thời gian"
                  editable={false}
                  style={styles.input}
                  value={dayjs.unix(values.birthDate).format('DD/MM/YYYY')}
                  errorMessage={errors.birthDate}
                  onChangeText={handleChange('birthDate')}
                  appendComponent={renderCalendarIcon}
                />
                <View
                  style={[styles.datePicker, !isCalendarOpen && styles.none]}>
                  <DateTimePicker
                    mode="single"
                    timePicker
                    selectedItemColor={COLORS.primary500}
                    date={dayjs.unix(values.birthDate!)}
                    onChange={props => {
                      const date = dayjs(props.date).unix();
                      handleChange('birthDate')(date.toString());
                    }}
                  />
                  <TextButton
                    style={{ backgroundColor: COLORS.warning500 }}
                    label="Chọn"
                    onPress={toggleCalendar}
                  />
                </View>
                <FormInput
                  label="Giới tính"
                  placeholder="Chọn giới tính"
                  style={styles.input}
                  value={getUserGenderText(values.gender)}
                  errorMessage={errors.gender}
                />
              </View>
              <View style={styles.row}>
                <FormInput
                  label="Email"
                  placeholder="abc@gmail.com"
                  style={styles.input}
                  value={values.email}
                  errorMessage={errors.email}
                  onChangeText={handleChange('email')}
                />
                <FormInput
                  label="Số điện thoại"
                  placeholder="09812345678"
                  style={styles.input}
                  value={values.phone}
                  errorMessage={errors.phone}
                  onChangeText={handleChange('phone')}
                />
              </View>
            </View>
          )}
        </Formik>
        <View style={styles.actionBtn}>
          <TextButton
            label="Cập nhật thông tin"
            disabled={refreshing}
            onPress={() => formRef.current?.handleSubmit()}
          />
        </View>
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
  header: {
    width: '100%',
  },
  profileContainer: {
    flex: 1,
    backgroundColor: COLORS.netral_white,
    marginTop: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 50,
  },
  username: {
    ...FONTS.title2,
    color: COLORS.netral_black,
  },
  input: {
    flex: 1,
  },
  datePicker: {
    position: 'absolute',
    bottom: '50%',
    right: 0,
    zIndex: 1,
    backgroundColor: COLORS.netral_white,
    width: '50%',
    padding: SIZES.radius,
    borderRadius: 15,
    shadowRadius: 20,
    shadowColor: COLORS.netral_black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
  },
  none: {
    display: 'none',
  },
  actionBtn: {
    flex: 1,
    marginTop: SIZES.padding,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
