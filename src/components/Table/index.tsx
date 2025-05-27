import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { COLORS, SIZES } from 'common';
import TablePagination, { TablePaginationProps } from './TablePagination';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import Divider from 'components/Divider';
import { SortOrder } from 'types/api';

export type Column = {
  label: string;
  dataIndex: string;
  sortable?: boolean;
};

type TableProps = TablePaginationProps & {
  columns: Column[];
  data?: Record<string, any>[] | undefined;
  sortBy?: string;
  order?: SortOrder;
  actionsColumnIndex?: number;
  actionsColumnWidth?: number;
  renderActions?: (rowIdx: number) => React.ReactNode;
  onSort?: (field: string) => void;
};

const MIN_COL_WIDTH = 60;
const MAX_COL_WIDTH = 300;
const CHAR_PIXEL_RATIO = SIZES.body3;

const Table: React.FC<TableProps> = ({
  columns,
  data,
  sortBy,
  order,
  actionsColumnIndex,
  actionsColumnWidth,
  onSort,
  renderActions,
  ...rest
}) => {
  const numCols = columns.length;
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [colWidths, setColWidths] = useState<number[]>(
    Array(numCols).fill(MIN_COL_WIDTH),
  );

  useEffect(() => {
    let newColWidths = columns.map((col, idx) => {
      let maxLen = (col.label || '').toString().length;

      data?.forEach(row => {
        const cell = row[col.dataIndex];

        if (cell !== undefined && cell !== null) {
          const len = cell.toString().length;

          if (len > maxLen) maxLen = len;
        }
      });
      let width = Math.max(
        MIN_COL_WIDTH,
        Math.min(maxLen * CHAR_PIXEL_RATIO, MAX_COL_WIDTH),
      );
      if (
        actionsColumnIndex !== undefined &&
        idx === actionsColumnIndex &&
        actionsColumnWidth
      ) {
        width = actionsColumnWidth;
      }
      return width;
    });

    const totalColWidth = newColWidths.reduce((a, b) => a + b, 0);
    if (containerWidth > 0 && totalColWidth < containerWidth) {
      const extra = containerWidth - totalColWidth;
      const extraPerCol = Math.floor(extra / numCols);
      newColWidths = newColWidths.map(w =>
        Math.min(w + extraPerCol, MAX_COL_WIDTH),
      );

      let remain = containerWidth - newColWidths.reduce((a, b) => a + b, 0);
      for (let i = 0; remain > 0 && i < numCols; i++, remain--) {
        if (newColWidths[i] < MAX_COL_WIDTH) newColWidths[i]++;
      }
    }

    setColWidths(newColWidths);
  }, [columns, data, actionsColumnIndex, actionsColumnWidth, containerWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const renderTableRow = ({
    item,
    index,
  }: {
    item: Record<string, any>;
    index: number;
  }) => {
    return (
      <TableRow
        key={index}
        row={item}
        columns={columns}
        colWidths={colWidths}
        actionsColumnIndex={actionsColumnIndex}
        actionsColumnWidth={
          actionsColumnIndex !== undefined
            ? colWidths[actionsColumnIndex]
            : undefined
        }
        renderActions={renderActions}
        rowIdx={index}
      />
    );
  };

  return (
    <View style={styles.wrapper} onLayout={handleLayout}>
      <ScrollView horizontal>
        <View style={styles.tableContainer}>
          <TableHeader
            columns={columns}
            sortField={sortBy}
            sortOrder={order}
            onSort={onSort}
            colWidths={colWidths}
            actionsColumnIndex={actionsColumnIndex}
            actionsColumnWidth={
              actionsColumnIndex !== undefined
                ? colWidths[actionsColumnIndex]
                : undefined
            }
          />
          <FlatList
            data={data}
            renderItem={renderTableRow}
            removeClippedSubviews
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={21}
          />
        </View>
      </ScrollView>
      <Divider />
      <TablePagination {...rest} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.netral_white,
    overflow: 'hidden',
  },
  tableContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default Table;
