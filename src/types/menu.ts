import { IconType } from 'components/Icon';

export type Menu = {
  name: string;
  routeName: string;
  iconType: IconType;
  icon: string;
  children?: Menu[];
};
