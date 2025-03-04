import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS, FONTS, PROPS, SIZES } from 'common';
import Icon, { IconType } from 'components/Icon';
import { PaymentMethod } from 'types/payment';

interface PaymentMethodItemProps {
  method: PaymentMethod;
  isSelected?: boolean;
  onPress?: (method: PaymentMethod) => void;
}

const getMethodName = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CASH:
      return 'Tiền mặt';
    case PaymentMethod.QR_CODE:
      return 'QR code';
    default:
      return '';
  }
};

const getMethodIconName = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CASH:
      return 'cash-outline';
    case PaymentMethod.QR_CODE:
      return 'qr-code-outline';
    default:
      return '';
  }
};

const getMethodColor = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CASH:
      return COLORS.success500;
    case PaymentMethod.QR_CODE:
      return COLORS.netral_black;
    default:
      return COLORS.netral_black;
  }
};

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  method,
  isSelected,
  onPress,
}) => {
  const methodName = useMemo(() => getMethodName(method), [method]);
  const methodIconName = useMemo(() => getMethodIconName(method), [method]);
  const methodColor = useMemo(() => getMethodColor(method), [method]);

  const handlePress = () => {
    onPress?.(method);
  };

  return (
    <TouchableOpacity
      activeOpacity={PROPS.touchable_active_opacity}
      style={styles.container}
      onPress={handlePress}>
      <View style={[styles.iconContainer, isSelected && styles.active]}>
        <Icon
          type={IconType.ION}
          name={methodIconName}
          size={40}
          color={methodColor}
        />
      </View>
      <Text style={styles.text}>{methodName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.netral_white,
    borderRadius: 5,
    marginVertical: 5,
  },
  active: {
    borderColor: COLORS.primary500,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.netral_white,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: COLORS.netral200,
    borderRadius: SIZES.radius,
  },
  text: {
    ...FONTS.subtitle3,
    marginTop: 12,
    color: COLORS.netral_black,
  },
});

export default PaymentMethodItem;