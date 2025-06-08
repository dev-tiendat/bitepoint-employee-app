import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { isEmpty } from 'lodash';

import { COLORS, FONTS, SIZES } from 'common';
import { ReservationInfo } from 'types/home';
import DateUtils from 'utils/DateUtils';

type HomeReservationsProps = {
  data?: ReservationInfo[];
  onPressViewAll?: () => void;
  style?: StyleProp<ViewStyle>;
};

const HomeReservations: React.FC<HomeReservationsProps> = ({
  data,
  onPressViewAll,
  style,
}) => {
  const handlePressViewAll = () => {
    onPressViewAll?.();
  };

  const renderItem = (item: ReservationInfo) => {
    return (
      <View key={`home-reservation-${item.reservationId}`} style={styles.item}>
        <View style={styles.column}>
          <Text style={styles.itemTitle}>#{item.reservationId}</Text>
        </View>
        <View style={[styles.column, { flex: 4 }]}>
          <Text style={styles.itemTitle}>{item.customerName}</Text>
          <Text style={styles.itemSubTitle}>{item.phone}</Text>
        </View>
        <View style={[styles.column, { flex: 2 }]}>
          <Text style={styles.itemTitle}>Giờ đặt</Text>
          <Text style={styles.itemSubTitle}>
            {DateUtils.unixToDateTime(item.reservationTime, 'hh:mm')}
          </Text>
        </View>
        <View style={[styles.column, { flex: 3 }]}>
          <Text style={styles.itemTitle}>Số khách</Text>
          <Text style={styles.itemSubTitle}>{item.guestCount} người</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.head}>
        <Text style={styles.title}>Khách hàng đặt bàn</Text>
        <TouchableOpacity onPress={handlePressViewAll}>
          <Text style={styles.viewAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.list}>
        {!isEmpty(data) ? (
          data?.map(renderItem)
        ) : (
          <Text style={styles.emptyText}>
            Không có đặt bàn nào trong ngày hôm nay.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...FONTS.title2,
    color: COLORS.netral_black,
    marginBottom: SIZES.padding,
  },
  viewAll: {
    ...FONTS.body3,
    color: COLORS.primary500,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: 16,
  },
  column: {
    flex: 1,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
  },
  itemTitle: {
    ...FONTS.subtitle3,
    color: COLORS.netral_black,
  },
  itemSubTitle: {
    ...FONTS.body4,
    color: COLORS.netral600,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    ...FONTS.body4,
    color: COLORS.netral600,
  },
});

export default HomeReservations;
