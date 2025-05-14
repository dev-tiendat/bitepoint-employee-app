import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import AnimatedContainer from './AnimatedContainer';
import { COLORS, FONTS, PROPS, SIZES } from 'common';
import Icon, { IconType } from 'components/Icon';
import BackgroundTimer from 'react-native-background-timer';

const ICON_SIZE = 25;

export type ToastItemProps = {
  message: string;
  title?: string;
  duration?: number;
  autoHide?: boolean;
  type?: 'success' | 'error' | 'info' | 'warning';
  index: number;
  onHide?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const ToastItem: React.FC<ToastItemProps> = ({
  title,
  message,
  duration = 3000,
  autoHide = true,
  type = 'info',
  index,
  onHide,
  style,
  textStyle,
}) => {
  const [hide, setHide] = useState(false);
  const timeoutId = useRef<number | undefined>(undefined);

  const clearTimeout = useCallback(() => {
    if (timeoutId.current) {
      BackgroundTimer.clearTimeout(timeoutId.current);
      timeoutId.current = undefined;
    }
  }, []);

  const hideToast = useCallback(() => {
    setHide(true);
    BackgroundTimer.setTimeout(() => {
      onHide?.();
    }, 1000);
  }, [onHide]);

  const setTimeoutHide = useCallback(() => {
    if (!autoHide) return;
    clearTimeout();
    timeoutId.current = BackgroundTimer.setTimeout(hideToast, duration);
  }, [autoHide, duration, hideToast, clearTimeout]);

  useEffect(() => {
    setTimeoutHide();
    return clearTimeout;
  }, [setTimeoutHide, clearTimeout]);

  const handlePanBegin = useCallback(() => {
    clearTimeout();
  }, [clearTimeout]);

  const handlePanFinalize = useCallback(() => {
    setTimeoutHide();
  }, [setTimeoutHide]);

  const getStyleIcon = () => {
    switch (type) {
      case 'success':
        return styles.successIcon;
      case 'error':
        return styles.errorIcon;
      case 'warning':
        return styles.warningIcon;
      default:
        return styles.infoIcon;
    }
  };

  const getStyleContainer = () => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'warning':
        return styles.warning;
      default:
        return styles.info;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'success':
        return 'Thành công';
      case 'error':
        return 'Lỗi';
      case 'warning':
        return 'Cảnh báo';
      default:
        return 'Thông báo';
    }
  };

  const renderIcon = () => {
    let iconName = 'information';
    if (type === 'success') iconName = 'checkmark';
    else if (type === 'error') iconName = 'close';
    else if (type === 'warning') iconName = 'alert';
    return (
      <Icon
        type={IconType.ION}
        name={iconName}
        size={ICON_SIZE}
        color={COLORS.netral_white}
      />
    );
  };

  return (
    <AnimatedContainer
      hide={hide}
      index={index}
      onHide={hideToast}
      onPanBegin={handlePanBegin}
      onPanFinalize={handlePanFinalize}
      style={[styles.container, style, styles.topRight, getStyleContainer()]}>
      <View style={[styles.iconContainer, getStyleIcon()]}>{renderIcon()}</View>
      <View style={styles.content}>
        <Text style={[styles.title, textStyle]} numberOfLines={1}>
          {title || getDefaultTitle()}
        </Text>
        <Text style={[styles.message, textStyle]} numberOfLines={2}>
          {message}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={PROPS.touchable_active_opacity}
        onPress={hideToast}>
        <Icon
          type={IconType.ION}
          name="close"
          size={ICON_SIZE}
          color={COLORS.netral_black}
        />
      </TouchableOpacity>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.radius,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: SIZES.width / 3,
    gap: SIZES.gap,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  success: {
    borderColor: COLORS.success500,
    backgroundColor: COLORS.success100,
  },
  error: { borderColor: COLORS.danger500, backgroundColor: COLORS.danger100 },
  warning: {
    borderColor: COLORS.warning500,
    backgroundColor: COLORS.warning100,
  },
  info: {
    borderColor: COLORS.secondary500,
    backgroundColor: COLORS.secondary100,
  },
  iconContainer: {
    width: ICON_SIZE + 10,
    height: ICON_SIZE + 10,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: { backgroundColor: COLORS.success500 },
  errorIcon: { backgroundColor: COLORS.danger500 },
  warningIcon: { backgroundColor: COLORS.warning500 },
  infoIcon: { backgroundColor: COLORS.secondary500 },
  content: { flex: 1, flexDirection: 'column', alignItems: 'flex-start' },
  topRight: { top: SIZES.padding, right: SIZES.padding },
  title: { color: COLORS.netral_black, ...FONTS.title3 },
  message: { color: COLORS.netral400, ...FONTS.body3 },
});

export default ToastItem;
