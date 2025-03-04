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
import React from 'react';
import { OnPressNone } from 'types/props';
import { OrderInfo } from 'types/order';
import { COLORS, FONTS, icons, SIZES } from 'common';
import FastImage from 'react-native-fast-image';

type TableQRCodeModalViewProps = {
  style?: StyleProp<ViewProps>;
  data?: OrderInfo[];
  onPressClose?: OnPressNone;
};

const TableQRCodeModalView: React.FC<TableQRCodeModalViewProps> = ({
  style,
  data,
  onPressClose,
}) => {
  const handlePressClose = () => {
    onPressClose?.();
  };

  const renderItem = ({ item }: { item: OrderInfo }) => {
    return (
      <View style={styles.item}>
        <FastImage
          source={{
            uri: item.qrcode,
          }}
          style={styles.image}
        />
        <Text style={styles.tableName}>Bàn {item.tableName}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handlePressClose} style={styles.overlay} />
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePressClose} style={styles.closeBtn}>
            <Image source={icons.close} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          data={data}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default TableQRCodeModalView;

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
    width: 450,
    height: 550,
    padding: SIZES.padding,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  item: {
    marginBottom: SIZES.base,
  },
  image: {
    width: 400,
    height: 400,
    borderRadius: SIZES.radius,
  },
  tableName: {
    ...FONTS.title2,
    marginHorizontal: 'auto',
    color: COLORS.netral_black,
    marginTop: SIZES.base,
  },
});
