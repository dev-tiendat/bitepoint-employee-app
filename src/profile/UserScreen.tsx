import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik, FormikProps } from 'formik';
import axios, { CancelTokenSource } from 'axios';
import dayjs from 'dayjs';
import { isNil, isString, omit } from 'lodash';
import { ImageOrVideo } from 'react-native-image-crop-picker';

import { COLORS, FONTS, SIZES } from 'common';
import APIManager from 'managers/APIManager';
import {
  User,
  UserGender,
  UserInput,
  UpdateUserValidationSchema,
} from 'types/user';
import BackButton from 'components/BackButton';
import { IconType } from 'components/Icon';
import FormInput from 'components/FormInput';
import TextButton from 'components/TextButton';
import RadioGroup, { Item } from 'components/RadioGroup';
import DatePickerFormInput from 'components/DatePickerFormInput';
import ImageCropPicker from 'components/ImageCropPicker';
import { useAppDispatch } from 'store/hooks';
import { updateProfileInfo } from 'store/user/userSlice';
import { ProfileStackParamList } from 'navigation/ProfileNavigator';
import { useToast } from 'hooks/useToast';

const AVATAR_SIZE = 150;
const CROP_SIZE = 500;

const GENDER_RADIO_PROPS: Item[] = [
  {
    label: 'Nam',
    value: UserGender.MALE,
  },
  {
    label: 'Nữ',
    value: UserGender.FEMALE,
  },
  {
    label: 'Khác',
    value: UserGender.OTHER,
  },
];

const INITIAL_VALUES: UserInput = {
  firstName: '',
  lastName: '',
  birthDate: dayjs().toDate(),
  gender: UserGender.MALE,
  email: '',
  phone: '',
  avatar: null,
};

type UserScreenProps = NativeStackScreenProps<ProfileStackParamList, 'User'>;

const UserScreen: React.FC<UserScreenProps> = ({ navigation, route }) => {
  const { data, onSubmitSuccess } = route.params;
  const formRef = useRef<FormikProps<UserInput> | null>(null);
  const [userData, setUserData] = useState<User | undefined>(data);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const loading = useRef(false);
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
    setUserData(undefined);
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
    if (!response || !APIManager.isSucceed(response)) {
      loading.current = false;
      setRefreshing(false);

      return;
    }

    setUserData(response.data);
    formRef.current?.setValues({
      ...omit(response.data!, ['roles', 'username']),
      birthDate: new Date(response.data!.birthDate),
    });
    loading.current = false;
    setRefreshing(false);
  }, []);

  const refreshData = useCallback(async () => {
    resetData();
    await loadData();
  }, [resetData, loadData]);

  useEffect(() => {
    if (!isNil(data)) {
      formRef.current?.setValues({
        ...omit(data, ['roles', 'username']),
        birthDate: new Date(data.birthDate),
      });

      return;
    }
    refreshData();

    return () => {
      cancelRequest();
    };
  }, [refreshData, cancelRequest]);

  const updateAvatar = (image: ImageOrVideo) => {
    if (!image) return;

    formRef.current?.setFieldValue('avatar', image);
  };

  const getAvatarFormData = (avatar: any) => {
    if (isString(avatar) || !avatar) return '';
    const img = avatar as ImageOrVideo;
    return {
      uri: img.path,
      type: img.mime,
      name: img.filename || 'avatar',
    };
  };

  const handlePressDiscardChanges = () => {
    formRef.current?.setValues({
      ...omit(userData, ['roles', 'username']),
      birthDate: new Date(userData?.birthDate || new Date()),
    });
  };

  const handlePressSubmit = async (values: UserInput) => {
    const data = APIManager.transformToFormData({
      ...values,
      birthDate: dayjs(values.birthDate).unix(),
      avatar: getAvatarFormData(values.avatar),
    });

    const { response, error } = await APIManager.PUT<User>(
      '/api/v1/account/update',
      data,
    );

    if (!response || !APIManager.isSucceed(response)) {
      showToast('Cập nhật thông tin không thành công', 'error');
      return;
    }

    showToast('Cập nhật thông tin thành công', 'success');
    onSubmitSuccess?.();
    dispatch(updateProfileInfo(response.data!));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Thông tin cá nhân" />
      </View>
      <View style={styles.profileContainer}>
        <Formik
          validationSchema={UpdateUserValidationSchema}
          initialValues={INITIAL_VALUES}
          innerRef={formRef}
          onSubmit={handlePressSubmit}>
          {({ handleChange, values, errors, setFieldValue }) => (
            <>
              <View style={styles.avatarContainer}>
                <ImageCropPicker
                  pickerOptions={{
                    width: CROP_SIZE,
                    height: CROP_SIZE,
                    cropping: true,
                  }}
                  addIconProps={{ type: IconType.ION, name: 'person-circle' }}
                  value={values?.avatar}
                  errorMessage={errors.avatar}
                  onPick={updateAvatar}
                  imageSize={AVATAR_SIZE}
                  canRemove={false}
                />
                <View style={styles.info}>
                  <Text style={styles.username}>{userData?.username}</Text>
                  <Text style={styles.role}>
                    Chức vụ: {userData?.roles?.flatMap(r => r.name).join(' • ')}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <FormInput
                  label="Họ"
                  placeholder="Nguyễn Văn"
                  value={values?.firstName}
                  style={styles.input}
                  errorMessage={errors.firstName}
                  onChangeText={handleChange('firstName')}
                />
                <FormInput
                  label="Tên"
                  placeholder="Anh"
                  value={values?.lastName}
                  style={styles.input}
                  errorMessage={errors.lastName}
                  onChangeText={handleChange('lastName')}
                />
              </View>
              <View style={styles.row}>
                <DatePickerFormInput
                  style={styles.input}
                  mode="date"
                  value={values?.birthDate}
                  label="Ngày sinh"
                  placeholder="Chọn thời gian"
                  onChange={date => setFieldValue('birthDate', date)}
                />
                <RadioGroup
                  label="Giới tính"
                  data={GENDER_RADIO_PROPS}
                  value={values?.gender}
                  onPress={value => setFieldValue('gender', value)}
                />
              </View>
              <View style={styles.row}>
                <FormInput
                  label="Email"
                  placeholder="abc@gmail.com"
                  style={styles.input}
                  value={values?.email}
                  errorMessage={errors.email}
                  onChangeText={handleChange('email')}
                />
                <FormInput
                  label="Số điện thoại"
                  placeholder="09812345678"
                  style={styles.input}
                  value={values?.phone}
                  errorMessage={errors.phone}
                  onChangeText={handleChange('phone')}
                />
              </View>
            </>
          )}
        </Formik>
        <View style={styles.actionBtn}>
          <TextButton
            type="secondary"
            label="Huỷ thay đổi"
            disabled={refreshing || isNil(userData)}
            onPress={handlePressDiscardChanges}
          />
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

export default UserScreen;

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
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarError: {
    borderColor: COLORS.danger400,
    borderWidth: 1,
  },
  info: {
    flex: 1,
    gap: 5,
  },
  username: {
    ...FONTS.title2,
    color: COLORS.netral_black,
  },
  role: {
    ...FONTS.subtitle3,
    color: COLORS.netral500,
  },
  row: {
    flexDirection: 'row',
    marginTop: SIZES.base,
    gap: SIZES.padding,
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
    width: '80%',
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: SIZES.padding,
    marginTop: SIZES.padding,
  },
});
