import React from 'react';
import { StyleProp, StyleSheet, Text, TextInput, View } from 'react-native';

import { CssStyle } from 'types/style';
import { COLORS, FONTS, SIZES } from 'common/theme';
import Input, { InputProps } from './Input';

type FormInputProps = InputProps & {
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
          errorMessage && styles.errorInput,
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
    marginTop: SIZES.base,
  },
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...FONTS.body3,
    color: COLORS.netral600,
  },
  errorInput: {
    borderColor: COLORS.danger500,
    borderWidth: 1,
  },
  errorMessage: {
    ...FONTS.subtitle4,
    marginTop: SIZES.base,
    color: COLORS.danger500,
  },
});
