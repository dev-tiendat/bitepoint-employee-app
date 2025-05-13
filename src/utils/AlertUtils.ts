import { Alert, AlertButton, AlertOptions } from 'react-native';
import { isEmpty } from 'lodash';

import { navigationRef } from 'navigation/AppNavigator';
import { NavigationAlertParams } from 'navigation/NavigationAlert';

export default class AlertUtils {
  static show({
    title = 'Thông báo',
    message,
    buttonText = 'OK',
    actions,
    options,
  }: {
    title?: string;
    message: string;
    buttonText?: string;
    actions?: AlertButton[];
    options?: AlertOptions;
  }) {
    if (isEmpty(message)) return;

    Alert.alert(
      title,
      message,
      actions || [{ text: buttonText, style: 'cancel' }],
      options,
    );
  }

  static showCustom({ title, description, actions }: NavigationAlertParams) {
    if (!navigationRef?.isReady?.()) {
      this.show({
        message: description,
        title,
        actions: actions?.map(({ label, onPress, style }) => ({
          text: label,
          onPress,
          style: style === 'primary' ? 'default' : style,
          isPreferred: style === 'primary',
        })),
      });

      return;
    }

    navigationRef.navigate('NavigationAlert', {
      title,
      description,
      actions,
    });
  }
}
