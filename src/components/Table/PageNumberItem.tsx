import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, PROPS, SIZES } from 'common';

type PageNumberItemProps = {
  page?: number;
  isActive?: boolean;
  isEllipsis?: boolean;
  onPress?: (page: number) => void;
};

const PageNumberItem: React.FC<PageNumberItemProps> = ({
  page,
  isActive,
  isEllipsis,
  onPress,
}) => {
  const handlePress = () => {
    if (!page) return;

    onPress?.(page);
  };

  if (isEllipsis) {
    return <Text style={styles.ellipsis}>...</Text>;
  }

  return (
    <TouchableOpacity
      activeOpacity={PROPS.touchable_active_opacity}
      style={[styles.pageBtn, isActive && styles.pageBtnActive]}
      onPress={handlePress}
      disabled={isActive}>
      <Text style={[styles.pageText, isActive && styles.pageTextActive]}>
        {page}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
  },
  pageBtnActive: {
    backgroundColor: COLORS.primary500,
  },
  pageText: {
    ...FONTS.subtitle3,
    color: COLORS.netral600,
  },
  pageTextActive: {
    color: COLORS.netral_white,
  },
  ellipsis: {
    paddingHorizontal: 6,
    ...FONTS.subtitle3,
    color: COLORS.netral400,
  },
});

export default PageNumberItem;
