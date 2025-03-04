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
import FastImage from 'react-native-fast-image';

import { COLORS, FONTS, icons, PROPS, SIZES } from 'common';
import { MenuItem, OrderItemStatus } from 'types/order';
import DateUtils from 'utils/DateUtils';
import Icon, { IconType } from 'components/Icon';
import PriceUtils from 'utils/PriceUtils';

type OrderMenuItemProps = {
  data: MenuItem;
  style?: StyleProp<ViewStyle>;
  showPrice?: boolean;
  showNotificationBadge?: boolean;
  onPressDone?: (data: MenuItem) => void;
  onPressNote?: (data: MenuItem) => void;
};

const OrderMenuItem: React.FC<OrderMenuItemProps> = ({
  data,
  style,
  showPrice = false,
  showNotificationBadge = true,
  onPressDone,
  onPressNote,
}) => {
  const handlePressDone = () => {
    onPressDone?.(data);
  };

  const handlePressNote = () => {
    onPressNote?.(data);
  };

  return (
    <View style={[styles.container, style]}>
      <FastImage
        source={{ uri: data.image }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={[styles.column, { flex: 2 }]}>
        <Text style={styles.headText}>{data.name}</Text>
        <Text style={styles.subText}>
          Đặt lúc: {DateUtils.formatToDate(data.createdAt, 'HH:mm')}
        </Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.headText}>SL</Text>
        <Text style={styles.subText}>x{data.quantity}</Text>
      </View>
      {data.tableName && (
        <View style={styles.column}>
          <Text style={styles.headText}>Bàn</Text>
          <Text style={styles.subText}>{data.tableName}</Text>
        </View>
      )}
      {showPrice && (
        <>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={styles.headText}>Giá</Text>
            <Text style={styles.subText}>
              {PriceUtils.getString(data.price)}
            </Text>
          </View>
          <View style={[styles.column, { flex: 2 }]}>
            <Text style={styles.headText}>Tổng giá</Text>
            <Text style={styles.totalPrice}>
              {PriceUtils.getString(data.price * data.quantity!)}
            </Text>
          </View>
        </>
      )}
      {data.status !== OrderItemStatus.SERVED && onPressDone && (
        <TouchableOpacity
          activeOpacity={PROPS.touchable_active_opacity}
          style={styles.doneBtn}
          onPress={handlePressDone}>
          <Icon
            type={IconType.ION}
            name="checkmark-outline"
            size={20}
            color={COLORS.success600}
          />
        </TouchableOpacity>
      )}
      {showNotificationBadge && (
        <View style={styles.notificationBadge}>
          {data.note && (
            <TouchableOpacity
              activeOpacity={PROPS.touchable_active_opacity}
              style={styles.note}
              onPress={handlePressNote}>
              <Image source={icons.note} style={styles.noteIcon} />
            </TouchableOpacity>
          )}
          {data.urged === 1 && (
            <View style={styles.urged}>
              <Icon
                type={IconType.ION}
                name="flame"
                size={16}
                color={COLORS.warning700}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default OrderMenuItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: COLORS.netral100,
    padding: SIZES.base,
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  column: {
    flex: 1,
    borderRadius: SIZES.radius,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: SIZES.radius,
    marginVertical: 'auto',
  },
  headText: {
    color: COLORS.netral_black,
    height: 50,
    ...FONTS.subtitle3,
  },
  subText: {
    color: COLORS.netral600,
    ...FONTS.body3,
  },
  totalPrice: {
    color: COLORS.netral_black,
    ...FONTS.title3,
  },
  doneBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginVertical: 'auto',
    padding: 8,
    backgroundColor: COLORS.netral_white,
    borderRadius: 5,
  },
  notificationBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    transform: [{ translateY: '-60%' }],
    flexDirection: 'row',
    gap: 5,
  },
  note: {
    backgroundColor: COLORS.secondary200,
    padding: 8,
    borderRadius: 5,
  },
  noteIcon: {
    width: 16,
    height: 16,
  },
  urged: {
    backgroundColor: COLORS.warning200,
    padding: 8,
    borderRadius: 5,
  },
});
