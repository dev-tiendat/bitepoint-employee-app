import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { icons } from 'common';
import { COLORS, FONTS, PROPS, SIZES } from 'common/theme';
import { CssStyle } from 'types/style';

type BackButtonProps = {
  style?: StyleProp<CssStyle>;
  title?: string;
};

const BackButton: React.FC<BackButtonProps> = ({ style, title }) => {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  const handlePress = () => {
    if (!canGoBack) return;

    navigation.goBack();
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, !canGoBack && styles.none]}
        onPress={handlePress}
        activeOpacity={PROPS.touchable_active_opacity}>
        <Image source={icons.back} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding,
    width: 30,
    height: 30,
    padding: 24,
    backgroundColor: COLORS.netral_white,
    borderRadius: 999,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    ...FONTS.heading2,
  },
  none: {
    display: 'none',
  },
});
