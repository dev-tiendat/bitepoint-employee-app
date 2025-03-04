import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { OrderStatus } from 'types/order';
import { COLORS, FONTS, PROPS, SIZES } from 'common';

type StatusSelectButtonProps = {
  status: OrderStatus;
  selectedStatus: OrderStatus;
  label: string;
  onPress?: (status: OrderStatus) => void;
  style?: StyleProp<ViewStyle>;
};

const StatusSelectButton: React.FC<StatusSelectButtonProps> = ({
  status,
  selectedStatus,
  onPress,
  label,
  style,
}) => {
  const isSelected = status === selectedStatus;

  const handlePress = () => {
    onPress?.(status);
  };

  return (
    <TouchableOpacity
      activeOpacity={PROPS.touchable_active_opacity}
      style={[styles.button, style, isSelected && styles.buttonActive]}
      onPress={handlePress}>
      <Text style={[styles.text, isSelected && styles.textActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: SIZES.padding / 2,
    borderRadius: 8,
    backgroundColor: COLORS.netral_white,
  },
  buttonActive: {
    backgroundColor: COLORS.secondary200,
  },
  text: {
    ...FONTS.title4,
    color: COLORS.netral500,
  },
  textActive: {
    color: COLORS.primary500,
  },
});

export default StatusSelectButton;
