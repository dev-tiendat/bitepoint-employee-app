import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';

import { COLORS, FONTS, icons, SIZES } from 'common';
import Icon, { IconType } from 'components/Icon';
import { Payment, PaymentBank } from 'types/payment';
import { OnPressNone } from 'types/props';
import PriceUtils from 'utils/PriceUtils';

type OrderPaymentQRCodeModalViewProps = {
  style?: StyleProp<ViewProps>;
  data: Payment[];
  onPressClose?: OnPressNone;
};

const OrderPaymentQRCodeModalView: React.FC<
  OrderPaymentQRCodeModalViewProps
> = ({ style, data, onPressClose }) => {
  const getBankName = (bank: PaymentBank) => {
    switch (bank) {
      case PaymentBank.MB_BANK:
        return 'MB Bank';
      case PaymentBank.TP_BANK:
        return 'TP Bank';
      default:
        return '';
    }
  };

  const handlePressClose = () => {
    onPressClose?.();
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <View style={styles.qrCodeContainer}>
      <View>
        <Text style={styles.scanQrText}>Quét mã QR</Text>
        <Text style={styles.subScanText}>
          Vui lòng quét mã QR để thanh toán
        </Text>
        <Image source={{ uri: item.qrCode }} style={styles.qrCode} />
        <ActivityIndicator size="large" color={COLORS.primary500} />
        <Text style={styles.subScanText}>Đang xử lý giao dịch</Text>
      </View>
      <View style={styles.transferInfoContainer}>
        <Text style={styles.transferInfoText}>Thông tin chuyển khoản</Text>
        <View style={styles.info}>
          <Text style={styles.secondInfoText}>
            Số tài khoản:{' '}
            <Text style={styles.primaryInfoText}>{item.account}</Text>
          </Text>
          <Text style={styles.secondInfoText}>
            Tên ngân hàng:{' '}
            <Text style={styles.primaryInfoText}>{getBankName(item.bank)}</Text>
          </Text>
          <Text style={styles.secondInfoText}>
            Chủ tài khoản:{' '}
            <Text style={styles.primaryInfoText}>{item.name}</Text>
          </Text>
          <Text style={styles.secondInfoText}>
            Số tiền:{' '}
            <Text style={styles.primaryInfoText}>
              {PriceUtils.getString(item.amount)}
            </Text>
          </Text>
          <Text style={styles.secondInfoText}>
            Nội dung chuyển khoản:{' '}
            <Text style={styles.primaryInfoText}>{item.content}</Text>
          </Text>
        </View>
        <View style={styles.noteContainer}>
          <Icon
            type={IconType.ION}
            name="checkmark-outline"
            size={40}
            color={COLORS.success600}
          />
          <Text style={styles.successText}>
            Sau khi thanh toán, vui lòng chờ trong giây lát để hệ thống xác nhận
            giao dịch
          </Text>
        </View>
        <View style={styles.noteContainer}>
          <Icon
            type={IconType.ION}
            name="alert-circle-outline"
            size={40}
            color={COLORS.warning600}
          />
          <Text style={styles.warningText}>
            Vui lòng không thay đổi số tiền và nội dung chuyển khoản
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handlePressClose} style={styles.overlay} />
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePressClose} style={styles.closeBtn}>
            <Image source={icons.close} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          pagingEnabled
          keyExtractor={(_, index) => `qr-code-${index}`}
          data={data}
          renderItem={renderPaymentItem}
        />
      </View>
    </View>
  );
};

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
    width: 950,
    height: 680,
    padding: SIZES.padding,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  scanQrText: {
    ...FONTS.title2,
    color: COLORS.netral_black,
    textAlign: 'center',
  },
  subScanText: {
    ...FONTS.body3,
    color: COLORS.netral600,
    textAlign: 'center',
    marginTop: SIZES.base,
  },
  qrCodeContainer: {
    flexDirection: 'row',
    width: 900,
    padding: SIZES.padding,
  },
  qrCode: {
    width: 400,
    height: 400,
  },
  transferInfoContainer: {
    width: 400,
    marginLeft: SIZES.padding,
    borderLeftColor: COLORS.netral200,
    borderLeftWidth: 1,
    paddingHorizontal: SIZES.padding,
  },
  transferInfoText: {
    ...FONTS.title2,
    color: COLORS.netral_black,
    textAlign: 'center',
  },
  info: {
    alignItems: 'flex-start',
    marginVertical: SIZES.padding,
  },
  secondInfoText: {
    color: COLORS.netral600,
    ...FONTS.body3,
    marginTop: SIZES.padding,
  },
  primaryInfoText: {
    color: COLORS.netral_black,
    ...FONTS.subtitle3,
  },
  noteContainer: {
    marginTop: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successText: {
    color: COLORS.success600,
    ...FONTS.body3,
    marginLeft: SIZES.base,
  },
  warningText: {
    color: COLORS.warning600,
    ...FONTS.body3,
    marginLeft: SIZES.base,
  },
});

export default OrderPaymentQRCodeModalView;
