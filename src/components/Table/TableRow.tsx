import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from 'common';
import { Column } from '.';

type TableRowProps = {
  row: Record<string, any>;
  columns: Column[];
  colWidths: number[];
  actionsColumnIndex?: number;
  rowIdx: number;
  actionsColumnWidth?: number;
  renderActions?: (rowIdx: number) => React.ReactNode;
  onCellLayout?: (colIdx: number, width: number) => void;
};

const ActionCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.actionCell}>{children}</View>
);

const TableRow: React.FC<TableRowProps> = ({
  row,
  columns,
  colWidths,
  actionsColumnIndex,
  actionsColumnWidth,
  renderActions,
  rowIdx,
  onCellLayout,
}) => {
  return (
    <View style={styles.row}>
      {columns.map((column, colIdx) => (
        <View
          key={colIdx}
          style={[
            styles.cell,
            { width: colWidths[colIdx] },
            colIdx === actionsColumnIndex && { width: actionsColumnWidth },
          ]}
          onLayout={e => {
            if (onCellLayout) {
              onCellLayout(colIdx, e.nativeEvent.layout.width);
            }
          }}>
          {colIdx === actionsColumnIndex && renderActions ? (
            <ActionCell>{renderActions(rowIdx)}</ActionCell>
          ) : (
            <Text style={styles.cellText}>{row[column.dataIndex]}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: 44,
  },
  cellText: {
    flexWrap: 'wrap',
    ...FONTS.body3,
    color: COLORS.netral_black,
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});

export default TableRow;
