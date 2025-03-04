import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { COLORS, FONTS, PROPS, SIZES } from 'common';
import Icon, { IconType } from 'components/Icon';
import TextButton from 'components/TextButton';

type OrderPaymentSuccessModalViewProps = {
  onPressDone?: () => void;
  onPressFeedback?: (data: { rating: number; comments: string }) => void;
};

const OrderPaymentSuccessModalView: React.FC<OrderPaymentSuccessModalViewProps> = ({
  onPressDone,
  onPressFeedback,
}) => {
  const stars = [1, 2, 3, 4, 5];
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<string>('');

  const handlePressDone = () => {
    onPressDone?.();
  };

  const handlePressFeedback = () => {
    onPressFeedback?.({ rating, comments });
  };

  const handlePressShowFeedback = () => {
    setFeedbackShown(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.modal}>
        {feedbackShown ? (
          <View style={styles.feedbackContainer}>
            <Text style={styles.title}>Đánh giá</Text>
            <Text style={styles.feedbackDescription}>
              Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ
            </Text>
            <View style={styles.starsContainer}>
              {stars.map(star => (
                <TouchableOpacity
                  key={`star-${star}`}
                  activeOpacity={PROPS.touchable_active_opacity}
                  onPress={() => setRating(star)}>
                  <Icon
                    type={IconType.ION}
                    name="star"
                    size={35}
                    color={rating >= star ? COLORS.warning400 : COLORS.netral200}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.comment}>Nhận xét:</Text>
            <TextInput
              value={comments}
              onChangeText={setComments}
              multiline
              style={styles.commentInput}
            />
          </View>
        ) : (
          <>
            <View style={styles.successIconRoot}>
              <View style={styles.successIconContainer}>
                <Icon
                  type={IconType.ION}
                  name="checkmark"
                  size={45}
                  color={COLORS.netral_white}
                />
              </View>
            </View>
            <Text style={styles.title}>Thanh toán thành công</Text>
            <Text style={styles.description}>
              Đơn hàng của bạn đã được thanh toán thành công, cảm ơn bạn đã sử
              dụng dịch vụ của chúng tôi
            </Text>
          </>
        )}
        <View style={styles.footer}>
          <TextButton
            label={feedbackShown ? 'Quay lại' : 'Đánh giá'}
            style={styles.secondaryBtn}
            labelStyle={styles.secondaryBtnText}
            onPress={!feedbackShown ? handlePressShowFeedback : handlePressDone}
          />
          <TextButton
            style={[
              styles.primaryBtn,
              feedbackShown && rating === 0 && styles.primaryBtnInActive,
            ]}
            disabled={feedbackShown && rating === 0}
            label={feedbackShown ? 'Gửi đánh giá' : 'Hoàn tất'}
            onPress={feedbackShown ? handlePressFeedback : handlePressDone}
          />
        </View>
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
    width: 400,
    height: 430,
    padding: SIZES.padding,
    backgroundColor: COLORS.netral_white,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  feedbackContainer: {},
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  feedbackDescription: {
    ...FONTS.body4,
    color: COLORS.netral600,
    marginTop: SIZES.base,
  },
  comment: {
    ...FONTS.body3,
    color: COLORS.netral_black,
    marginTop: SIZES.padding,
  },
  commentInput: {
    width: 352,
    height: 120,
    padding: SIZES.padding,
    backgroundColor: COLORS.netral100,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
    color: COLORS.netral_black,
    ...FONTS.body4,
  },
  successIconRoot: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary200,
    borderRadius: 999,
    marginBottom: SIZES.padding,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary500,
    borderRadius: 999,
  },
  title: {
    ...FONTS.title1,
    color: COLORS.netral_black,
  },
  description: {
    ...FONTS.body4,
    color: COLORS.netral600,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 'auto',
    gap: SIZES.base,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: COLORS.netral100,
  },
  secondaryBtnText: {
    ...FONTS.body3,
    color: COLORS.netral_black,
  },
  primaryBtn: {
    flex: 1,
    marginTop: 'auto',
  },
  primaryBtnInActive: {
    backgroundColor: COLORS.secondary300,
  },
});

export default OrderPaymentSuccessModalView;