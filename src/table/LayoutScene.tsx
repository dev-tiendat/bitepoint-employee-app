import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';

import { COLORS } from 'common';
import Input from 'components/Input';
import Icon, { IconType } from 'components/Icon';
import { Reservation } from 'types/reservation';
import ReserveTableItem from './ReserveTableItem';

type LayoutSceneProps = {
  style?: StyleProp<ViewProps>;
  showSearch?: boolean;
  showFilter?: boolean;
  renderFilter?: () => React.ReactNode;
  data?: Reservation[];
  onPressSearch?: (search: string) => void;
  renderActions?: (reservation: Reservation) => React.ReactNode;
};

const LayoutScene: React.FC<LayoutSceneProps> = ({
  style,
  showSearch,
  showFilter,
  renderFilter,
  data,
  onPressSearch,
  renderActions,
}) => {
  const [search, setSearch] = useState<string>('');

  const handleSearch = () => {
    onPressSearch?.(search);
  };

  const renderSearchButton = () => (
    <TouchableOpacity onPress={handleSearch}>
      <Icon
        type={IconType.ION}
        name="search-outline"
        color={COLORS.netral_black}
        size={30}
      />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Reservation }) => (
    <ReserveTableItem data={item} renderActions={renderActions} />
  );

  const keyExtractor = (item: Reservation) => `reservation-${item.id}`;

  const renderRefreshControl = () => (
    <RefreshControl refreshing={false} onRefresh={() => {}} />
  );

  return (
    <View style={[styles.container, style]}>
      {showSearch && (
        <Input
          placeholder="Tìm kiếm theo tên khách hàng hoặc số điện thoại"
          value={search}
          onChangeText={setSearch}
          inputContainerStyle={styles.searchContainer}
          appendComponent={renderSearchButton}
        />
      )}
      {showFilter && renderFilter && renderFilter()}
      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={renderRefreshControl()}
      />
    </View>
  );
};

export default LayoutScene;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.backgroundPrimary,
  },
  searchContainer: {
    marginTop: 16,
    backgroundColor: COLORS.netral_white,
  },
  list: {
    marginTop: 16,
  },
});