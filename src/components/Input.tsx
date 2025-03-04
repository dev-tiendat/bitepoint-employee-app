import React from 'react';
import { Platform, StyleProp, StyleSheet, TextInput, View } from 'react-native';

import { COLORS, FONTS, SIZES } from 'common';
import { CssStyle } from 'types/style';

export type InputProps = {
  placeholder?: string;
  inputStyle?: StyleProp<CssStyle>;
  inputContainerStyle?: StyleProp<CssStyle>;
  prependComponent?: () => React.JSX.Element | null;
  appendComponent?: () => React.JSX.Element | null;
  onChangeText?: (text: string) => void;
  value: string | undefined;
  secureTextEntry?: boolean;
  editable?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'visible-password';
  autoCompleteType?:
    | 'off'
    | 'username'
    | 'password'
    | 'email'
    | 'name'
    | 'tel'
    | 'street-address'
    | 'postal-code'
    | 'cc-number'
    | 'cc-csc'
    | 'cc-exp'
    | 'cc-exp-month'
    | 'cc-exp-year';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

const Input: React.FC<InputProps> = ({
  editable,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  prependComponent,
  appendComponent,
  inputContainerStyle,
  inputStyle,
}) => {
  return (
    <View style={[styles.container, inputContainerStyle]}>
      {prependComponent?.()}
      <TextInput
        style={[Platform.OS !== 'android' && styles.input, inputStyle]}
        editable={editable}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        textAlignVertical="center"
      />
      {appendComponent?.()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.base,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: SIZES.radius,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.netral100,
  },
  input: {
    flex: 1,
    height: 30,
    paddingHorizontal: SIZES.radius,
    ...FONTS.body3,
  },
});

export default Input;
