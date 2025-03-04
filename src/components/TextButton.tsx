import { COLORS, FONTS, PROPS, SIZES } from 'common/theme';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { OnPressNone } from 'types/props';
import { CssStyle } from 'types/style';

type TextButtonProps = {
  label: string;
  onPress: OnPressNone;
  disabled?: boolean;
  style?: StyleProp<CssStyle>;
  labelStyle?: StyleProp<CssStyle>;
  activeOpacity?: TouchableOpacityProps['activeOpacity'];
};

const TextButton: React.FC<TextButtonProps> = ({
  label,
  onPress,
  style,
  disabled,
  labelStyle,
  activeOpacity = PROPS.touchable_active_opacity,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={activeOpacity}
      disabled={disabled}
      onPress={onPress}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary500,
    borderRadius: SIZES.radius,
  },
  label: {
    ...FONTS.title3,
    color: COLORS.netral_white,
  },
});

export default TextButton;
