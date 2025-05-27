import { COLORS, FONTS, PROPS, SIZES } from 'common/theme';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { OnPressNone } from 'types/props';
import { CssStyle } from 'types/style';
import Icon, { IconProps } from './Icon';

type TextButtonProps = {
  type?: 'primary' | 'secondary';
  label: string;
  onPress?: OnPressNone;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconProps;
  style?: StyleProp<CssStyle>;
  labelStyle?: StyleProp<CssStyle>;
  activeOpacity?: TouchableOpacityProps['activeOpacity'];
};

const TextButton: React.FC<TextButtonProps> = ({
  type = 'primary',
  label,
  onPress,
  style,
  loading = false,
  disabled,
  icon,
  labelStyle,
  activeOpacity = PROPS.touchable_active_opacity,
}) => {
  const handlePress = () => {
    onPress?.();
  };

  const renderIcon = () => {
    if (!icon) return null;

    return (
      <Icon {...icon} size={20} style={loading ? styles.hide : undefined} />
    );
  };

  const renderLoading = () => {
    if (!loading) return null;

    return (
      <ActivityIndicator
        color={COLORS.netral_white}
        style={styles.loadingIndicator}
        size={'small'}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        type === 'primary'
          ? styles.backgroundPrimary
          : styles.backgroundSecondary,
        style,
        (disabled || loading) && styles.disabled,
      ]}
      activeOpacity={activeOpacity}
      disabled={disabled || loading}
      onPress={handlePress}>
      {renderIcon()}
      <Text
        style={[
          styles.label,
          type === 'primary' ? styles.labelPrimary : styles.labelSecondary,
          labelStyle,
          loading && styles.hide,
        ]}>
        {label}
      </Text>
      {renderLoading()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.padding / 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: SIZES.radius,
  },
  disabled: {
    opacity: 0.5,
  },
  backgroundPrimary: {
    backgroundColor: COLORS.primary500,
  },
  backgroundSecondary: {
    backgroundColor: COLORS.netral100,
  },
  label: {
    ...FONTS.title3,
  },
  labelPrimary: {
    color: COLORS.netral_white,
  },
  labelSecondary: {
    color: COLORS.netral_black,
  },
  loadingIndicator: {
    position: 'absolute',
  },
  hide: {
    opacity: 0,
  },
});

export default TextButton;
