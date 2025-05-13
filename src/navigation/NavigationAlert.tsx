import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { isNil } from 'lodash';

import { COLORS, FONTS, PROPS, SIZES } from 'common';
import { AppStackParamList } from './AppNavigator';
import { OnPressNone } from 'types/props';

const MAX_WIDTH = SIZES.width / 3;
type ActionType = {
  label: string;
  onPress?: OnPressNone;
  style?: 'primary' | 'cancel' | 'default' | 'destructive' | undefined;
};

export type NavigationAlertParams = {
  title?: string;
  description: string;
  actions?: ActionType[];
};

export type NavigationAlertProps = NativeStackScreenProps<
  AppStackParamList,
  'NavigationAlert'
>;

const NavigationAlert: React.FC<NavigationAlertProps> = ({
  navigation,
  route,
}) => {
  const { title = 'Thông báo', description, actions } = route.params;

  const closeModal = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handlePressAction = (callback?: OnPressNone) => {
    closeModal();
    callback?.();
  };

  const renderAction = (action: ActionType, index: number) => {
    const { label, onPress, style } = action;
    const buttonStyle = [
      styles.button,
      (style === 'default' || style === 'cancel' || isNil(style)) &&
        styles.normalButton,
      style === 'primary' && styles.primaryButton,
      style === 'destructive' && styles.destructiveButton,
    ];
    const textStyle = [
      styles.buttonText,
      (style === 'default' || style === 'cancel' || isNil(style)) &&
        styles.normalButtonText,
      style === 'primary' && styles.primaryButtonText,
      style === 'destructive' && styles.destructiveButtonText,
    ];

    const onPressItem = () => {
      handlePressAction(onPress);
    };
    return (
      <TouchableOpacity
        key={`alert-action-${index}`}
        activeOpacity={PROPS.touchable_active_opacity}
        style={buttonStyle}
        onPress={onPressItem}>
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.actions}>
          {!isNil(actions)
            ? actions.map(renderAction)
            : renderAction(
                {
                  label: 'Huỷ',
                  onPress: closeModal,
                  style: 'cancel',
                },
                0,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SIZES.padding / 2,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: SIZES.radius,
  },
  normalButton: {
    backgroundColor: COLORS.netral100,
  },
  destructiveButton: {
    backgroundColor: COLORS.danger500,
  },
  primaryButton: {
    backgroundColor: COLORS.primary500,
  },
  buttonText: {
    ...FONTS.title3,
  },
  normalButtonText: {
    color: COLORS.netral_black,
  },
  destructiveButtonText: {
    color: COLORS.netral_white,
  },
  primaryButtonText: {
    color: COLORS.netral_white,
  },
});

export default NavigationAlert;
