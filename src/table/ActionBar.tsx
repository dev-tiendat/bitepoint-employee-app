import React from 'react';
import {
  Image,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { icons } from 'common';
import { COLORS, FONTS, SIZES } from 'common/theme';
import TextButton from 'components/TextButton';
import { Table } from 'types/table';
import { Reservation } from 'types/reservation';
import { OnPressNone } from 'types/props';
import { CssStyle } from 'types/style';

type ActionBarProps = {
  info?: Reservation;
  data?: Table[];
  onPress?: OnPressNone;
  style?: StyleProp<CssStyle>;
};

const ActionBar: React.FC<ActionBarProps> = ({
  info,
  data,
  onPress,
  style,
}) => {
  const handlePress = () => {
    onPress?.();
  };

  const renderItem = (item: Table, index: number) => (
    <View key={`action-bar-item-${index}`} style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.info}>
        <View style={styles.iconContainer}>
          <Image source={icons.dinning} style={styles.icon} />
        </View>
        <View>
          <Text style={styles.guestCount}>{info?.guestCount} người</Text>
          <Text style={styles.customerName}>{info?.customerName}</Text>
        </View>
        <View style={styles.divider} />
      </View>
      <ScrollView style={styles.list} horizontal>
        {data?.map(renderItem)}
      </ScrollView>
      <TextButton label="Chọn bàn" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.netral_white,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  guestCount: {
    ...FONTS.title3,
    color: COLORS.netral_black,
  },
  customerName: {
    ...FONTS.body4,
    color: COLORS.netral600,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    width: 48,
    height: 48,
    backgroundColor: COLORS.secondary100,
    borderRadius: SIZES.radius,
  },
  icon: {
    width: 24,
    height: 24,
  },
  divider: {
    marginLeft: SIZES.padding,
    width: 1,
    height: '100%',
    backgroundColor: COLORS.netral200,
  },
  list: {
    marginHorizontal: 16,
    width: '100%',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
    width: 48,
    height: 48,
    backgroundColor: COLORS.netral100,
    borderRadius: SIZES.radius,
  },
  itemText: {
    ...FONTS.title3,
    color: COLORS.netral800,
  },
});

export default ActionBar;
