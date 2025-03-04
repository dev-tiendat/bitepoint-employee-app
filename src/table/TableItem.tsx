import { icons } from 'common';
import { COLORS, FONTS, PROPS, SIZES } from 'common/theme';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { CssStyle } from 'types/style';
import { Table, TableStatus } from 'types/table';

type TableItemProps = {
  data: Table;
  isAssignTable?: boolean;
  isSelected?: boolean;
  onPress?: (id: number) => void;
  style?: StyleProp<CssStyle>;
};

const TABLE_STATUS_COLORS = {
  [TableStatus.AVAILABLE]: COLORS.netral600,
  [TableStatus.CLEANING]: COLORS.warning400,
  [TableStatus.RESERVED]: COLORS.danger400,
  [TableStatus.OCCUPIED]: COLORS.success400,
};

const TableItem: React.FC<TableItemProps> = ({
  data,
  isAssignTable,
  isSelected,
  onPress,
  style,
}) => {
  const isDisabled = isAssignTable && data.status !== TableStatus.AVAILABLE;
  const handlePress = () => {
    onPress?.(data.id);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      style={[styles.container, style, isSelected && styles.itemSelected]}
      activeOpacity={PROPS.touchable_active_opacity}>
      <View>
        <FastImage
          source={{
            uri: data.image,
          }}
          resizeMode="contain"
          style={[styles.image, isDisabled && styles.imageDisabled]}
        />
        <View style={styles.nameContainer}>
          {isSelected && (
            <View style={styles.iconSelectContainer}>
              <Image source={icons.selected} style={styles.iconSelect} />
            </View>
          )}
          <Text
            style={[
              styles.name,
              { color: TABLE_STATUS_COLORS[data!.status!] },
            ]}>
            {data.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SIZES.radius,
    padding: SIZES.padding,
  },
  itemSelected: {
    backgroundColor: COLORS.primary100,
    borderRadius: 30,
  },
  iconSelectContainer: {
    position: 'absolute',
    top: '-25%',
    left: '75%',
    zIndex: 10,
  },
  iconSelect: {
    width: 16,
    height: 16,
  },
  image: {
    height: 140,
    aspectRatio: 16 / 9,
  },
  imageDisabled: {
    opacity: 0.4,
  },
  nameContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    padding: 13,
    backgroundColor: COLORS.netral100,
    borderRadius: SIZES.radius,
  },
  name: {
    ...FONTS.title3,
    color: COLORS.netral800,
  },
});

export default TableItem;
