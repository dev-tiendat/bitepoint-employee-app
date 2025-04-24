import React, { memo, useCallback, useEffect, useReducer, useRef } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Socket } from 'socket.io-client';

import { COLORS, FONTS, SIZES } from 'common';
import SocketManager from 'managers/SocketManager';
import APIManager from 'managers/APIManager';
import { MenuItem, OrderItemStatus } from 'types/order';
import OrderMenuItem from './OrderMenuItem';

const MemoOrderMenuItem = memo(OrderMenuItem);

type State = {
  orderedData: MenuItem[];
  preparingData: MenuItem[];
  readyData: MenuItem[];
  servedData: MenuItem[];
};

type Action =
  | {
      type: 'SET_DATA';
      payload: {
        ordered: MenuItem[];
        preparing: MenuItem[];
        ready: MenuItem[];
        served: MenuItem[];
      };
    }
  | { type: 'ADD_ITEM'; payload: { status: keyof State; item: MenuItem } }
  | { type: 'REMOVE_ITEM'; payload: { status: keyof State; item: MenuItem } }
  | { type: 'UPDATE_ITEM'; payload: { status: keyof State; item: MenuItem } };

const initialState: State = {
  orderedData: [],
  preparingData: [],
  readyData: [],
  servedData: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        orderedData: action.payload.ordered,
        preparingData: action.payload.preparing,
        readyData: action.payload.ready,
        servedData: action.payload.served,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        [action.payload.status]: [
          ...state[action.payload.status],
          action.payload.item,
        ],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        [action.payload.status]: state[action.payload.status].filter(
          i => i.id !== action.payload.item.id,
        ),
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        [action.payload.status]: [
          action.payload.item,
          ...state[action.payload.status].filter(
            i => i.id !== action.payload.item.id,
          ),
        ],
      };
    default:
      return state;
  }
};

const OrderTrackingScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const socket = useRef<Socket | null>(null);

  const loadData = useCallback(async () => {
    const { response } = await APIManager.GET<MenuItem[]>(
      '/api/v1/orders/order-items',
    );

    if (!response || !APIManager.isSucceed(response)) {
      return;
    }

    if (response.data) {
      const data = response.data;
      const ordered = data.filter(i => i.status === OrderItemStatus.ORDERED);
      const preparing = data.filter(
        i => i.status === OrderItemStatus.PREPARING,
      );
      const ready = data.filter(i => i.status === OrderItemStatus.READY);
      const served = data.filter(i => i.status === OrderItemStatus.SERVED);

      dispatch({
        type: 'SET_DATA',
        payload: { ordered, preparing, ready, served },
      });
    }
  }, []);

  const handleOrderItemUpdate = useCallback(
    (data: MenuItem | MenuItem[]) => {
      if (Array.isArray(data)) {
        data.forEach(item => {
          dispatch({
            type: 'ADD_ITEM',
            payload: { status: 'orderedData', item },
          });
        });
        return;
      }

      const { status } = data;

      if (status === OrderItemStatus.CANCELLED) {
        ['orderedData', 'preparingData', 'readyData', 'servedData'].forEach(
          s => {
            dispatch({
              type: 'REMOVE_ITEM',
              payload: { status: s as keyof State, item: data },
            });
          },
        );
        return;
      }

      const updateOrAddItem = (status: keyof State) => {
        dispatch({
          type: 'UPDATE_ITEM',
          payload: { status, item: data },
        });
      };

      switch (status) {
        case OrderItemStatus.ORDERED:
          updateOrAddItem('orderedData');
          break;
        case OrderItemStatus.PREPARING:
          dispatch({
            type: 'REMOVE_ITEM',
            payload: { status: 'orderedData', item: data },
          });
          updateOrAddItem('preparingData');
          break;
        case OrderItemStatus.READY:
          dispatch({
            type: 'REMOVE_ITEM',
            payload: { status: 'preparingData', item: data },
          });
          updateOrAddItem('readyData');
          break;
        case OrderItemStatus.SERVED:
          dispatch({
            type: 'REMOVE_ITEM',
            payload: { status: 'readyData', item: data },
          });
          updateOrAddItem('servedData');
          break;
      }
    },
    [dispatch],
  );

  useEffect(() => {
    loadData();

    socket.current = new SocketManager({ namespace: 'order' }).connect();
    socket.current.on('order-item-update', handleOrderItemUpdate);

    return () => {
      socket.current?.disconnect();
    };
  }, [loadData, handleOrderItemUpdate]);

  const handlePressDone = useCallback((item: MenuItem) => {
    socket.current?.emit('next-step-order-item', {
      orderId: item.orderId,
      orderItemId: item.id,
    });
  }, []);

  const handlePressNote = useCallback((item: MenuItem) => {
    Alert.alert('Ghi chú', item.note || 'Không có ghi chú');
  }, []);

  const renderItem = ({ item }: { item: MenuItem }) => (
    <MemoOrderMenuItem
      data={item}
      onPressDone={handlePressDone}
      onPressNote={handlePressNote}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.textHead}>Theo dõi đơn hàng</Text>
      </View>

      <ScrollView
        style={styles.orderBoard}
        horizontal
        showsHorizontalScrollIndicator={false}>
        <View style={styles.column}>
          <Text style={styles.columnText}>
            Đang đặt món ({state.orderedData.length})
          </Text>
          <Text style={styles.subText}>Khách hàng đã đặt món ăn</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.list}
            keyExtractor={(_, index) => `draggable-item-${index}`}
            data={state.orderedData}
            renderItem={renderItem}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.columnText}>
            Đang chuẩn bị ({state.preparingData.length})
          </Text>
          <Text style={styles.subText}>Món ăn đang trong quá trình nấu</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.list}
            keyExtractor={(_, index) => `draggable-item-${index}`}
            data={state.preparingData}
            renderItem={renderItem}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.columnText}>
            Đã hoàn thành ({state.readyData.length})
          </Text>
          <Text style={styles.subText}>
            Món ăn đã được nấu xong, nhân viên có thể mang ra
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.list}
            keyExtractor={(_, index) => `draggable-item-${index}`}
            data={state.readyData}
            renderItem={renderItem}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.columnText}>
            Đã phục vụ ({state.servedData.length})
          </Text>
          <Text style={styles.subText}>
            Món ăn đã được mang ra bàn, khách đã nhận
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.list}
            keyExtractor={(item, index) => `draggable-item-${index}`}
            data={state.servedData}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderTrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    paddingRight: 0,
    backgroundColor: COLORS.backgroundPrimary,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textHead: {
    ...FONTS.heading2,
  },
  subText: {
    ...FONTS.body4,
    marginLeft: SIZES.padding,
    color: COLORS.netral600,
  },
  orderBoard: {},
  column: {
    width: SIZES.width / 3,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
    marginRight: SIZES.padding,
  },
  columnText: {
    ...FONTS.title2,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.base,
  },
  list: {
    marginTop: SIZES.base,
    paddingTop: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
});
