import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { isEmpty } from 'lodash';

import { PopularMenuItem } from 'types/home';
import { COLORS, FONTS, SIZES } from 'common';

type PopularDishesProps = {
  data?: PopularMenuItem[];
  style?: StyleProp<ViewStyle>;
};

const PopularDishes: React.FC<PopularDishesProps> = ({ data, style }) => {
  const renderItem = (item: PopularMenuItem, index: number) => {
    return (
      <View key={`popular-dish-item-${index}`} style={styles.item}>
        <Text style={styles.indexText}>{index + 1}</Text>
        <FastImage
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.quantityText}>
            Đã bán : <Text style={styles.quantity}>{item.quantity}</Text>
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Món ăn phổ biến</Text>
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.list}>
        {!isEmpty(data) ? (
          data?.map(renderItem)
        ) : (
          <Text style={styles.emptyText}>
            Không có món ăn nào được bán ngày hôm nay.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default PopularDishes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
  },
  title: {
    ...FONTS.title2,
    color: COLORS.netral_black,
    marginBottom: SIZES.padding,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: 16,
  },
  indexText: {
    ...FONTS.subtitle3,
    color: COLORS.netral_black,
  },
  nameText: {
    ...FONTS.subtitle3,
    color: COLORS.netral_black,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
  },
  quantityText: {
    ...FONTS.body4,
    color: COLORS.netral600,
  },
  quantity: {
    ...FONTS.title4,
    color: COLORS.netral_black,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    ...FONTS.body4,
    color: COLORS.netral600,
  },
});
