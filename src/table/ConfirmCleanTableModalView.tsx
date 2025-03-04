import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewProps } from 'react-native';

import { OnPressNone } from 'types/props';
import { COLORS, FONTS, SIZES } from 'common';
import Icon, { IconType } from 'components/Icon';
import TextButton from 'components/TextButton';

type ConfirmCleanTableModalViewProps = {
  style?: StyleProp<ViewProps>;
  onPressClose?: OnPressNone;
  onPressConfirm?: OnPressNone;
};

const ConfirmCleanTableModalView: React.FC<ConfirmCleanTableModalViewProps> = ({
  style,
  onPressClose,
  onPressConfirm,
}) => {
  const handlePressClose = () => {
    onPressClose?.();
  };

  const handlePressConfirm = () => {
    onPressConfirm?.();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.overlay} />
      <View style={styles.modal}>
        <View style={styles.cleanIconRoot}>
          <View style={styles.cleanIconContainer}>
            <Icon
              type={IconType.ION}
              name="restaurant-outline"
              size={45}
              color={COLORS.netral_white}
            />
          </View>
        </View>
        <Text style={styles.title}>Bạn chắc chắn muốn dọn dẹp bàn này?</Text>
        <Text style={styles.description}>
          Bàn sẽ được dọn dẹp và sẵn sàng cho khách hàng tiếp theo
        </Text>
        <View style={styles.bottomBtns}>
          <TextButton
            style={styles.cancelBtn}
            labelStyle={styles.cancelBtnText}
            label="Hủy"
            onPress={handlePressClose}
          />
          <TextButton
            style={styles.confirmBtn}
            label="Xác nhận"
            onPress={handlePressConfirm}
          />
        </View>
      </View>
    </View>
  );
};

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
    width: 400,
    height: 430,
    padding: SIZES.padding,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  cleanIconRoot: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.warning200,
    borderRadius: 999,
  },
  cleanIconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.warning500,
    borderRadius: 999,
  },
  title: {
    ...FONTS.subtitle3,
    color: COLORS.netral_black,
    marginTop: SIZES.padding,
  },
  description: {
    ...FONTS.body4,
    color: COLORS.netral600,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
  bottomBtns: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  cancelBtn: {
    flex: 1,
    marginRight: SIZES.base,
    backgroundColor: COLORS.netral100,
  },
  cancelBtnText: {
    color: COLORS.netral_black,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: COLORS.warning400,
  },
});

export default ConfirmCleanTableModalView;
