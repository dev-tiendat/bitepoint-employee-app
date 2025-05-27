import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { COLORS, FONTS, PROPS } from 'common';
import { SortOrder } from 'types/api';
import { Column } from '.';

type TableHeaderProps = {
  columns: Column[];
  sortField?: string;
  sortOrder?: SortOrder;
  onSort?: (field: string) => void;
  colWidths: number[];
  actionsColumnIndex?: number;
  actionsColumnWidth?: number;
  onCellLayout?: (colIdx: number, width: number) => void;
};

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  sortField,
  sortOrder,
  onSort,
  colWidths,
  actionsColumnIndex,
  actionsColumnWidth,
  onCellLayout,
}) => (
  <View style={styles.row}>
    {columns.map((col, colIdx) => {
      const isActions = colIdx === actionsColumnIndex;

      const handlePressSort = () => {
        if (!col.sortable) return;

        onSort?.(col.dataIndex);
      };

      const handleLayout = (e: LayoutChangeEvent) => {
        if (onCellLayout && !isActions) {
          onCellLayout(colIdx, e.nativeEvent.layout.width);
        }
      };

      return (
        <TouchableOpacity
          key={col.dataIndex}
          style={[
            styles.cell,
            { width: colWidths[colIdx] },
            isActions && { width: actionsColumnWidth },
          ]}
          activeOpacity={col.sortable ? PROPS.touchable_active_opacity : 1}
          onPress={handlePressSort}
          onLayout={handleLayout}>
          <Text style={styles.headerText}>{col.label}</Text>
          {col.sortable && col.dataIndex === sortField && (
            <Text>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</Text>
          )}
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: COLORS.netral100,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
  },
  headerText: {
    ...FONTS.subtitle3,
    color: COLORS.netral600,
  },
});

export default TableHeader;
