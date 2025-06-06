import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import {
  NavigationState,
  SceneRendererProps,
  TabBar,
  TabDescriptor,
  TabView,
} from 'react-native-tab-view';

import { COLORS, SIZES } from 'common';
import BackButton from 'components/BackButton';
import TextButton from 'components/TextButton';

import PendingTableScene from './PendingTableScene';
import ApprovedTableScene from './ApprovedTableScene';
import CancelledTableScene from './CancelledTableScene';
import ReserveTableModalView from './ReserveTableModalView';

import APIManager from 'managers/APIManager';
import axios, { CancelTokenSource } from 'axios';
import {
  Reservation,
  ReservationStatus,
  ReserveTableInput,
} from 'types/reservation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TableStackParamList } from 'navigation/TableNavigator';
import { Socket } from 'socket.io-client';
import SocketManager from 'managers/SocketManager';
import TextUtils from 'utils/TextUtils';
import { OrderInfo } from 'types/order';
import TableQRCodeModalView from './TableQRCodeModalView';
import { useToast } from 'hooks/useToast';

const routes = [
  { key: 'Pending', title: 'Đang chờ' },
  { key: 'Approved', title: 'Đã xác nhận' },
  { key: 'Cancelled', title: 'Đã hủy' },
];

export type ReservationManagerScreenProps = NativeStackScreenProps<
  TableStackParamList,
  'TableManager'
>;

