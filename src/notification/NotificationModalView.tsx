import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { COLORS, FONTS, icons, SIZES } from 'common';
import { Notification, NotificationType } from 'types/notification';
import NotificationItem from './NotificationItem';
import APIManager from 'managers/APIManager';

type NotificationModalViewProps = {
  onClose?: () => void;
};

const NotificationModalView: React.FC<NotificationModalViewProps> = ({
  onClose,
}) => {
  const [data, setData] = React.useState<Notification[]>([]);

  const loadData = useCallback(async () => {
    const { response } = await APIManager.GET<Notification[]>(
      '/api/v1/notifications',
    );

    if (!response || !APIManager.isSucceed(response)) {
      return;
    }

    setData(response.data!);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePressClose = () => {
    onClose?.();
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem data={item} />
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePressClose} style={styles.overlay} />
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Thông báo</Text>
          <TouchableOpacity onPress={handlePressClose} style={styles.closeBtn}>
            <Image source={icons.close} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          showsHorizontalScrollIndicator
        />
      </View>
    </View>
  );
};

export default NotificationModalView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: '#000000',
    opacity: 0.2,
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: SIZES.width / 2,
    maxHeight: SIZES.height / 1.5,
    padding: SIZES.padding,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  title: {
    ...FONTS.title2,
    color: COLORS.netral_black,
  },
  closeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: COLORS.netral100,
    borderRadius: 999,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
});
