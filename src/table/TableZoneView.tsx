import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios, { CancelTokenSource } from 'axios';
import { COLORS, FONTS, PROPS, SIZES } from 'common/theme';
import TextButton from 'components/TextButton';
import { NewAPIManager } from 'managers/APIManager';
import { TableHome, TableZone } from 'types/table';
import { CssStyle } from 'types/style';
import BackButton from 'components/BackButton';

type TableZoneListViewProps = {
  showAction?: boolean;
  style?: StyleProp<CssStyle>;
  selectedZoneId?: number;
  data?: TableZone[];
  onPressGoToTableManager?: () => void;
  onPressItem?: (id: number) => void;
};

type TableZoneItemProps = {
  data: TableHome;
  onPress?: (id: number) => void;
  isSelected: boolean;
};

const TableZoneItem: React.FC<TableZoneItemProps> = ({
  data,
  onPress,
  isSelected,
}) => {
  const handlePress = () => {
    onPress?.(data.id);
  };

  return (
    <TouchableOpacity
      style={[styles.item, isSelected && styles.itemSelected]}
      onPress={handlePress}
      activeOpacity={PROPS.touchable_active_opacity}>
      <Text style={[styles.zoneText, isSelected && styles.itemNameSelected]}>
        {data.name}
      </Text>
    </TouchableOpacity>
  );
};

const TableZoneHorizontalList: React.FC<TableZoneListViewProps> = ({
  showAction = true,
  style,
  data,
  selectedZoneId,
  onPressItem,
  onPressGoToTableManager,
}) => {
  const handlePressFindTable = () => {
    onPressGoToTableManager?.();
  };

  const renderTableZoneItem = ({ item }: { item: TableHome }) => (
    <TableZoneItem
      data={item}
      onPress={onPressItem}
      isSelected={selectedZoneId === item.id}
    />
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {!showAction ? (
          <BackButton title="Chọn bàn" style={styles.backBtn}/>
        ) : (
          <Text style={styles.textHead}>Khu vực bàn ăn</Text>
        )}
        {showAction && (
          <View style={styles.options}>
            <TextButton
              label="Quản lý hệ thống đặt bàn"
              onPress={handlePressFindTable}
              style={styles.optionButton}
            />
            <TextButton
              label="Quét mã QR"
              onPress={() => {}}
              style={styles.optionButton}
            />
          </View>
        )}
      </View>
      <FlatList
        data={data}
        renderItem={renderTableZoneItem}
        style={styles.listZone}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default TableZoneHorizontalList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.netral_white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    marginLeft: SIZES.padding,
  },
  textHead: {
    marginLeft: SIZES.padding,
    ...FONTS.heading2,
  },
  options: {
    flexDirection: 'row',
  },
  optionButton: {
    marginRight: SIZES.radius,
  },
  listZone: {
    marginTop: SIZES.padding,
    marginLeft: SIZES.base
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SIZES.radius,
    width: SIZES.width / 7,
    paddingVertical: 16,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.netral100,
  },
  zoneText: {
    ...FONTS.subtitle3,
    color: COLORS.netral600,
  },
  itemSelected: {
    backgroundColor: COLORS.secondary200,
  },
  itemNameSelected: {
    color: COLORS.primary500,
  },
});
