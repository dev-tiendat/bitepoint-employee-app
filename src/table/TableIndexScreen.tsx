import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios, { CancelTokenSource } from 'axios';
import { io, Socket } from 'socket.io-client';

import { COLORS } from 'common/theme';
import APIManager from 'managers/APIManager';
import SocketManager from 'managers/SocketManager';
import { AppStackParamList } from 'navigation/AppNavigator';
import { OrderInfo } from 'types/order';
import {
  FindTable,
  Table,
  TableHome,
  TableStatus,
  TableZone,
} from 'types/table';

import { useAppDispatch } from 'store/hooks';

import TableZoneHorizontalList from './TableZoneView';
import TableListView from './TableListView';
import { SocketResponseData } from 'types/api';
import { TableStackParamList } from 'navigation/TableNavigator';
import { isNil, set } from 'lodash';
import ConfirmCleanTableModalView from './ConfirmCleanTableModalView';

export type TableIndexScreenProps = NativeStackScreenProps<
  TableStackParamList,
  'TableIndex'
>;

const TableIndexScreen: React.FC<TableIndexScreenProps> = ({
  navigation,
  route,
}) => {
  const { reservation, onPressAssignTable } = route.params || {};
  const socket = useRef<Socket | null>(null);
  const [zoneData, setZoneData] = useState<TableZone[] | undefined>(undefined);
  const [tableData, setTableData] = useState<
    Record<number, Table[]> | undefined
  >(undefined);
  const loading = useRef<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const cancelTokenSource = useRef<CancelTokenSource | undefined>(undefined);
  const [showConfirmCleanTableModal, setShowConfirmCleanTableModal] =
    useState<boolean>(false);
  const [selectedZoneId, setSelectedZoneId] = useState<number | undefined>(
    undefined,
  );
  const [selectedTables, setSelectedTables] = useState<Table[]>([]);
  const currentTableData = useMemo(
    () =>
      tableData && selectedZoneId !== undefined
        ? tableData[selectedZoneId] || []
        : [],
    [tableData, selectedZoneId],
  );

  const updateData = useCallback((newData: TableHome[]) => {
    const zoneMap: Record<number, Table[]> = {};
    const zoneData: TableZone[] = [];

    newData.forEach(tableHome => {
      zoneData.push({
        id: tableHome.id,
        name: tableHome.name,
      });
      zoneMap[tableHome.id] = tableHome.tables || [];
    });

    setZoneData(zoneData);
    setTableData(zoneMap);
  }, []);

  const loadData = useCallback(async () => {
    if (loading.current) return;

    cancelTokenSource.current = axios.CancelToken.source();
    loading.current = true;
    const { response, error } = await APIManager.GET<TableHome[]>(
      `/api/v1/table-zones/tables`,
      undefined,
      cancelTokenSource.current.token,
    );

    if (axios.isCancel(error)) return;
    cancelTokenSource.current = undefined;

    if (!response || !APIManager.isSucceed(response)) {
      loading.current = false;
      setRefreshing(false);

      return;
    }
    updateData(response.data!);
    setRefreshing(false);
    loading.current = false;
  }, [updateData]);

  const cancelRequest = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = undefined;
    }
  }, []);

  const resetData = useCallback(() => {
    cancelRequest();
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

  const handleTableStatusChange = useCallback((data: Table[]) => {
    setTableData(prev => {
      const newData = { ...prev };
      for (const key in newData) {
        newData[key] = newData[key].map(table => {
          const updatedTable = data.find(item => item.id === table.id);
          if (!updatedTable) return table;

          return { ...table, status: updatedTable.status };
        });
      }

      return newData;
    });
  }, []);

  useEffect(() => {
    socket.current = new SocketManager({ namespace: 'table' }).connect();

    socket.current.on('table-status-change', handleTableStatusChange);
    return () => {
      socket.current?.disconnect();
    };
  }, [handleTableStatusChange]);

  const handlePressZoneItem = useCallback((id: number) => {
    setSelectedZoneId(id);
  }, []);

  const handlePressTableItem = useCallback(
    (id: number) => {
      const table = currentTableData.find(table => table.id === id);
      if (!table) return;

      if (onPressAssignTable || table.status === TableStatus.CLEANING) {
        setSelectedTables(prev => {
          const index = prev.findIndex(item => item.id === id);
          if (index === -1) {
            return [...prev, table];
          }

          return prev.filter(item => item.id !== id);
        });

        if (table.status === TableStatus.CLEANING) {
          setShowConfirmCleanTableModal(true);
          return;
        }
      }
    },
    [currentTableData, onPressAssignTable],
  );

  const handleConfirmCleanTable = useCallback(async () => {
    if (selectedTables.length === 0) return;

    socket.current?.emit('clean-table', selectedTables[0].id);
    setShowConfirmCleanTableModal(false);
    setSelectedTables([]);
  }, [selectedTables]);

  const handleCloseCleanTableModal = useCallback(() => {
    setShowConfirmCleanTableModal(false);
    setSelectedTables([]);
  }, []);

  const handlePressConfirm = useCallback(async () => {
    const selectedTableIds = selectedTables.map(table => table.id);

    await onPressAssignTable?.(selectedTableIds);
  }, [selectedTables]);

  const handleGoToTableManagerScreen = useCallback(() => {
    navigation.navigate('TableManager');
  }, []);

  return (
    <View style={styles.container}>
      <TableZoneHorizontalList
        showAction={isNil(route.params)}
        data={zoneData}
        onPressGoToTableManager={handleGoToTableManagerScreen}
        onPressItem={handlePressZoneItem}
        selectedZoneId={selectedZoneId}
      />
      <TableListView
        info={reservation}
        data={currentTableData}
        isAssignTable={!!onPressAssignTable}
        selectedTables={selectedTables}
        onPressItem={handlePressTableItem}
        onPressConfirm={handlePressConfirm}
      />
      <Suspense>
        <Modal
          animationType="fade"
          transparent={true}
          visible={showConfirmCleanTableModal}
          supportedOrientations={['landscape']}>
          <ConfirmCleanTableModalView
            onPressClose={handleCloseCleanTableModal}
            onPressConfirm={handleConfirmCleanTable}
          />
        </Modal>
      </Suspense>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.netral100,
  },
});

export default TableIndexScreen;
