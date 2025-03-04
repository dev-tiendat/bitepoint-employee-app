import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { DrawerParamList } from 'navigation/DrawerNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios, { CancelTokenSource } from 'axios';

import { Statistics } from 'types/home';
import { COLORS, icons, SIZES } from 'common';
import { NewAPIManager } from 'managers/APIManager';
import PriceUtils from 'utils/PriceUtils';
import { useAppSelector } from 'store/hooks';
import { selectUserInfo } from 'store/user/userSelector';
import PopularDishes from './PopularDishes';
import Greetings from './Greetings';
import HomeReservations from './HomeReservations';

import StatsCard from './StatsCard';

type HomeScreenProps = NativeStackScreenProps<DrawerParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const user = useAppSelector(selectUserInfo);
  const [data, setData] = useState<Statistics | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(true);
  const loading = useRef(false);
  const cancelTokenSource = useRef<CancelTokenSource | undefined>(undefined);

  const cancelRequest = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = undefined;
    }
  }, []);

  const loadData = useCallback(async () => {
    if (loading.current) return;

    loading.current = true;
    cancelTokenSource.current = axios.CancelToken.source();
    const { response, error } = await NewAPIManager.GET<Statistics>(
      '/api/v1/statistics',
    );

    if (axios.isCancel(error)) return;

    cancelTokenSource.current = undefined;
    loading.current = false;

    if (!response || !NewAPIManager.isSucceed(response)) {
      loading.current = false;
      setRefreshing(false);
      return;
    }

    setData(response.data);
    setRefreshing(false);
  }, []);

  const resetData = useCallback(() => {
    setData(undefined);
    setRefreshing(true);
  }, []);

  const refreshData = useCallback(() => {
    resetData();
    loadData();
  }, [loadData, resetData]);

  useEffect(() => {
    refreshData();

    return cancelRequest;
  }, [loadData, cancelRequest]);

  const handlePressViewAll = useCallback(() => {
    navigation.navigate('Table', {
      screen: 'TableManager',
    });
  }, [navigation]);

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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={renderRefreshControl()}>
      <Greetings name={user.fullName} />
      <View style={styles.statsContainer}>
        <StatsCard
          title="Tổng thu nhập"
          value={PriceUtils.getString(data?.stats?.totalEarning || 0)}
          icon={icons.money_icon}
          iconBackgroundColor={COLORS.success100}
          iconTintColor={COLORS.success800}
        />
        <StatsCard
          title="Đang xử lý"
          value={data?.stats?.totalOrder || 0}
          icon={icons.timer_icon}
          iconBackgroundColor={COLORS.warning100}
          iconTintColor={COLORS.warning700}
        />
        <StatsCard
          title="Đã xong"
          value={data?.stats?.ordersCompleted || 0}
          icon={icons.order}
          iconBackgroundColor={COLORS.secondary200}
          iconTintColor={COLORS.primary600}
        />
      </View>
      <View style={styles.info}>
        <PopularDishes data={data?.popularMenuItems} />
        <HomeReservations
          data={data?.reservations}
          onPressViewAll={handlePressViewAll}
        />
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.backgroundPrimary,
  },
  rightSection: {
    flex: 3,
    backgroundColor: COLORS.netral_white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SIZES.radius,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    marginTop: SIZES.radius,
    gap: SIZES.radius,
  },
});

export default HomeScreen;