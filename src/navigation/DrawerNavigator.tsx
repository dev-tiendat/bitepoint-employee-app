import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';

import HomeScreen from 'home/HomeScreen';
import NotificationModalView from 'notification/NotificationModalView';
import FeedbackHistoryScreen from 'feedback/FeedbackHistoryScreen';

import DrawerContent from './DrawerContent';
import TableNavigator, { TableStackParamList } from './TableNavigator';
import OrderNavigator from './OrderNavigator';

import { useAppSelector } from 'store/hooks';
import { selectIsMinimizedMenu } from 'store/device/deviceSelector';

import { IconType } from 'components/Icon';
import { Menu } from 'types/menu';

export type DrawerParamList = {
  Home: undefined;
  Order: undefined;
  Table: NavigatorScreenParams<TableStackParamList>;
  Notification: undefined;
  Feedback: undefined;
};

export const DATA: Menu[] = [
  {
    name: 'Trang chủ',
    routeName: 'Home',
    iconType: IconType.ION,
    icon: 'home-outline',
  },
  {
    name: 'Đơn hàng',
    routeName: 'Order',
    iconType: IconType.ION,
    icon: 'fast-food-outline',
    children: [
      {
        name: 'Quản lý đơn hàng',
        routeName: 'OrderManager',
        iconType: IconType.ION,
        icon: 'list-outline',
      },
      {
        name: 'Theo dõi đơn hàng',
        routeName: 'OrderTracking',
        iconType: IconType.ION,
        icon: 'time-outline',
      },
    ],
  },
  {
    name: 'Bàn ăn',
    routeName: 'Table',
    iconType: IconType.MATERIAL,
    icon: 'table-bar',
  },
  {
    name: 'Thông báo',
    routeName: 'Notification',
    iconType: IconType.ION,
    icon: 'notifications-outline',
  },
  {
    name: 'Đánh giá',
    routeName: 'Feedback',
    iconType: IconType.ION,
    icon: 'star-outline',
  },
];

export const SCREENS = {
  Home: HomeScreen,
  Order: OrderNavigator,
  Table: TableNavigator,
  Notification: NotificationModalView,
  Feedback: FeedbackHistoryScreen,
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = (): React.ReactElement => {
  const isMinimizedMenu = useAppSelector(selectIsMinimizedMenu);

  const renderDrawerContent = (props: DrawerContentComponentProps) => {
    const filterData = DATA.filter(menu => {
      const routeName = menu.routeName as keyof DrawerParamList;
      const isScreenExist = SCREENS[routeName];

      return isScreenExist;
    });

    return <DrawerContent {...props} data={filterData} />;
  };

  const renderDrawerScreen = (menu: Menu) => {
    const routeName = menu.routeName as keyof DrawerParamList;
    const Component = SCREENS[routeName] as React.ComponentType;

    if (!Component) return null;

    return (
      <Drawer.Screen key={routeName} name={routeName} component={Component} />
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: 'permanent',
        drawerStyle: { width: isMinimizedMenu ? 100 : 300 },
      }}>
      {DATA.map(renderDrawerScreen)}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