const ReservationManagerScreen: React.FC<ReservationManagerScreenProps> = ({
  navigation,
  route,
}) => {
  const socket = useRef<Socket | null>(null);
  const [index, setIndex] = useState(0);
  const [isReserveModalVisible, setIsReserveModalVisible] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo[] | undefined>(
    undefined,
  );
  const dataRef = useRef<Reservation[] | undefined>(undefined);
  const [data, setData] = useState<
    Record<ReservationStatus, Reservation[]> | undefined
  >(undefined);
  const loading = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const cancelTokenSource = useRef<CancelTokenSource | undefined>(undefined);
  const { showToast } = useToast();

  const cancelRequest = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = undefined;
    }
  }, []);

  const resetData = useCallback(() => {
    cancelRequest();
    loading.current = false;
    dataRef.current = undefined;
    setData(undefined);
    setRefreshing(true);
  }, [cancelRequest]);

  const updateData = useCallback((data: Reservation[]) => {
    dataRef.current = data;
    setData(
      data.reduce<Record<ReservationStatus, Reservation[]>>((acc, item) => {
        if (!acc[item.status]) {
          acc[item.status] = [];
        }
        acc[item.status].push(item);
        return acc;
      }, {} as Record<ReservationStatus, Reservation[]>),
    );
  }, []);

  const loadData = useCallback(async () => {
    if (loading.current) return;

    loading.current = true;
    cancelTokenSource.current = axios.CancelToken.source();
    const { response, error } = await APIManager.GET<Reservation[]>(
      '/api/v1/reservations',
      undefined,
      cancelTokenSource.current,
    );

    if (axios.isCancel(error)) return;

    cancelTokenSource.current = undefined;
    loading.current = false;
    if (!response || !APIManager.isSucceed(response)) {
      loading.current = false;
      setRefreshing(false);
      showToast('Đã có lỗi xảy ra', 'error');
      return;
    }

    updateData(response.data!);
    loading.current = false;
    setRefreshing(false);
  }, []);

  const refreshData = useCallback(async () => {
    resetData();
    await loadData();
  }, [resetData, loadData]);

  useEffect(() => {
    refreshData();

    return () => {
      cancelRequest();
    };
  }, [refreshData, cancelRequest]);

  useEffect(() => {
    socket.current = new SocketManager({ namespace: 'table' }).connect();
  }, []);

  const handlePressSearch = useCallback(
    (status: ReservationStatus, query: string) => {
      const newData = dataRef.current?.filter(
        item =>
          item.status === status &&
          (TextUtils.nonAccentVietnamese(
            item.customerName.toLowerCase(),
          ).includes(TextUtils.nonAccentVietnamese(query.toLowerCase())) ||
            item.phone.includes(query)),
      );

      setData(prevData => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          [status]: newData || [],
        };
      });
    },
    [],
  );

  const handleReserveTable = useCallback(
    async (data: ReserveTableInput) => {
      if (reserveLoading) return;

      setReserveLoading(true);
      cancelTokenSource.current = axios.CancelToken.source();
      const { response, error } = await APIManager.POST(
        '/api/v1/reservations',
        data,
        cancelTokenSource.current,
      );

      cancelTokenSource.current = undefined;
      if (!APIManager.isSucceed(response)) {
        setReserveLoading(false);
        showToast('Đã có lỗi xảy ra', 'error');
        return;
      }

      await refreshData();
      setReserveLoading(false);
      setIsReserveModalVisible(false);
      showToast('Đặt bàn thành công', 'success');
    },
    [refreshData, reserveLoading],
  );

  const handleAssignTable = useCallback(
    async (reservation: Reservation) => {
      const assignTable = async (tableIds: number[]) => {
        navigation.goBack();
        await socket.current?.emitWithAck('assign-table', {
          reservationId: reservation.id,
          tableIds,
        });

        showToast('Phân bàn thành công', 'success');
        await refreshData();
      };

      navigation.push('TableIndex', {
        reservation,
        onPressAssignTable: assignTable,
      });
    },
    [refreshData, navigation],
  );

  const handleShowInfo = useCallback(async (reservationId: number) => {
    const { response } = await APIManager.GET<OrderInfo[]>(
      `/api/v1/reservations/${reservationId}/order-info`,
    );

    if (!response || !APIManager.isSucceed(response)) {
      showToast('Đã có lỗi xảy ra', 'error');
      return;
    }

    setOrderInfo(response.data);
  }, []);

  const handlePressCloseTableQRCodeModal = useCallback(() => {
    setOrderInfo(undefined);
  }, []);

  const handleCancelReservation = useCallback(
    async (reservationId: number) => {
      await socket.current?.emitWithAck('cancel-reservation', reservationId);
      await refreshData();
    },
    [refreshData],
  );

  const handlePressOpenModal = useCallback(() => {
    setIsReserveModalVisible(true);
  }, []);

  const handlePressCloseModal = useCallback(() => {
    setIsReserveModalVisible(false);
  }, []);

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<{
        key: string;
        title: string;
      }>;
      options:
        | Record<
            string,
            TabDescriptor<{
              key: string;
              title: string;
            }>
          >
        | undefined;
    },
  ) => (
    <TabBar
      {...props}
      indicatorContainerStyle={styles.indicatorContainer}
      indicatorStyle={styles.indicator}
      activeColor={COLORS.primary500}
      inactiveColor={COLORS.netral600}
    />
  );

  const renderScene = (
    props: SceneRendererProps & {
      route: {
        key: string;
        title: string;
      };
    },
  ) => {
    switch (props.route.key) {
      case 'Pending':
        return (
          <PendingTableScene
            data={data?.[ReservationStatus.PENDING]}
            onPressSearch={handlePressSearch}
            onPressAssignTable={handleAssignTable}
            onPressCancel={handleCancelReservation}
          />
        );
      case 'Approved':
        return (
          <ApprovedTableScene
            data={data?.[ReservationStatus.COMPLETED]}
            onPressShowInfo={handleShowInfo}
            onPressSearch={handlePressSearch}
            onPressCancel={handleCancelReservation}
          />
        );
      case 'Cancelled':
        return (
          <CancelledTableScene
            data={data?.[ReservationStatus.CANCELED]}
            onPressSearch={handlePressSearch}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Hệ thống bàn ăn" />
        <TextButton label="Đặt bàn ăn" onPress={handlePressOpenModal} />
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
      <Suspense>
        <Modal
          animationType="fade"
          transparent
          visible={isReserveModalVisible}
          supportedOrientations={['landscape']}>
          <ReserveTableModalView
            onPressClose={handlePressCloseModal}
            onPressReserve={handleReserveTable}
          />
        </Modal>
        <Modal
          animationType="fade"
          transparent
          visible={!!orderInfo}
          supportedOrientations={['landscape']}>
          <TableQRCodeModalView
            data={orderInfo}
            onPressClose={handlePressCloseTableQRCodeModal}
          />
        </Modal>
      </Suspense>
    </View>
  );
};

export default ReservationManagerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.netral100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: SIZES.padding,
    backgroundColor: COLORS.netral_white,
  },
  indicatorContainer: {
    backgroundColor: COLORS.netral_white,
  },
  indicator: {
    backgroundColor: COLORS.primary500,
  },
});
