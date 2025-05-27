import {
  Dimensions,
  Platform,
  ScrollViewProps,
  StyleSheet,
} from 'react-native';
const { width, height } = Dimensions.get('window');

const isIos = Platform.OS === 'ios';

export const PROPS = {
  touchable_active_opacity: 0.75,
  end_reached_threshold: 0.75,
};

export const COLORS = {
  // Primary
  primary100: '#D9E7F7',
  primary200: '#9ABEEA',
  primary300: '#679DDF',
  primary400: '#357DD5',
  primary500: '#025CCA',
  primary600: '#0253B6',
  primary700: '#024EAB',
  primary800: '#013C83',
  primary900: '#012E65',
  primary_dark: '#1E3043',

  //Secondary
  secondary100: '#F0F8FF',
  secondary200: '#DCEEFE',
  secondary300: '#B4DBFD',
  secondary400: '#86C4FC',
  secondary500: '#68B5FB',
  secondary600: '#5EA3E2',
  secondary700: '#5391C9',
  secondary800: '#4476A3',
  secondary900: '#345A7E',
  secondary_dark: '#293742',

  // Netral
  netral_white: '#FFFFFF',
  netral100: '#F5F5F5',
  netral200: '#E8E8E8',
  netral300: '#C6C7C8',
  netral400: '#A2A4A4',
  netral500: '#797B7C',
  netral600: '#636566',
  netral700: '#37383A',
  netral800: '#292C2D',
  netral_black: '#202325',

  // Warning
  warning100: '#FFEDD5',
  warning200: '#FEDBAA',
  warning300: '#FECA80',
  warning400: '#FDB855',
  warning500: '#FDA62B',
  warning600: '#E49527',
  warning700: '#CA8522',
  warning800: '#A46C1C',
  warning900: '#7F5316',
  warning_dark: '#4E422C',

  //Danger
  danger100: '#FDECEC',
  danger200: '#F8B8B9',
  danger300: '#F59595',
  danger400: '#F17172',
  danger500: '#EE4E4F',
  danger600: '#DD6565',
  danger700: '#BE3E3F',
  danger800: '#9B3333',
  danger900: '#772728',
  danger_dark: '#3D292A',

  //success
  success100: '#DCF7EA',
  success200: '#B9EFD4',
  success300: '#96E7BF',
  success400: '#73DFA9',
  success500: '#50D794',
  success600: '#48C185',
  success700: '#40AC76',
  success800: '#348C60',
  success900: '#286B4A',
  success_dark: '#2F4B41',

  // Background
  backgroundPrimary: '#F5F5F5',
  backgroundSecondary: '#1F1F1F',
  backgroundTertiary: '#333333',
  backgroundInversePrimary: '#CBCBCB',
  backgroundInverseSecondary: '#AFAFAF',

  // Content
  contentPrimary: '#FFFFFF',
  contentSecondary: '#CBCBCB',
  contentTertiary: '#AFAFAF',
  contentInversePrimary: '#000000',
  contentInverseSecondary: '#545454',
  contentInverseTertiary: '#6B6B6B',
};

export const FONT_FAMILY = {
  regular: isIos ? 'Inter-Regular' : 'InterRegular',
  medium: isIos ? 'Inter-Medium' : 'InterMedium',
  semiBold: isIos ? 'Inter-SemiBold' : 'InterSemiBold',
  bold: isIos ? 'Inter-Bold' : 'InterBold',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  gap: 12,
  padding: 24,
  margin: 20,

  // font sizes
  large1: 36,

  heading1: 28,
  heading2: 24,
  heading3: 20,
  heading4: 16,
  heading5: 14,
  heading6: 12,

  title1: 24,
  title2: 20,
  title3: 16,
  title4: 14,
  title5: 12,
  title6: 10,

  subtitle1: 24,
  subtitle2: 20,
  subtitle3: 16,
  subtitle4: 14,
  subtitle5: 12,
  subtitle6: 10,

  body1: 24,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,
  body6: 10,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  // Large
  large1: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: SIZES.large1,
    lineHeight: 50.4, // 36 * 1.4
  },

  // Heading
  heading1: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: SIZES.heading1,
    lineHeight: 42, // 28 * 1.5
  },
  heading2: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: SIZES.heading2,
    lineHeight: 36, // 24 * 1.5
  },
  heading3: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: SIZES.heading3,
    lineHeight: 30, // 20 * 1.5
  },
  heading4: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: SIZES.heading4,
    lineHeight: 24, // 16 * 1.5
  },
  heading5: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: SIZES.heading5,
    lineHeight: 21, // 14 * 1.5
  },
  heading6: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: SIZES.heading6,
    lineHeight: 18, // 12 * 1.5
  },

  // Title
  title1: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: SIZES.title1,
    lineHeight: 36, // 24 * 1.5
  },
  title2: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: SIZES.title2,
    lineHeight: 30, // 20 * 1.5
  },
  title3: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: SIZES.title3,
    lineHeight: 24, // 16 * 1.5
  },
  title4: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: SIZES.title4,
    lineHeight: 21, // 14 * 1.5
  },
  title5: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: SIZES.title5,
    lineHeight: 18, // 12 * 1.5
  },
  title6: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: SIZES.title6,
    lineHeight: 15, // 10 * 1.5
  },

  // Subtitle
  subtitle1: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: SIZES.subtitle1,
    lineHeight: 36, // 24 * 1.5
  },
  subtitle2: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: SIZES.subtitle2,
    lineHeight: 30, // 20 * 1.5
  },
  subtitle3: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: SIZES.subtitle3,
    lineHeight: 24, // 16 * 1.5
  },
  subtitle4: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: SIZES.subtitle4,
    lineHeight: 21, // 14 * 1.5
  },
  subtitle5: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: SIZES.subtitle5,
    lineHeight: 18, // 12 * 1.5
  },
  subtitle6: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: SIZES.subtitle6,
    lineHeight: 15, // 10 * 1.5
  },

  // Body
  body1: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body1,
    lineHeight: 36, // 24 * 1.5
  },
  body2: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body2,
    lineHeight: 30, // 20 * 1.5
  },
  body3: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body3,
    lineHeight: 24, // 16 * 1.5
  },
  body4: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body4,
    lineHeight: 21, // 14 * 1.5
  },
  body5: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body5,
    lineHeight: 18, // 12 * 1.5
  },
  body6: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: SIZES.body6,
    lineHeight: 15, // 10 * 1.5
  },
};

export const COMMON_STYLES = StyleSheet.create({
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 1)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});

export const SCROLL_VIEW_KEYBOARD_PROPS: ScrollViewProps = {
  keyboardShouldPersistTaps: Platform.select({
    ios: 'handled',
    android: 'never',
  }),
  keyboardDismissMode: Platform.select({
    ios: 'interactive',
    android: 'on-drag',
  }),
};

const appTheme = { COLORS, SIZES, FONTS, COMMON_STYLES };

export default appTheme;
