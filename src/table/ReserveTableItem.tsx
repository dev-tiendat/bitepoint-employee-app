import { StyleProp, StyleSheet, Text, View, ViewProps } from 'react-native';
import React from 'react';
import { Reservation } from 'types/reservation';
import { COLORS, FONTS, SIZES } from 'common';
import DateUtils from 'utils/DateUtils';

type ReserveTableItemProps = {
  data: Reservation;
  style?: StyleProp<ViewProps>;
  renderActions?: (reservation: Reservation) => React.ReactNode;
};

const ReserveTableItem: React.FC<ReserveTableItemProps> = ({
  style,
  data,
  renderActions,
}) => {
  const tableNames = data.orders?.map(table => table.tableName).join(',');

  return (
    <View style={[styles.container, style]}>
      <View style={styles.info}>
        <View style={styles.column}>
          <Text style={styles.name}>{data.customerName}</Text>
          <Text style={styles.text}>{data.phone}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.text}>{data.guestCount} khách</Text>
          <Text style={styles.text}>
            {DateUtils.unixToDateTime(data.reservationTime)}
          </Text>
        </View>
        {tableNames && (
          <View style={styles.column}>
            <Text style={styles.text}>Bàn</Text>
            <Text style={styles.text}>{tableNames}</Text>
          </View>
        )}
        <View style={styles.column}>
          <Text style={styles.noteText}>Ghi chú</Text>
          <Text style={styles.text}>{data.specialRequest}</Text>
        </View>
      </View>
      <View style={styles.column}>{renderActions?.(data)}</View>
    </View>
  );
};

export default ReserveTableItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.base,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.netral_white,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.radius,
    gap: '10%',
  },
  column: {
    minWidth: 100,
    flexDirection: 'column',
    gap: SIZES.base,
  },
  name: {
    ...FONTS.subtitle3,
    color: COLORS.netral_black,
  },
  text: {
    ...FONTS.body3,
    color: COLORS.netral600,
  },
  noteText: {
    ...FONTS.body3,
    textAlign: 'center',
    color: COLORS.primary500,
    backgroundColor: COLORS.secondary100,
    paddingHorizontal: SIZES.radius,
    borderRadius: 3,
  },
});
