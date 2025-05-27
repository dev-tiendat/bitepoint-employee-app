import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { COLORS, FONTS, SIZES } from 'common';
import Table, { Column } from 'components/Table';
import APIManager from 'managers/APIManager';
import { UserLoginLog } from 'types/user';
import { Pagination, PaginationMeta, SortOrder } from 'types/api';
import axios, { CancelTokenSource } from 'axios';
import DateUtils from 'utils/DateUtils';

const columns: Column[] = [
  {
    label: 'IP',
    dataIndex: 'ip',
    sortable: true,
  },
  {
    label: 'Địa chỉ',
    dataIndex: 'address',
  },
  {
    label: 'OS',
    dataIndex: 'os',
  },
  {
    label: 'Trình duyệt',
    dataIndex: 'browser',
  },
  {
    label: 'Thời gian',
    dataIndex: 'time',
    sortable: true,
  },
];

const pageSizeOptions: number[] = [5, 10, 15, 20, 25, 30];

type HistoryLoginProps = {
  style?: StyleProp<ViewStyle>;
};

const HistoryLogin: React.FC<HistoryLoginProps> = ({ style }) => {
  const [data, setData] = useState<UserLoginLog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState<{
    sortBy: string;
    order: SortOrder;
  }>({ sortBy: 'time', order: SortOrder.DESC });
  const loading = useRef(false);
  const cancelTokenSource = useRef<CancelTokenSource | undefined>(undefined);

  const cancelToken = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = undefined;
    }
  }, []);

  const updateData = useCallback((data: UserLoginLog[]) => {
    const newData = data.map(item => {
      return {
        ...item,
        time: DateUtils.formatToDateTime(item.time),
      };
    });
    setData(newData);
  }, []);

  const loadData = useCallback(
    async (
      newPage: number,
      newLimit: number,
      newField: string,
      newOrder: SortOrder,
    ) => {
      if (loading.current) return;

      loading.current = true;
      cancelTokenSource.current = axios.CancelToken.source();
      const { response, error } = await APIManager.GET<
        Pagination<UserLoginLog>
      >(
        '/api/v1/account/login-logs',
        { page: newPage, limit: newLimit, field: newField, order: newOrder },
        cancelTokenSource.current.token,
      );

      if (axios.isCancel(error)) return;

      cancelTokenSource.current = undefined;
      if (!response || !APIManager.isSucceed(response)) {
        loading.current = false;

        return;
      }

      loading.current = false;
      cancelTokenSource.current = undefined;
      updateData(response.data!.items);
      setMeta(response.data!.meta);
    },
    [updateData],
  );

  useEffect(() => {
    loadData(page, limit, sort.sortBy, sort.order);

    return cancelToken;
  }, [loadData, cancelToken]);

  const handlePressPage = useCallback(
    async (index: number) => {
      if (index === page || index < 1) return;

      setPage(index);

      await loadData(index, limit, sort.sortBy, sort.order);
    },
    [limit, loadData, page],
  );

  const handleChangeLimit = useCallback(
    async (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);

      await loadData(1, newLimit, sort.sortBy, sort.order);
    },
    [loadData],
  );

  const handleSort = useCallback(
    (field: string) => {
      if (field === sort.sortBy) {
        const nextSort =
          sort.sortBy === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
        setSort({
          sortBy: field,
          order: nextSort,
        });
        loadData(page, limit, field, nextSort);
      }

      setSort({
        sortBy: field,
        order: SortOrder.DESC,
      });
      loadData(page, limit, field, SortOrder.DESC);
    },
    [sort, loadData, page, limit],
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Lịch sử đăng nhập</Text>
      <Table
        limit={limit}
        currentPage={page}
        sortBy={sort.sortBy}
        order={sort.order}
        onSort={handleSort}
        pageSizeOptions={pageSizeOptions}
        columns={columns}
        data={data}
        totalPages={meta?.totalPages}
        onPageChange={handlePressPage}
        onChangeLimit={handleChangeLimit}
      />
    </View>
  );
};

export default HistoryLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.netral_white,
  },
  title: {
    ...FONTS.title2,
    color: COLORS.netral_black,
    marginBottom: SIZES.padding,
  },
});
