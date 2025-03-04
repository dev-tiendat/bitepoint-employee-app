import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Notification } from 'types/notification';
import { COLORS, FONTS, icons, SIZES } from 'common';
import DateUtils from 'utils/DateUtils';

interface NotificationItemProps {
  data: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ data }) => {
  const type = data.type.split('.')[0];

  const getIcon = () => {
    switch (type) {
      case 'order':
        return icons.order;
      case 'payment':
        return icons.money_icon;
      case 'reservation':
        return icons.timer_icon;
      default:
        return icons.table_icon;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'order':
        return COLORS.primary500;
      case 'payment':
        return COLORS.success800;
      case 'reservation':
        return COLORS.warning700;
      default:
        return COLORS.danger500;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'order':
        return COLORS.secondary200;
      case 'payment':
        return COLORS.success100;
      case 'reservation':
        return COLORS.warning100;
      default:
        return COLORS.danger200;
    }
  };

  return (
    <View style={[styles.container, data.readAt ? styles.read : styles.unread]}>
      <View style={[styles.iconContainer, { backgroundColor: getBackgroundColor() }]}>
        <Image source={getIcon()} style={[styles.icon, { tintColor: getTypeColor() }]} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: getTypeColor() }]}>{data.title}</Text>
          <Text style={styles.date}>{DateUtils.timeAgo(data.createdAt)}</Text>
        </View>
        <Text style={styles.message}>{data.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    flexDirection: 'row',
    backgroundColor: COLORS.netral_white,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding,
    borderRadius: 999,
    padding: SIZES.radius,
  },
  icon: {
    width: 35,
    height: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  title: {
    ...FONTS.title3,
  },
  date: {
    ...FONTS.body4,
    color: COLORS.netral600,
  },
  message: {
    ...FONTS.body3,
    color: COLORS.netral_black,
  },
  unread: {
    backgroundColor: COLORS.secondary100,
  },
  read: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.netral600,
  },
});

export default NotificationItem;