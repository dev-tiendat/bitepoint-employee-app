import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import FeatherIcon from '@react-native-vector-icons/feather';
import FontAwesome6Icon from '@react-native-vector-icons/fontawesome6';
import IonIcon from '@react-native-vector-icons/ionicons';
import MaterialDesignIcon from '@react-native-vector-icons/material-design-icons';
import MaterialIcon from '@react-native-vector-icons/material-icons';

export enum IconType {
  FEATHER = 'Feather',
  FONT_AWESOME6 = 'FontAwesome6',
  ION = 'Ion',
  MATERIAL_DESIGN = 'MaterialDesign',
  MATERIAL = 'Material',
}

export type IconProps = {
  type: IconType;
  name: any;
  color: string;
  size: number;
  solid?: boolean;
  light?: boolean;
  style?: StyleProp<ViewStyle>;
};

const Icon: React.FC<IconProps> = ({ type, ...rest }) => {
  switch (type) {
    case IconType.FEATHER:
      return <FeatherIcon {...rest} />;
    case IconType.FONT_AWESOME6:
      return <FontAwesome6Icon {...rest} />;
    case IconType.ION:
      return <IonIcon {...rest} />;
    case IconType.MATERIAL_DESIGN:
      return <MaterialDesignIcon {...rest} />;
    case IconType.MATERIAL:
      return <MaterialIcon {...rest}/>;
    default:
      return null;
  }
};

export default Icon;
