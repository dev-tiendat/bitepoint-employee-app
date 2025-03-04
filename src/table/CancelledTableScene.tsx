import React from 'react';
import { StyleProp, StyleSheet, ViewProps } from 'react-native';
import { COLORS, FONTS, SIZES } from 'common';

import { Reservation, ReservationStatus } from 'types/reservation';
import LayoutScene from './LayoutScene';

type CancelledTableSceneProps = {
  data?: Reservation[];
  onPressSearch?: (status: ReservationStatus, search: string) => void;
  onPressFilter?: () => void;
  style?: StyleProp<ViewProps>;
};

const CancelledTableScene: React.FC<CancelledTableSceneProps> = ({
  data,
  onPressSearch,
  onPressFilter,
  style,
}) => {
  const handlePressSearch = (search: string) => {
    onPressSearch?.(ReservationStatus.CANCELED, search);
  };

  return <LayoutScene data={data} onPressSearch={handlePressSearch} />;
};

export default CancelledTableScene;

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
