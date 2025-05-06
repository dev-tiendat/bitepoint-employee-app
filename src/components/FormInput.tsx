import React from 'react';
import { StyleProp, StyleSheet, Text, TextInput, View } from 'react-native';

import { CssStyle } from 'types/style';
import { COLORS, FONTS, SIZES } from 'common/theme';
import Input, { InputProps } from './Input';

export type FormInputProps = InputProps & {
  style?: StyleProp<CssStyle>;
  label: string;
  errorMessage?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  style,
  label,
  errorMessage = '',
  inputContainerStyle,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.headContainer}>
        <Text style={[styles.label]}>{label}</Text>
      </View>
      <Input
        inputContainerStyle={[
          inputContainerStyle,
          errorMessage && styles.errorBorder,
        ]}
        {...rest}
      />
      <Text style={styles.errorMessage}>{errorMessage}</Text>
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  container: {
    gap: SIZES.base,
  },
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...FONTS.body3,
    color: COLORS.netral600,
  },
  errorBorder: {
    borderColor: COLORS.danger500,
  },
  errorMessage: {
    ...FONTS.subtitle4,
    color: COLORS.danger500,
  },
});
