import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Order, OrderStatus } from 'types/order';
import { COLORS, FONTS, icons, PROPS, SIZES } from 'common';
import DateUtils from 'utils/DateUtils';
import PriceUtils from 'utils/PriceUtils';

type OrderItemProps = {
  style?: StyleProp<ViewStyle>;
  order: Order;
  onPress?: (id: string) => void;
};

const OrderItem: React.FC<OrderItemProps> = ({ style, order, onPress }) => {
  const handlePress = () => {
    onPress?.(order.id);
  };

  const renderStatus = () => {
    switch (order.status) {
      case OrderStatus.ORDERING:
        return (
          <View style={[styles.status, { backgroundColor: COLORS.netral100 }]}>
            <Image source={icons.timer_icon} style={styles.statusIcon} />
            <Text style={styles.statusText}>Đang gọi món</Text>
          </View>
        );
      case OrderStatus.COMPLETED:
        return (
          <View style={[styles.status, { backgroundColor: COLORS.success100 }]}>
            <Image
              source={icons.completed_icon}
              style={[styles.statusIcon, { tintColor: COLORS.success900 }]}
            />
            <Text style={[styles.statusText, { color: COLORS.success900 }]}>
              Hoàn thành
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={PROPS.touchable_active_opacity}
      style={[styles.container, style]}
      onPress={handlePress}>
      <View style={styles.row}>
        <View style={styles.info}>
          <View style={styles.table}>
            <Text style={styles.tableName}>{order.table?.name}</Text>
          </View>
          {order.reservation && (
            <View>
              <Text style={styles.customerName}>
                {order.reservation.customerName}
              </Text>
              <Text style={styles.guestCount}>
                {order.reservation.guestCount} khách
              </Text>
            </View>
          )}
        </View>
        {renderStatus()}
      </View>
      <View style={styles.row}>
        <Text style={styles.orderTime}>
          {DateUtils.unixToDateTime(order.orderTime)}
        </Text>
      </View>
      <View style={[styles.row, styles.divider]} />
      <View style={[styles.row, { alignItems: 'center' }]}>
        <Text style={styles.totalText}>Tổng tiền </Text>
        <Text style={styles.totalPrice}>
          {PriceUtils.getString(order.totalPrice)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    maxWidth: '32%',
    backgroundColor: COLORS.netral_white,
    padding: 16,
    paddingTop: 0,
    borderRadius: SIZES.radius,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 16,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  table: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginRight: SIZES.base,
    backgroundColor: COLORS.secondary100,
    borderRadius: SIZES.radius,
  },
  tableName: {
    color: COLORS.secondary500,
    ...FONTS.title3,
  },
  customerName: {
    color: COLORS.netral_black,
    ...FONTS.subtitle3,
  },
  guestCount: {
    color: COLORS.netral600,
    ...FONTS.subtitle3,
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base,
    borderRadius: SIZES.base,
  },
  statusIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.netral_black,
  },
  statusText: {
    marginLeft: SIZES.base / 2,
    ...FONTS.subtitle5,
  },
  orderTime: {
    color: COLORS.netral600,
    ...FONTS.body4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.netral200,
    marginTop: SIZES.base,
  },
  totalText: {
    color: COLORS.netral_black,
    ...FONTS.subtitle4,
  },
  totalPrice: {
    color: COLORS.netral_black,
    ...FONTS.title3,
  },
});