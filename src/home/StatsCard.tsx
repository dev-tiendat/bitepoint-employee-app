import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from 'common';

interface StatsCardProps {
  title: string;
  value?: string | number;
  icon: any;
  iconBackgroundColor?: string;
  iconTintColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBackgroundColor = COLORS.netral_white,
  iconTintColor = COLORS.netral_black,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.statsHead}>
        <Text style={styles.statsTitle}>{title}</Text>
        <View
          style={[
            styles.statsIconContainer,
            { backgroundColor: iconBackgroundColor },
          ]}>
          <Image
            source={icon}
            style={[styles.statsIcon, { tintColor: iconTintColor }]}
          />
        </View>
      </View>
      <Text style={styles.statsValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 220,
    backgroundColor: COLORS.netral_white,
    borderRadius: 10,
    padding: SIZES.padding,
  },
  statsHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsTitle: {
    ...FONTS.subtitle2,
    color: COLORS.netral_black,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.success100,
    borderRadius: SIZES.radius,
  },
  statsIcon: {
    width: 24,
    height: 24,
  },
  statsValue: {
    ...FONTS.large1,
    paddingVertical: SIZES.radius,
    color: COLORS.netral_black,
  },
});

export default StatsCard;
