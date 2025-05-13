import React, { LegacyRef } from 'react';
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS, FONTS, PROPS, SIZES } from 'common';
import { CssStyle } from 'types/style';
import Icon, { IconProps } from './Icon';

export type InputProps = {
  ref?: LegacyRef<TextInput>;
  value: string | undefined;
  placeholder?: string;
  prependIcon?: Omit<IconProps, 'style' | 'size' | 'color'>;
  appendIcon?: Omit<IconProps, 'style' | 'size' | 'color'>;
  inputContainerStyle?: StyleProp<CssStyle>;
  inputStyle?: StyleProp<CssStyle>;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  maxLength?: number;
  autoFocus?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  editable?: boolean;
  onChangeText?: (text: string) => void;
  onFocus?: (() => void) | undefined;
  onBlur?: (() => void) | undefined;
  onSubmitEditing?:
    | ((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void)
    | undefined;
  onPressAppendIcon?: (() => void) | undefined;
};

const Input: React.FC<InputProps> = ({
  ref,
  value,
  placeholder,
  prependIcon,
  appendIcon,
  inputStyle,
  inputContainerStyle,
  numberOfLines = 1,
  keyboardType,
  returnKeyType,
  maxLength,
  autoFocus = false,
  autoCapitalize,
  secureTextEntry,
  editable,
  onChangeText,
  onFocus,
  onBlur,
  onSubmitEditing,
  onPressAppendIcon,
}) => {
  const [focused, setFocused] = React.useState(autoFocus);

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  const handlePressAppendIcon = () => {
    onPressAppendIcon?.();
  };

  return (
    <View
      style={[
        styles.container,
        !focused ? styles.normalBorder : styles.focusedBorder,
        inputContainerStyle,
      ]}>
      {prependIcon && (
        <Icon {...prependIcon} size={24} color={COLORS.netral_black} />
      )}
      <TextInput
        ref={ref}
        value={value}
        placeholder={placeholder}
        editable={editable}
        autoFocus={focused}
        multiline={numberOfLines > 1}
        numberOfLines={numberOfLines}
        textAlignVertical={numberOfLines > 1 ? 'top' : 'auto'}
        clearButtonMode="while-editing"
        returnKeyType={returnKeyType}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor={COLORS.netral500}
        style={[
          styles.input,
          inputStyle,
          !(numberOfLines > 1) && styles.undefinedLineHeight,
        ]}
      />
      {appendIcon && (
        <TouchableOpacity
          activeOpacity={PROPS.touchable_active_opacity}
          onPress={handlePressAppendIcon}>
          <Icon {...appendIcon} size={24} color={COLORS.netral_black} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.gap,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.netral100,
  },
  normalBorder: {
    borderColor: 'transparent',
  },
  focusedBorder: {
    borderColor: COLORS.primary700,
  },
  input: {
    flex: 1,
    color: COLORS.netral_black,
    ...FONTS.body3,
  },
  undefinedLineHeight: {
    lineHeight: undefined,
  },
});

export default Input;
