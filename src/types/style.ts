import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { ImageStyle as FastImageStyle } from 'react-native-fast-image';

export type CssStyle = ViewStyle | TextStyle | ImageStyle | FastImageStyle;
