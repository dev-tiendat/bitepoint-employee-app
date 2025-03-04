import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { COLORS, FONTS, SIZES } from 'common';
import DateUtils from 'utils/DateUtils';

type GreetingsProps = {
  name?: string;
  style?: StyleProp<ViewStyle>;
};

const Greetings: React.FC<GreetingsProps> = ({ name, style }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const greetingText = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'Chào buổi sáng';
    if (hour >= 12 && hour < 15) return 'Chào buổi trưa';
    if (hour >= 15 && hour < 18) return 'Chào buổi chiều';
    if (hour >= 18 && hour < 24) return 'Chào buổi tối';

    return 'Xin chào';
  }, [currentTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = DateUtils.formatToDate(currentTime, 'HH:mm:ss');
  const formattedDate = DateUtils.formatToDate(currentTime, 'DD/MM/YYYY');

  return (
    <View style={[styles.container, style]}>
      <View>
        <Text style={styles.greeting}>
          {greetingText}, {name}
        </Text>
        <Text style={styles.subtitle}>
          Cung cấp dịch vụ tốt nhất của bạn cho khách hàng
        </Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formattedTime}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </View>
  );
};

export default Greetings;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  greeting: {
    ...FONTS.title2,
    color: COLORS.netral_black,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.netral600,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    ...FONTS.subtitle1,
    color: COLORS.netral_black,
  },
  date: {
    ...FONTS.body4,
    color: COLORS.netral600,
  },
});
