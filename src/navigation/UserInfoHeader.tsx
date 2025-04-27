import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { COLORS, FONTS, PROPS, SIZES } from 'common';
import Icon, { IconType } from 'components/Icon';
import { AuthLogin } from 'types/auth';

type UserInfoHeaderProps = {
  user?: AuthLogin;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const AVATAR_SIZE = 70;

const UserInfoHeader: React.FC<UserInfoHeaderProps> = ({
  user,
  onPress,
  style,
}) => {
  const handlePress = () => {
    onPress?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={PROPS.touchable_active_opacity}
      onPress={handlePress}
      style={[styles.container, style]}>
      {user?.avatar ? (
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      ) : (
        <Icon
          type={IconType.ION}
          name="person-circle"
          size={AVATAR_SIZE}
          color={COLORS.netral300}
        />
      )}
      <View>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="clip">
          {user?.fullName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserInfoHeader;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  name: {
    marginLeft: SIZES.base,
    marginTop: SIZES.base / 2,
    color: COLORS.netral_black,
    ...FONTS.heading3,
  },
});
