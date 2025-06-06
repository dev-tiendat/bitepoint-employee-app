import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios, { CancelTokenSource } from 'axios';
import { isNil } from 'lodash';
import { Socket } from 'socket.io-client';

import { COLORS, ErrorCode, FONTS, SIZES } from 'common';
import BackButton from 'components/BackButton';
import TextButton from 'components/TextButton';
import FormInput from 'components/FormInput';
import OrderMenuItem from './OrderMenuItem';
import PaymentMethodItem from './PaymentMethodItem';
import OrderPaymentQRCodeModalView from './OrderPaymentQRCodeModalView';
import OrderPaymentSuccessModalView from './OrderPaymentSuccessModalView';

import { OrderStackParamList } from 'navigation/OrderNavigator';
import { useToast } from 'hooks/useToast';
import APIManager from 'managers/APIManager';
import SocketManager from 'managers/SocketManager';
import { MenuItem, Order, OrderStatus } from 'types/order';
import { Payment, PaymentMethod } from 'types/payment';
import { Voucher } from 'types/voucher';
import DateUtils from 'utils/DateUtils';
import PriceUtils from 'utils/PriceUtils';

type OrderDetailScreenProps = NativeStackScreenProps<
  OrderStackParamList,
  'OrderDetail'
>;

const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { orderId } = route.params;
  const [discountText, setDiscountText] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethod | undefined
  >(undefined);
  const [paymentInfo, setPaymentInfo] = useState<Payment[]>([]);
  const socket = useRef<Socket | null>(null);
  const [orderData, setOrderData] = useState<Order | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(true);
  const loading = useRef(false);
  const cancelTokenSource = useRef<CancelTokenSource | undefined>(undefined);
  const { showToast } = useToast();

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
    const { response, error } = await APIManager.GET<Order>(
      `/api/v1/orders/${orderId}`,
      undefined,
      cancelTokenSource.current,
    );

    if (axios.isCancel(error)) return;

    cancelTokenSource.current = undefined;
    loading.current = false;

    if (!response || !APIManager.isSucceed(response)) {
      loading.current = false;
      setRefreshing(false);
      return;
    }

    setOrderData(response.data);
    if (response.data?.voucher) {
      setDiscount(response.data.voucher.discount!);
      setDiscountText(response.data.voucher.code!);
    }
    setRefreshing(false);
  }, [orderId]);

  const resetData = useCallback(() => {
    cancelRequest();
    loading.current = false;
    setOrderData(undefined);
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

  const joinRoom = useCallback(() => {
    if (socket.current) {
      socket.current.emit('join-room', orderId);
    }
  }, [orderId]);

  const handlePaymentSuccess = useCallback(() => {
    handleCloseQRCode();

    setTimeout(() => {
      setShowSuccessModal(true);
    }, 50);
  }, []);

  useEffect(() => {
    socket.current = new SocketManager({ namespace: 'payment' }).connect();
    joinRoom();
    socket.current.on('payment-success', handlePaymentSuccess);
    return () => {
      socket.current?.disconnect();
    };
  }, [joinRoom, handlePaymentSuccess]);

  const renderItem = ({ item }: { item: MenuItem }) => {
    return (
      <OrderMenuItem data={item} showPrice showNotificationBadge={false} />
    );
  };

  const handleSelectPaymentMethod = useCallback((method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  }, []);

  const handlePay = useCallback(async () => {
    if (isNil(selectedPaymentMethod)) {
      return;
    }

    const paymentInfo = (await socket.current?.emitWithAck('pay', {
      orderId,
      paymentMethod: selectedPaymentMethod,
    })) as Payment[];

    if (paymentInfo) {
      setPaymentInfo(paymentInfo);
    }
  }, [selectedPaymentMethod, orderId]);

  const handleDone = useCallback(() => {
    setShowSuccessModal(false);
    navigation.goBack();
  }, [navigation]);

  const handleApplyDiscount = async () => {
    const { response } = await APIManager.POST<Voucher>(
      `/api/v1/vouchers/apply`,
      { orderId: orderId, voucherCode: discountText },
    );

    if (!APIManager.isSucceed(response)) {
      switch (response!.code) {
        case ErrorCode.VOUCHER_NOT_FOUND:
          Alert.alert('Mã giảm giá không tồn tại');
          break;
        case ErrorCode.VOUCHER_EXPIRED:
          Alert.alert('Mã giảm giá đã hết hạn');
          break;
        default:
          Alert.alert('Mã giảm giá không hợp lệ');
          break;
      }
      return;
    }

    setDiscount(response?.data?.discount!);
    setOrderData(prev => {
      return {
        ...prev!,
        voucher: response?.data,
      };
    });
    Alert.alert('Áp dụng mã giảm giá thành công');
  };

  const handleFeedback = useCallback(
    async (feedbackData: { rating: number; comments: string }) => {
      const { response } = await APIManager.POST(
        `/api/v1/orders/${orderId}/feedback`,
        feedbackData,
      );

      if (!response || !APIManager.isSucceed(response)) {
        showToast('Gửi phản hồi thất bại', 'error');
        handleDone();
        return;
      }

      showToast('Gửi phản hồi thành công', 'success');
      handleDone();
    },
    [orderId, handleDone],
  );

  const handleCloseQRCode = () => {
    setPaymentInfo([]);
  };

  const renderPaymentMethodItem = (value: PaymentMethod) => {
    return (
      <PaymentMethodItem
        key={`payment-method-${value}`}
        method={value}
        isSelected={value === selectedPaymentMethod}
        onPress={handleSelectPaymentMethod}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={styles.head}>
            <BackButton title="Chi tiết đơn hàng" />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Danh sách món ăn đặt</Text>
            <FlatList
              style={styles.list}
              data={orderData?.orderItems}
              renderItem={renderItem}
            />
          </View>
        </View>
        <View style={styles.rightContent}>
          <View style={[styles.card, { flex: 1, marginBottom: SIZES.padding }]}>
            <Text style={styles.cardTitle}>Thông tin khách hàng</Text>
            <View style={styles.orderInfo}>
              <View style={styles.orderInfoHead}>
                <View>
                  <Text style={styles.customerName}>
                    Khách hàng : {orderData?.reservation?.customerName}
                  </Text>
                  <Text style={styles.phone}>
                    Số điện thoại : {orderData?.reservation?.phone}
                  </Text>
                </View>
                <View style={styles.table}>
                  <Text style={styles.tableName}>{orderData?.table?.name}</Text>
                </View>
              </View>
              <Text style={styles.orderTime}>
                {DateUtils.unixToDateTime(orderData?.orderTime!)}
              </Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentText}>Thanh toán</Text>
              <FormInput
                label="Mã giảm giá"
                value={discountText}
                style={{ marginTop: 0 }}
                inputStyle={{ textTransform: 'uppercase' }}
                onChangeText={setDiscountText}
                appendComponent={() =>
                  orderData?.status === OrderStatus.ORDERING ? (
                    <TextButton
                      label="Áp dụng"
                      disabled={discountText === orderData.voucher?.code}
                      style={{
                        backgroundColor:
                          discountText === orderData.voucher?.code
                            ? COLORS.warning200
                            : COLORS.warning500,
                      }}
                      onPress={handleApplyDiscount}
                    />
                  ) : null
                }
              />
            </View>
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceSubText}>
                  Tổng phụ ({orderData?.orderItems?.length} món) :
                </Text>
                <Text style={styles.priceSubValue}>
                  {PriceUtils.getString(orderData?.totalPrice!)}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceSubText}>Giảm giá :</Text>
                <Text style={styles.priceSubValue}>
                  {PriceUtils.getString(discount)}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.totalPriceText}>Tổng tiền :</Text>
                <Text style={styles.totalPrice}>
                  {PriceUtils.getString(
                    Math.max(orderData?.totalPrice! - discount, 0),
                  )}
                </Text>
              </View>
            </View>
            {orderData?.status !== OrderStatus.COMPLETED && (
              <>
                <View style={styles.paymentMethod}>
                  <Text style={styles.paymentMethodText}>
                    Phương thức thanh toán{' '}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {Object.values(PaymentMethod)
                      .filter(
                        (value): value is PaymentMethod =>
                          typeof value !== 'string',
                      )
                      .map(renderPaymentMethodItem)}
                  </ScrollView>
                </View>
                <View style={styles.payNowBtnContainer}>
                  <TextButton
                    disabled={isNil(selectedPaymentMethod)}
                    style={
                      isNil(selectedPaymentMethod) && styles.payNowBtnInactive
                    }
                    label="Thanh toán"
                    onPress={handlePay}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </View>
      <Suspense>
        <Modal
          visible={paymentInfo.length > 0}
          animationType="fade"
          transparent
          supportedOrientations={['landscape']}>
          <OrderPaymentQRCodeModalView
            data={paymentInfo}
            onPressClose={handleCloseQRCode}
          />
        </Modal>
        <Modal
          visible={showSuccessModal}
          animationType="fade"
          transparent
          supportedOrientations={['landscape']}>
          <OrderPaymentSuccessModalView
            onPressDone={handleDone}
            onPressFeedback={handleFeedback}
          />
        </Modal>
      </Suspense>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 0,
    backgroundColor: COLORS.backgroundPrimary,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SIZES.padding,
  },
  textHead: {
    ...FONTS.heading2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    marginTop: SIZES.padding,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  leftContent: {
    flex: 3,
    paddingHorizontal: SIZES.padding,
  },
  rightContent: {
    flex: 2,
    paddingRight: SIZES.padding,
  },
  orderInfo: {
    paddingBottom: SIZES.base,
    borderBottomColor: COLORS.netral200,
    borderBottomWidth: 1,
  },
  orderInfoHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  orderTime: {
    ...FONTS.body4,
    color: COLORS.netral600,
    marginBottom: SIZES.base,
  },
  customerName: {
    ...FONTS.subtitle3,
    marginBottom: SIZES.base,
  },
  phone: {
    ...FONTS.subtitle4,
    color: COLORS.netral600,
    marginBottom: SIZES.base,
  },
  table: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.secondary100,
    borderRadius: SIZES.radius,
  },
  tableName: {
    color: COLORS.secondary500,
    ...FONTS.title3,
  },
  cardTitle: {
    ...FONTS.title2,
    marginBottom: SIZES.padding,
  },
  list: {
    height: '100%',
  },
  paymentText: {
    ...FONTS.title2,
    marginBottom: SIZES.padding,
  },
  priceContainer: {
    backgroundColor: COLORS.netral100,
    padding: 16,
    paddingBottom: 8,
    borderRadius: SIZES.radius,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  priceSubText: {
    ...FONTS.body4,
    color: COLORS.netral600,
  },
  priceSubValue: {
    ...FONTS.title4,
    color: COLORS.netral_black,
  },
  totalPriceText: {
    ...FONTS.subtitle3,
    color: COLORS.netral_black,
  },
  totalPrice: {
    ...FONTS.subtitle2,
    color: COLORS.primary500,
  },
  paymentMethod: {
    marginTop: SIZES.padding,
  },
  paymentMethodText: {
    ...FONTS.body3,
    color: COLORS.netral_black,
  },
  payNowBtnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  payNowBtnInactive: {
    backgroundColor: COLORS.secondary300,
  },
});

export default OrderDetailScreen;
