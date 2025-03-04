import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import axios, { CancelTokenSource } from 'axios';
import dayjs from 'dayjs';

import { COLORS, FONTS, SIZES } from 'common';
import Icon, { IconType } from 'components/Icon';
import { NewAPIManager } from 'managers/APIManager';
import { Feedback } from 'types/feedback';

const FeedbackHistoryScreen = () => {
  const [data, setData] = useState<Feedback[] | undefined>(undefined);
  const loading = useRef<boolean>(false);
  const [refreshing, setRefreshing] = useState(true);
  const cancelTokenSource = useRef<CancelTokenSource | undefined>(undefined);

  const cancelRequest = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = undefined;
    }
  }, []);

  const resetData = useCallback(() => {
    cancelRequest();
    loading.current = false;
    setData(undefined);
    setRefreshing(true);
  }, [cancelRequest]);

  const loadData = useCallback(async () => {
    if (loading.current) return;

    loading.current = true;
    cancelTokenSource.current = axios.CancelToken.source();
    const { response, error } = await NewAPIManager.GET<Feedback[]>(
      '/api/v1/feedbacks',
      undefined,
      cancelTokenSource.current?.token,
    );

    if (axios.isCancel(error)) return;

    cancelTokenSource.current = undefined;
    loading.current = false;
    if (!response || !NewAPIManager.isSucceed(response)) {
      loading.current = false;
      setRefreshing(false);
      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra',
      });
      return;
    }

    setData(response.data!);
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

  const renderRefreshControl = () => {
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={refreshData}
        tintColor={COLORS.primary200}
        colors={[COLORS.primary200]}
      />
    );
  };
  const renderListHeader = () => (
    <View style={styles.tableHead}>
      <Text style={styles.tableHeadText}>ID</Text>
      <Text style={[styles.tableHeadText, { flex: 2 }]}>Tên khách hàng</Text>
      <Text style={styles.tableHeadText}>Bàn</Text>
      <Text style={styles.tableHeadText}>Đánh giá</Text>
      <Text style={[styles.tableHeadText, { flex: 2 }]}>Nhận xét</Text>
      <Text style={[styles.tableHeadText, { flex: 2 }]}>Thời gian</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Feedback }) => {
    return (
      <View style={styles.tableRow}>
        <Text style={styles.tableRowText}>{item.id}</Text>
        <Text style={[styles.tableRowText, { flex: 2 }]}>
          {item.customerName}
        </Text>
        <Text style={styles.tableRowText}>{item.tableName}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text
            style={[styles.tableRowText, { flex: 0, marginRight: SIZES.base }]}>
            {item.rating}
          </Text>
          <Icon
            type={IconType.ION}
            name="star"
            size={20}
            color={COLORS.warning400}
          />
        </View>
        <Text style={[styles.tableRowText, { flex: 2 }]}>{item.comments}</Text>
        <Text style={[styles.tableRowText, { flex: 2 }]}>
          {dayjs(item.createdAt).format('DD-MM-YYYY hh:mm')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headText}>Lịch sử đánh giá</Text>
      <FlatList
        style={styles.table}
        data={data}
        refreshing={refreshing}
        onRefresh={refreshData}
        refreshControl={renderRefreshControl()}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderListHeader()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default FeedbackHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
  },
  headText: {
    ...FONTS.title1,
    color: COLORS.netral_black,
  },
  table: {
    flex: 1,
    backgroundColor: COLORS.netral_white,
    marginTop: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: 16,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: COLORS.netral100,
    paddingVertical: 12,
    paddingHorizontal: SIZES.padding,
    borderRadius: 8,
  },
  tableHeadText: {
    flex: 1,
    color: COLORS.netral600,
    ...FONTS.subtitle3,
    borderRadius: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: SIZES.padding,
    borderRadius: 8,
  },
  tableRowText: {
    flex: 1,
    color: COLORS.netral_black,
    ...FONTS.body3,
    borderRadius: 8,
  },
});
