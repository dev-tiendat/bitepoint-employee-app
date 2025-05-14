import { useLayout } from 'hooks/useLayout';
import React, { useEffect } from 'react';
import { StyleProp, ViewStyle, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const MARGIN_TOP = 16;

type AnimatedContainerProps = {
  index: number;
  hide: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onHide?: () => void;
  onPanBegin?: () => void;
  onPanFinalize?: () => void;
};

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  style,
  index,
  hide,
  onHide,
  onPanBegin,
  onPanFinalize,
}) => {
  const pressed = useSharedValue(false);
  const { width, height, onLayout } = useLayout();
  const screenWidth = Dimensions.get('window').width;
  const offsetX = useSharedValue(screenWidth);
  const offsetY = useSharedValue(0);

  useEffect(() => {
    offsetX.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  useEffect(() => {
    if (index === 0) return;
    offsetY.value = withSpring((height + MARGIN_TOP) * index, {
      damping: 15,
      stiffness: 100,
    });
  }, [index, height]);

  useEffect(() => {
    if (hide) {
      offsetX.value = withSpring(screenWidth, { damping: 15, stiffness: 100 });
    }
  }, [hide]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;

      if (onPanBegin) runOnJS(onPanBegin)();
    })
    .onChange(event => {
      if (event.translationX > width / 2 && onHide) {
        runOnJS(onHide)();
        return;
      }

      if (event.translationX > -50) offsetX.value = event.translationX;
    })
    .onFinalize(() => {
      pressed.value = false;
      if (hide) return;

      offsetX.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
      if (onPanFinalize) runOnJS(onPanFinalize)();
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value || 0 },
      { translateY: offsetY.value || 0 },
    ],
    opacity: withSpring(
      pressed.value ? Math.max(0.3, 1 - offsetX.value / (width * 0.8)) : 1,
    ),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[style, animatedStyles]} onLayout={onLayout}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default AnimatedContainer;
