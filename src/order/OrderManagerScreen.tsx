import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { COLORS, FONTS, SIZES } from 'common';
import { Order, OrderStatus } from 'types/order';
import axios, { CancelTokenSource } from 'axios';
import APIManager from 'managers/APIManager';
import OrderItem from './OrderItem';
import StatusSelectButton from './StatusSelectButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrderStackParamList } from 'navigation/OrderNavigator';

const MemoOrderItem = memo(OrderItem);

type OrderManagerScreenProps = NativeStackScreenProps<
  OrderStackParamList,
  'OrderManager'
>;

const OrderManagerScreen: React.FC<OrderManagerScreenProps> = ({
  navigation,
}) => {
  const [statusSelected, setStatusSelected] = useState<OrderStatus>(
    OrderStatus.ALL,
  );
  const dataRef = useRef<Order[] | undefined>(undefined);
  const [data, setData] = useState<Order[] | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(true);
  const loading = useRef(false);
  const cancelTokenSource = useRef<CancelTokenSource | undefined>(undefined);

  const cancelRequest = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = undefined;
    }
  }, []);

  const updateData = useCallback((status: OrderStatus) => {
    if (!dataRef.current) return;

    if (status === OrderStatus.ALL) {
      setData(dataRef.current);
      return;
    }

    setData(dataRef.current?.filter(item => item.status === status));
  }, []);

  const loadData = useCallback(async () => {
    if (loading.current) return;

    loading.current = true;
    cancelTokenSource.current = axios.CancelToken.source();
    const { response, error } = await APIManager.GET<Order[]>(
      '/api/v1/orders',
    );

    if (axios.isCancel(error)) return;

    cancelTokenSource.current = undefined;
    loading.current = false;

    if (!response || !APIManager.isSucceed(response)) {
      loading.current = false;
      setRefreshing(false);

      return;
    }
    dataRef.current = response.data;
    updateData(statusSelected);
    setRefreshing(false);
    loading.current = false;
  }, []);

  const resetData = useCallback(() => {
    cancelRequest();
    loading.current = false;
    setData(undefined);
    setRefreshing(true);
  }, [cancelRequest]);

  const refreshData = useCallback(async () => {
    resetData();
    await loadData();
  }, [resetData, loadData]);

  useEffect(() => {
    refreshData();
    return () => {
      cancelRequest();
    };
  }, [cancelRequest, refreshData]);

  const handlePressStatus = (status: OrderStatus) => {
    setStatusSelected(status);
    updateData(status);
  };

  const handlePress = useCallback(
    (id: string) => {
      navigation.navigate('OrderDetail', {
        orderId: id,
      });
    },
    [navigation],
  );

  const renderItem = ({ item }: { item: Order }) => {
    return <MemoOrderItem order={item} onPress={handlePress} />;
  };

  const renderRefreshControl = () => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={refreshData}
      colors={[COLORS.primary500]}
      tintColor={COLORS.primary500}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.textHead}>Quản lý đơn hàng</Text>
        <View style={styles.statusSelectContainer}>
          <StatusSelectButton
            status={OrderStatus.ALL}
            selectedStatus={statusSelected}
            onPress={handlePressStatus}
            label="Tất cả"
          />
          <StatusSelectButton
            status={OrderStatus.ORDERING}
            selectedStatus={statusSelected}
            onPress={handlePressStatus}
            label="Đang đặt món"
          />
          <StatusSelectButton
            status={OrderStatus.COMPLETED}
            selectedStatus={statusSelected}
            onPress={handlePressStatus}
            label="Đã hoàn tất"
          />
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.gap}
        columnWrapperStyle={styles.gap}
        numColumns={3}
        refreshControl={renderRefreshControl()}
        refreshing={refreshing}
        onRefresh={refreshData}
        data={data}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.backgroundPrimary,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  textHead: {
    ...FONTS.heading2,
  },
  statusSelectContainer: {
    flexDirection: 'row',
    gap: SIZES.radius,
  },
  gap: {
    gap: SIZES.radius,
  },
});

export default OrderManagerScreen;
