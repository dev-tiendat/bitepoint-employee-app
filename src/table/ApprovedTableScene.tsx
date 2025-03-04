import React, { Suspense, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';

import { COLORS, FONTS, SIZES } from 'common';
import { Reservation, ReservationStatus } from 'types/reservation';
import { useAppSelector } from 'store/hooks';
import { selectIsMinimizedMenu } from 'store/device/deviceSelector';
import Icon, { IconType } from 'components/Icon';
import LayoutScene from './LayoutScene';

type ApprovedTableSceneProps = {
  data?: Reservation[];
  onPressSearch?: (status: ReservationStatus, search: string) => void;
  onPressFilter?: () => void;
  onPressShowInfo?: (reservationId: number) => void;
  onPressCancel?: (reservationId: number) => void;
  style?: StyleProp<ViewProps>;
};

const ApprovedTableScene: React.FC<ApprovedTableSceneProps> = ({
  data,
  onPressSearch,
  onPressFilter,
  onPressShowInfo,
  onPressCancel,
  style,
}) => {
  const isMinimizedMenu = useAppSelector(selectIsMinimizedMenu);

  const handlePressSearch = (search: string) => {
    onPressSearch?.(ReservationStatus.COMPLETED, search);
  };

  const handlePressShowInfo = (reservationId: number) => {
    onPressShowInfo?.(reservationId);
  };

  const handleCancel = (reservationId: number) => {
    onPressCancel?.(reservationId);
  };

  const renderActions = (reservation: Reservation) => (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={[styles.actionBtn, styles.showInfoBtn]}
        onPress={() => handlePressShowInfo(reservation.id)}>
        <Icon
          type={IconType.ION}
          name="information-circle-outline"
          color={COLORS.netral_white}
          size={24}
        />
        {isMinimizedMenu && <Text style={styles.btnText}>Xem thông tin</Text>}
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

export default ApprovedTableScene;

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
  showInfoBtn: {
    backgroundColor: COLORS.success800,
  },
  btnText: {
    color: COLORS.netral_white,
    ...FONTS.body4,
  },
  actionCancelBtn: {
    backgroundColor: COLORS.danger500,
  },
});