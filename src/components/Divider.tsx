import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from 'common';

interface DividerProps {
  color?: string;
  thickness?: number;
  margin?: number;
  vertical?: boolean;
  style?: ViewStyle;
}

const Divider: React.FC<DividerProps> = ({
  color = COLORS.netral200,
  thickness = StyleSheet.hairlineWidth,
  margin = 0,
  vertical = false,
  style,
}) => {
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        vertical
          ? { width: thickness, height: '100%', marginHorizontal: margin }
          : { height: thickness, width: '100%', marginVertical: margin },
        { backgroundColor: color },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
    alignSelf: 'center',
  },
  vertical: {
    height: '100%',
    alignSelf: 'center',
  },
});

export default Divider;
