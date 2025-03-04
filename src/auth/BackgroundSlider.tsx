import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { images } from 'common';
import { COLORS, FONTS, SIZES } from 'common/theme';
import { CssStyle } from 'types/style';

type Slide = {
  backgroundImage: any;
  quote: string;
  author: string;
};

const SLIDES: Slide[] = [
  {
    backgroundImage: images.login_slide_1,
    quote:
      'Mỗi lần chúng ta tiếp xúc với khách hàng đều ảnh hưởng đến việc họ có quay lại hay không. Chúng ta phải làm tốt mọi lúc, nếu không, chúng ta sẽ mất họ.',
    author: 'Kevin Stirtz, Author',
  },
  {
    backgroundImage: images.login_slide_2,
    quote:
      'Nếu bạn tạo ra một trải nghiệm tuyệt vời, khách hàng sẽ kể cho nhau nghe về điều đó. Truyền miệng là một công cụ vô cùng mạnh mẽ.',
    author: 'Jeff Bezos, CEO Amazon',
  },
  {
    backgroundImage: images.login_slide_3,
    quote:
      'Phục vụ khách hàng những món ăn ngon nhất với giá trị hợp lý trong một nhà hàng sạch sẽ, thoải mái, và họ sẽ luôn quay lại.',
    author: 'Dave Thomas, Founder of Wenday’s.',
  },
];

const SLIDE_WIDTH = SIZES.width / 1.872;

export type BackgroundSliderProps = {
  style?: StyleProp<CssStyle>;
};

const BackgroundSlider: React.FC<BackgroundSliderProps> = ({ style }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const ref = useRef<FlatList>(null);

  const scrollToIndex = useCallback((index: number) => {
    setActiveIndex(index);
    ref.current?.scrollToIndex({ index, animated: true });
  }, []);

  useEffect(() => {
    if (isTouching) {
      return;
    }

    const interval = setInterval(() => {
      if (activeIndex === SLIDES.length - 1) {
        scrollToIndex(0);
        return;
      }

      scrollToIndex(activeIndex + 1);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [isTouching, activeIndex, scrollToIndex]);

  const keyExtractor = (_: Slide, index: number) => `slider-${index}`;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH));
  };

  const handleToggleTouch = () => {
    setIsTouching(!isTouching);
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <Image
        source={item.backgroundImage}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>{item.quote}</Text>
        <Text style={styles.author}>{item.author}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={ref}
        data={SLIDES}
        onTouchStart={handleToggleTouch}
        onTouchEnd={handleToggleTouch}
        onScroll={handleScroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <View style={styles.paginationContainer}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index ? styles.paginationDotActive : {},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default BackgroundSlider;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.netral_white,
  },
  slide: {
    // width: SIZES.width / 2,
    // height: SIZES.height,
    backgroundColor: 'red',
  },
  quoteContainer: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    alignItems: 'flex-start',
    padding: SIZES.padding,
  },
  quote: {
    color: COLORS.netral_white,
    ...FONTS.subtitle2,
    textAlign: 'left',
  },
  author: {
    ...FONTS.subtitle4,
    textAlign: 'left',
    color: COLORS.netral_white,
    marginTop: SIZES.padding,
    padding: SIZES.base,
    borderRadius: 99,
    borderColor: COLORS.netral_white,
    borderWidth: 1,
  },
  image: {
    width: SLIDE_WIDTH,
    height: SIZES.height,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.netral400,
    marginHorizontal: 5,
  },
  paginationDotActive: {
    width: 30,
    backgroundColor: COLORS.netral_white,
  },
});
