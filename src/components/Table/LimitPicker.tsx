import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SIZES, COLORS, FONTS } from 'common';

type LimitPickerProps = {
  value: number;
  onChange?: (value: number) => void;
  options: number[];
};

const LimitPicker: React.FC<LimitPickerProps> = ({
  value,
  onChange,
  options,
}) => {
  const data = options.map(opt => ({
    label: opt.toString(),
    value: opt,
  }));

  const handleChangeItem = (item: any) => {
    onChange?.(item.value);
  };

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemText}
        selectedTextStyle={styles.selectedText}
        activeColor={COLORS.secondary200}
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        onChange={handleChangeItem}
        placeholder=""
        iconStyle={styles.iconStyle}
      />
      <Text style={styles.label}>dòng/trang</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.netral_white,
    gap: SIZES.gap,
    marginHorizontal: SIZES.padding,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.netral600,
  },
  dropdown: {
    width: 80,
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.netral400,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    backgroundColor: COLORS.netral_white,
    justifyContent: 'center',
  },
  dropdownContainer: {
    bottom: 8,
    borderRadius: SIZES.radius,
    borderColor: COLORS.netral400,
    backgroundColor: COLORS.netral_white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    ...FONTS.body4,
    color: COLORS.netral500,
  },
  selectedText: {
    ...FONTS.body4,
    color: COLORS.netral_black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

export default LimitPicker;
