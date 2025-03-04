import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-ui-datepicker';

import { COLORS, FONTS, icons, PROPS, SIZES } from 'common';
import { OnGenericPress, OnPressNone } from 'types/props';
import FormInput from 'components/FormInput';

import dayjs from 'dayjs';
import TextButton from 'components/TextButton';
import Icon, { IconType } from 'components/Icon';
import {
  ReserveTableInput,
  ReserveTableValidationSchema,
} from 'types/reservation';
import { date } from 'yup';

type ReserveTableModalViewProps = {
  style?: StyleProp<ViewProps>;
  onPressClose?: OnPressNone;
  onPressReserve?: OnGenericPress<ReserveTableInput>;
};

const initialValues = {
  customerName: '',
  guestCount: 1,
  reservationTime: dayjs().unix(),
} as ReserveTableInput;

const MIN_DATE = dayjs().add(-1, 'day');
const START_HOUR = 8;
const START_MINUTE = 30;
const END_HOUR = 22;
const END_MINUTE = 0;

const ReserveTableModalView: React.FC<ReserveTableModalViewProps> = ({
  style,
  onPressClose,
  onPressReserve,
}) => {
  const [openCalendar, setOpenCalendar] = useState(false);

  const handlePressClose = () => {
    onPressClose?.();
  };

  const handlePressReserve = (data: ReserveTableInput) => {
    onPressReserve?.(data);
  };

  const toggleCalendar = () => {
    setOpenCalendar(!openCalendar);
  };

  const roundUpToNearestQuarterHour = (date: Date) => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    date.setMinutes(roundedMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  const generateTimeSlots = (selectedDate: Date) => {
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const startTime = isToday
      ? roundUpToNearestQuarterHour(
          new Date(
            Math.max(
              now.getTime() + 15 * 60000,
              selectedDate.setHours(START_HOUR, START_MINUTE, 0, 0),
            ),
          ),
        )
      : new Date(selectedDate.setHours(START_HOUR, START_MINUTE, 0, 0));
    const endTime = new Date(selectedDate.setHours(END_HOUR, END_MINUTE, 0, 0));
    const timeSlots = [];

    for (
      let time = startTime;
      time <= endTime;
      time = new Date(time.getTime() + 15 * 60000)
    ) {
      timeSlots.push(new Date(time));
    }

    return timeSlots;
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

  const renderTimeSlot = (
    item: Date,
    currentTime: Date,
    onChangeDate: (date: Date) => void,
  ) => {
    const isSelected = item.getTime() === currentTime.getTime();
    const time = item.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const handleChangeDate = () => {
      onChangeDate(item);
    };

    return (
      <TouchableOpacity
        style={[styles.timeSlot, isSelected && styles.timeSlotActive]}
        onPress={handleChangeDate}>
        <Text
          style={[
            styles.timeSlotText,
            isSelected && styles.timeSlotTextActive,
          ]}>
          {time}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handlePressClose} style={styles.overlay} />
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Đặt bàn ăn</Text>
          <TouchableOpacity onPress={handlePressClose} style={styles.closeBtn}>
            <Image source={icons.close} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <Formik
          validationSchema={ReserveTableValidationSchema}
          initialValues={initialValues}
          onSubmit={handlePressReserve}>
          {({
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            isValid,
          }) => (
            <View style={styles.form}>
              <View style={styles.gird}>
                <FormInput
                  placeholder="Nguyễn Văn A"
                  label="Họ tên khách *"
                  style={styles.input}
                  value={values.customerName}
                  errorMessage={errors.customerName}
                  onChangeText={handleChange('customerName')}
                />
                <FormInput
                  placeholder="09812345678"
                  label="Số điện thoại *"
                  style={styles.input}
                  value={values.phone}
                  errorMessage={errors.phone}
                  onChangeText={handleChange('phone')}
                />
                <FormInput
                  placeholder="abc@gmail.com"
                  label="Email"
                  style={styles.input}
                  value={values.email}
                  errorMessage={errors.email}
                  onChangeText={handleChange('email')}
                />
                <FormInput
                  placeholder="1"
                  label="Số lượng khách *"
                  keyboardType="numeric"
                  style={styles.input}
                  value={values.guestCount.toString()}
                  errorMessage={errors.guestCount}
                  onChangeText={handleChange('guestCount')}
                />
              </View>
              <View>
                <FormInput
                  label="Thời gian đặt *"
                  placeholder="Chọn thời gian"
                  editable={false}
                  value={dayjs
                    .unix(values.reservationTime)
                    .format('DD/MM/YYYY')}
                  errorMessage={errors.reservationTime}
                  onChangeText={handleChange('reservationTime')}
                  appendComponent={renderCalendarIcon}
                />
                <View style={[styles.datePicker, !openCalendar && styles.none]}>
                  <DatePicker
                    mode="single"
                    selectedItemColor={COLORS.primary500}
                    minDate={MIN_DATE}
                    date={dayjs.unix(values.reservationTime)}
                    onChange={props => {
                      const date = dayjs(props.date).unix();
                      setFieldValue('reservationTime', date);
                    }}
                  />
                  <TextButton
                    style={{ backgroundColor: COLORS.warning500 }}
                    label="Chọn"
                    onPress={toggleCalendar}
                  />
                </View>
                <FlatList
                  data={generateTimeSlots(
                    dayjs.unix(values.reservationTime).toDate(),
                  )}
                  horizontal
                  renderItem={({ item }) =>
                    renderTimeSlot(
                      item,
                      dayjs.unix(values.reservationTime).toDate(),
                      (date: Date) => {
                        const dateUnix = dayjs(date).unix();
                        setFieldValue('reservationTime', dateUnix);
                      },
                    )
                  }
                />
              </View>
              <FormInput
                label="Ghi chú"
                placeholder="Yêu cầu đặc biệt"
                value={values.specialRequest}
                onChangeText={handleChange('specialRequest')}
              />
              <TextButton
                style={styles.submitBtn}
                label="Đặt bàn"
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: '#000000',
    opacity: 0.2,
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: SIZES.width / 1.5,
    padding: SIZES.padding,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...FONTS.title2,
    color: COLORS.netral_black,
  },
  closeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: COLORS.netral100,
    borderRadius: 999,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  form: {},
  gird: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  input: {
    width: '48%',
  },
  datePicker: {
    position: 'absolute',
    bottom: '80%',
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
  listTime: {
    marginTop: SIZES.base,
  },
  timeSlot: {
    paddingVertical: SIZES.base,
    paddingHorizontal: 24,
    marginRight: SIZES.radius,
    backgroundColor: COLORS.netral100,
    borderRadius: 6,
    marginBottom: SIZES.base,
  },
  timeSlotText: {
    ...FONTS.body3,
    color: COLORS.netral_black,
  },
  timeSlotActive: {
    backgroundColor: COLORS.secondary200,
  },
  timeSlotTextActive: {
    color: COLORS.primary500,
  },
  submitBtn: {
    width: 150,
    marginHorizontal: 'auto',
  },
  none: {
    display: 'none',
  },
});

export default ReserveTableModalView;
