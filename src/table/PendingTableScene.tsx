import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import { COLORS, FONTS, SIZES } from 'common';
import Icon, { IconType } from 'components/Icon';
import LayoutScene from './LayoutScene';
import { Reservation, ReservationStatus } from 'types/reservation';
import { useAppSelector } from 'store/hooks';
import { selectIsMinimizedMenu } from 'store/device/deviceSelector';

type PendingTableSceneProps = {
  data?: Reservation[];
  onPressSearch?: (status: ReservationStatus, search: string) => void;
  onPressFilter?: () => void;
  onPressAssignTable?: (reservation: Reservation) => void;
  onPressCancel?: (reservationId: number) => void;
  style?: StyleProp<ViewProps>;
};

const PendingTableScene: React.FC<PendingTableSceneProps> = ({
  data,
  onPressSearch,
  onPressFilter,
  onPressAssignTable,
  onPressCancel,
  style,
}) => {
  const isMinimizedMenu = useAppSelector(selectIsMinimizedMenu);

  const handlePressSearch = (search: string) => {
    onPressSearch?.(ReservationStatus.PENDING, search);
  };

  const handleAssignTable = (reservation: Reservation) => {
    onPressAssignTable?.(reservation);
  };

  const handleCancel = (reservationId: number) => {
    onPressCancel?.(reservationId);
  };

  const renderActions = (reservation: Reservation) => (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={[styles.actionBtn, styles.actionAssignBtn]}
        onPress={() => handleAssignTable(reservation)}>
        <Icon
          type={IconType.ION}
          name="enter-outline"
          color={COLORS.netral_white}
          size={24}
        />
        {isMinimizedMenu && <Text style={styles.btnText}>Gắn bàn</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionBtn, styles.actionCancelBtn]}
        onPress={() => handleCancel(reservation.id)}>
        <Icon
          type={IconType.ION}
          name="close-outline"
          color={COLORS.netral_white}
          size={24}
        />
        {isMinimizedMenu && <Text style={styles.btnText}>Hủy</Text>}
      </TouchableOpacity>
    </View>
  );

  return (
    <LayoutScene
      data={data}
      onPressSearch={handlePressSearch}
      renderActions={renderActions}
    />
  );
};

export default PendingTableScene;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.backgroundPrimary,
  },
  searchContainer: {
    marginTop: 16,
    backgroundColor: COLORS.netral_white,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
    padding: SIZES.base,
    borderRadius: 6,
  },
  actionAssignBtn: {
    backgroundColor: COLORS.warning500,
  },
  btnText: {
    color: COLORS.netral_white,
    ...FONTS.body4,
  },
  actionCancelBtn: {
    backgroundColor: COLORS.danger500,
  },
});
