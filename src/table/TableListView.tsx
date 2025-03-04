import React, { useMemo } from 'react';
import { FlatList, StyleProp, Text, View } from 'react-native';
import StyleSheet from 'react-native-media-query';
import { isEmpty, isNil } from 'lodash';

import { COLORS, COMMON_STYLES, FONTS, SIZES } from 'common/theme';
import { MediaQuery } from 'common/media';
import { CssStyle } from 'types/style';
import { StatusInfo, Table, TableStatus } from 'types/table';

import TableItem from './TableItem';
import ActionBar from './ActionBar';
import { Reservation } from 'types/reservation';

type TableListViewProps = {
  style?: StyleProp<CssStyle>;
  info?: Reservation;
  data?: Table[];
  isAssignTable?: boolean;
  selectedTables?: Table[];
  onPressItem?: (id: number) => void;
  onPressConfirm?: () => void;
};

export const TABLE_STATUS_COLORS = {
  [TableStatus.AVAILABLE]: COLORS.netral600,
  [TableStatus.CLEANING]: COLORS.warning400,
  [TableStatus.RESERVED]: COLORS.danger400,
  [TableStatus.OCCUPIED]: COLORS.success400,
};

const STATUS_INFOS: StatusInfo[] = [
  {
    status: TableStatus.AVAILABLE,
    title: 'Bàn trống',
    color: TABLE_STATUS_COLORS[TableStatus.AVAILABLE],
  },
  {
    status: TableStatus.CLEANING,
    title: 'Đang dọn dẹp',
    color: TABLE_STATUS_COLORS[TableStatus.CLEANING],
  },
  {
    status: TableStatus.RESERVED,
    title: 'Đã đặt ',
    color: TABLE_STATUS_COLORS[TableStatus.RESERVED],
  },
  {
    status: TableStatus.OCCUPIED,
    title: 'Đã có khách',
    color: TABLE_STATUS_COLORS[TableStatus.OCCUPIED],
  },
];

const TableListView: React.FC<TableListViewProps> = ({
  style,
  info,
  data,
  isAssignTable,
  selectedTables,
  onPressItem,
  onPressConfirm,
}) => {
  const statusInfo = useMemo(() => {
    const statusInfo: Record<TableStatus, number> = {
      [TableStatus.AVAILABLE]: 0,
      [TableStatus.CLEANING]: 0,
      [TableStatus.RESERVED]: 0,
      [TableStatus.OCCUPIED]: 0,
    };

    data?.forEach(table => {
      statusInfo[table.status!] += 1;
    });

    return statusInfo;
  }, [data]);

  const renderItem = ({ item }: { item: Table }) => (
    <TableItem
      data={item}
      isAssignTable={isAssignTable}
      isSelected={selectedTables?.some(table => table.id === item.id)}
      onPress={onPressItem}
    />
  );

  const renderListEmpty = () => (
    <View style={styles.emptyList}>
      <Text style={styles.emptyText}>Khu vực hiện không có bàn nào</Text>
    </View>
  );

  const renderStatusInfoItem = (item: StatusInfo, index: number) => {
    const statusIndicatorStyle = {
      backgroundColor: item.color,
    };

    return (
      <View key={`status-info-${index}`} style={styles.statusInfoItem}>
        <View style={[styles.statusIndicator, statusIndicatorStyle]} />
        <Text style={styles.statusText}>
          {item.title} : {statusInfo[item.status]}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {isEmpty(data) ? (
        <View style={styles.emptyList}>
          <Text style={styles.emptyText}>Vui lòng chọn khu vực</Text>
        </View>
      ) : (
        <>
          <View style={styles.statusInfo}>
            {STATUS_INFOS.map(renderStatusInfoItem)}
          </View>
          <FlatList
            style={styles.list}
            dataSet={{ media: ids.list }}
            data={data}
            renderItem={renderItem}
            numColumns={4}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderListEmpty}
          />
        </>
      )}
      {!isEmpty(selectedTables) && isAssignTable && (
        <ActionBar
          info={info}
          data={selectedTables}
          onPress={onPressConfirm}
          style={styles.actionBar}
        />
      )}
    </View>
  );
};

const { ids, styles } = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    [MediaQuery.MOBILE_SM]: {
      paddingTop: 30,
    },
    paddingTop: 40,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.netral600,
    ...FONTS.body2,
  },
  statusInfo: {
    position: 'absolute',
    zIndex: 1,
    top: SIZES.radius,
    right: SIZES.radius,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.base,
    ...COMMON_STYLES.shadow,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 3,
  },
  statusInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statusText: {
    marginLeft: 8,
    ...FONTS.body4,
  },
  actionBar: {
    position: 'absolute',
    bottom: SIZES.padding,
    width: 600,
    padding: 12,
    borderRadius: 16,
    ...COMMON_STYLES.shadow,
  },
});

export default TableListView;
