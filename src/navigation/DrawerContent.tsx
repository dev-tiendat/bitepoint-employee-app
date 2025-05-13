import React, { Suspense, useLayoutEffect, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { isEmpty } from 'lodash';

import Icon, { IconType } from 'components/Icon';
import UserInfoHeader from './UserInfoHeader';
import NotificationModalView from 'notification/NotificationModalView';

import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectUserInfo } from 'store/user/userSelector';
import { logout } from 'store/user/userSlice';
import { selectIsMinimizedMenu } from 'store/device/deviceSelector';
import { toggleSideBar } from 'store/device/deviceSlice';

import { COLORS, COMMON_STYLES, FONTS, PROPS, SIZES } from 'common';
import APIManager from 'managers/APIManager';
import { Menu } from 'types/menu';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import AlertUtils from 'utils/AlertUtils';
import UserManager from 'managers/UserManager';

type DrawerItemProps = {
  data: Menu;
  focused?: boolean;
  hideName?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: (
    routeName: string,
    isChild?: boolean,
    routeRootName?: string,
  ) => void;
};

const DRAWER_ITEM_MARGIN = 10;

const TOGGLE_BUTTON_ICON_SIZE = 25;
const TOGGLE_BUTTON_PADDING = 5;

const DrawerItem: React.FC<DrawerItemProps> = ({
  data,
  focused,
  style,
  hideName,
  onPress,
}) => {
  const { icon, iconType, name, routeName, children } = data;
  const isMinimizedMenu = useAppSelector(selectIsMinimizedMenu);
  const [isOpened, setIsOpened] = React.useState(false);
  const [focusedRoute, setFocusedRoute] = React.useState<string | undefined>(
    undefined,
  );
  const heightItem = useRef(0);
  const isActive =
    focused && (isEmpty(children) || isMinimizedMenu || !isOpened);
  const animatedHeight = useSharedValue(0);
  const animatedOpacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: animatedOpacity.value,
    overflow: 'hidden',
  }));

  useEffect(() => {
    if (isOpened && isMinimizedMenu) {
    }
    const maxItemHeight =
      (heightItem.current + DRAWER_ITEM_MARGIN) *
      (children ? children.length : 0);
    animatedHeight.value = withTiming(
      isOpened && !isMinimizedMenu ? maxItemHeight : 0,
    );
    animatedOpacity.value = withTiming(isOpened && !isMinimizedMenu ? 1 : 0);
  }, [isOpened, isMinimizedMenu, children]);

  const toggleDrawer = () => {
    setIsOpened(!isOpened);
  };

  const handlePress = (currentItem: Menu, isChild?: boolean) => {
    if (!isEmpty(currentItem.children)) {
      if (isMinimizedMenu && focusedRoute) {
        onPress?.(focusedRoute, true, routeName);
      } else {
        toggleDrawer();
      }
      return;
    }

    setFocusedRoute(currentItem.routeName);
    onPress?.(currentItem.routeName, isChild, routeName);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    if (isEmpty(children)) return;

    const { height } = event.nativeEvent.layout;
    heightItem.current = height;
  };

  const renderChildItem = (item: Menu, index: number) => {
    return (
      <DrawerItem
        focused={item.routeName === focusedRoute && focused}
        key={`${item.routeName}-${index}`}
        data={item}
        onPress={() => handlePress(item, true)}
      />
    );
  };

  return (
    <View>
      <TouchableOpacity
        onLayout={handleLayout}
        activeOpacity={PROPS.touchable_active_opacity}
        onPress={() => handlePress(data)}
        style={[styles.drawerItem, style, isActive && styles.drawerItemActive]}>
        <Icon
          type={iconType}
          name={icon}
          size={30}
          color={isActive ? COLORS.primary500 : COLORS.netral600}
        />
        {!hideName && (
          <>
            <Text
              style={[styles.name, isActive && styles.nameActive]}
              numberOfLines={1}
              ellipsizeMode="clip">
              {name}
            </Text>
            {!isEmpty(children) && (
              <View style={styles.dropdown}>
                <Icon
                  type={IconType.ION}
                  name={
                    !isOpened ? 'chevron-down-outline' : 'chevron-up-outline'
                  }
                  size={20}
                  color={COLORS.netral600}
                />
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
      <Animated.View style={[styles.childrenContainer, animatedStyle]}>
        {children?.map(renderChildItem)}
      </Animated.View>
    </View>
  );
};

type DrawerContentProps = DrawerContentComponentProps & {
  data: Menu[];
};

const DrawerContent = ({ data, state, navigation }: DrawerContentProps) => {
  const [showNotification, setShowNotification] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserInfo);
  const isMinimizedMenu = useAppSelector(selectIsMinimizedMenu);

  const handlePressToggleMenu = () => {
    dispatch(toggleSideBar());
  };

  const handlePressItem = (
    routeName: string,
    isChild = false,
    rootRoute?: string,
  ) => {
    if (isChild) {
      if (!rootRoute) return;

      navigation.navigate(rootRoute, { screen: routeName });
      return;
    }

    if (rootRoute === 'Notification') {
      setShowNotification(true);
      return;
    }

    navigation.navigate(routeName);
  };

  const handlePressLogout = () => {
    AlertUtils.showCustom({
      title: 'Đăng xuất',
      description: 'Bạn có chắc chắn muốn đăng xuất?',
      actions: [
        {
          label: 'Hủy',
          style: 'cancel',
        },
        {
          label: 'Đăng xuất',
          onPress: UserManager.signOut,
          style: 'destructive',
        },
      ],
    });
  };

  const handlePressProfile = () => {
    navigation.navigate('ProfileNavigator');
  };

  const renderItem = ({ item, index }: { item: Menu; index: number }) => {
    return (
      <DrawerItem
        data={item}
        focused={navigation.isFocused() && state.index === index}
        hideName={isMinimizedMenu}
        onPress={handlePressItem}
      />
    );
  };

  const renderListHeaderComponent = () => (
    <UserInfoHeader
      user={user}
      onPress={handlePressProfile}
      style={[styles.listHeader, isMinimizedMenu && styles.hidden]}
    />
  );

  const renderListFooterComponent = () => (
    <TouchableOpacity
      activeOpacity={PROPS.touchable_active_opacity}
      onPress={handlePressLogout}
      style={[styles.drawerItem, styles.logout]}>
      <Icon
        type={IconType.ION}
        name="log-out-outline"
        size={30}
        color={COLORS.danger500}
      />
      {!isMinimizedMenu && (
        <Text
          style={[styles.name, styles.logoutName]}
          numberOfLines={1}
          ellipsizeMode="clip">
          Đăng xuất
        </Text>
      )}
    </TouchableOpacity>
  );

  const keyExtractor = (item: Menu) => item.routeName;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.drawerToggleButton}
        activeOpacity={PROPS.touchable_active_opacity}
        onPress={handlePressToggleMenu}>
        <Icon
          type={IconType.ION}
          name={
            isMinimizedMenu ? 'chevron-forward-outline' : 'chevron-back-outline'
          }
          size={TOGGLE_BUTTON_ICON_SIZE}
          color={COLORS.netral_black}
        />
      </TouchableOpacity>
      <FlatList
        data={data}
        renderItem={renderItem}
        style={[styles.list]}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderListHeaderComponent}
        ListFooterComponent={renderListFooterComponent}
      />
      <Suspense fallback={null}>
        <Modal
          animationType="fade"
          transparent={true}
          supportedOrientations={['landscape']}
          visible={showNotification}>
          <NotificationModalView onClose={() => setShowNotification(false)} />
        </Modal>
      </Suspense>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.netral_white,
  },
  drawerToggleButton: {
    position: 'absolute',
    top: 100,
    right: 0,
    transform: [
      { translateX: (TOGGLE_BUTTON_ICON_SIZE + TOGGLE_BUTTON_PADDING) / 2 },
    ],
    zIndex: 1,
    padding: TOGGLE_BUTTON_PADDING,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.netral_white,
    ...COMMON_STYLES.shadow,
  },
  list: {
    paddingHorizontal: SIZES.base,
    minHeight: SIZES.height,
    backgroundColor: COLORS.netral_white,
  },
  listHeader: {
    marginBottom: SIZES.padding,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding / 2,
    marginTop: DRAWER_ITEM_MARGIN,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    backgroundColor: 'transparent',
  },
  name: {
    marginLeft: 10,
    color: COLORS.netral600,
    overflow: 'hidden',
    ...FONTS.subtitle3,
  },
  nameActive: {
    color: COLORS.primary500,
  },
  dropdown: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: SIZES.base,
  },
  childrenContainer: {
    marginLeft: SIZES.padding,
    paddingLeft: SIZES.base,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.netral300,
  },
  drawerItemActive: {
    backgroundColor: COLORS.secondary100,
  },
  logout: {
    borderTopColor: COLORS.netral200,
    borderTopWidth: 1,
  },
  logoutName: {
    color: COLORS.danger500,
  },
  hidden: {
    opacity: 0,
  },
});

export default DrawerContent;
