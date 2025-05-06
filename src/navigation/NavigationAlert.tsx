import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppStackParamList } from './AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, FONTS, PROPS, SIZES } from 'common';

const MAX_WIDTH = SIZES.width / 3;

type ActionConfig = {
  onPress: () => void;
  show?: boolean;
  label?: string;
};

export type NavigationAlertParams = {
  title?: string;
  description: string;
  goBack?: boolean;
  actions?: {
    confirm?: ActionConfig;
    cancel?: Partial<ActionConfig>;
  };
};
export type NavigationAlertProps = NativeStackScreenProps<
  AppStackParamList,
  'NavigationAlert'
>;

const NavigationAlert: React.FC<NavigationAlertProps> = ({
  navigation,
  route,
}) => {
  const {
    title = 'Thông báo',
    description,
    goBack = true,
    actions,
  } = route.params;

  const handleConfirm = () => {
    actions?.confirm?.onPress?.();
    if (goBack && navigation.canGoBack()) navigation.goBack();
  };
  const handleCancel = () => {
    actions?.cancel?.onPress?.();
    if (goBack && navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.actions}>
          {actions?.cancel?.show && (
            <TouchableOpacity
              activeOpacity={PROPS.touchable_active_opacity}
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}>
              <Text style={styles.buttonText}>
                {actions.cancel.label || 'Huỷ'}
              </Text>
            </TouchableOpacity>
          )}
          {actions?.confirm?.show && (
            <TouchableOpacity
              activeOpacity={PROPS.touchable_active_opacity}
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}>
              <Text style={styles.buttonText}>
                {actions.confirm.label || 'Xác nhận'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    maxWidth: MAX_WIDTH,
    padding: SIZES.padding,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
    gap: SIZES.padding,
  },
  title: {
    color: COLORS.netral_black,
    ...FONTS.title1,
  },
  description: {
    color: COLORS.netral600,
    ...FONTS.body3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: SIZES.radius,
  },
  cancelButton: {
    backgroundColor: COLORS.danger500,
  },
  confirmButton: {
    backgroundColor: COLORS.primary500,
  },
  buttonText: {
    color: COLORS.netral_white,
    ...FONTS.title3,
  },
});

export default NavigationAlert;
