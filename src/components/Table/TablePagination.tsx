import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { isNil } from 'lodash';
import { COLORS, FONTS, SIZES } from 'common';
import Icon, { IconType } from 'components/Icon';
import PageNumberItem from './PageNumberItem';
import LimitPicker from './LimitPicker';

export type TablePaginationProps = {
  totalPages?: number;
  currentPage?: number;
  limit?: number;
  pageSizeOptions: number[];
  onChangeLimit?: (v: number) => void;
  onPageChange?: (page: number) => void;
};

const TablePagination: React.FC<TablePaginationProps> = ({
  totalPages,
  currentPage = 1,
  onPageChange,
  limit = 5,
  pageSizeOptions = [5, 10, 20, 30],
  onChangeLimit,
}) => {
  const renderPageNumbers = () => {
    if (!totalPages) return null;

    const pages = [];
    const maxItems = 8;

    if (totalPages <= maxItems) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PageNumberItem
            key={i}
            page={i}
            isActive={i === currentPage}
            onPress={onPageChange}
          />,
        );
      }
      return pages;
    }

    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(
          <PageNumberItem
            key={i}
            page={i}
            isActive={i === currentPage}
            onPress={onPageChange}
          />,
        );
      }
      pages.push(<PageNumberItem key="ellipsis-right" isEllipsis />);
      pages.push(
        <PageNumberItem
          key={totalPages - 1}
          page={totalPages - 1}
          isActive={currentPage === totalPages - 1}
          onPress={onPageChange}
        />,
      );
      pages.push(
        <PageNumberItem
          key={totalPages}
          page={totalPages}
          isActive={currentPage === totalPages}
          onPress={onPageChange}
        />,
      );
      return pages;
    }

    if (currentPage >= totalPages - 3) {
      pages.push(
        <PageNumberItem
          key={1}
          page={1}
          isActive={currentPage === 1}
          onPress={onPageChange}
        />,
      );
      pages.push(
        <PageNumberItem
          key={2}
          page={2}
          isActive={currentPage === 2}
          onPress={onPageChange}
        />,
      );
      pages.push(<PageNumberItem key="ellipsis-left" isEllipsis />);
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(
          <PageNumberItem
            key={i}
            page={i}
            isActive={i === currentPage}
            onPress={onPageChange}
          />,
        );
      }
      return pages;
    }

    pages.push(
      <PageNumberItem
        key={1}
        page={1}
        isActive={currentPage === 1}
        onPress={onPageChange}
      />,
    );
    pages.push(<PageNumberItem key="ellipsis-left" isEllipsis />);
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(
        <PageNumberItem
          key={i}
          page={i}
          isActive={i === currentPage}
          onPress={onPageChange}
        />,
      );
    }
    pages.push(<PageNumberItem key="ellipsis-right" isEllipsis />);
    pages.push(
      <PageNumberItem
        key={totalPages - 1}
        page={totalPages - 1}
        isActive={currentPage === totalPages - 1}
        onPress={onPageChange}
      />,
    );
    pages.push(
      <PageNumberItem
        key={totalPages}
        page={totalPages}
        isActive={currentPage === totalPages}
        onPress={onPageChange}
      />,
    );
    return pages;
  };

  if (isNil(totalPages)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LimitPicker
        value={limit}
        onChange={onChangeLimit}
        options={pageSizeOptions}
      />
      <TouchableOpacity
        style={currentPage === 1 && styles.disabledBtn}
        onPress={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}>
        <Icon
          type={IconType.ION}
          name="chevron-back-outline"
          size={22}
          color={COLORS.netral600}
        />
      </TouchableOpacity>
      {renderPageNumbers()}
      <TouchableOpacity
        style={currentPage === totalPages && styles.disabledBtn}
        onPress={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}>
        <Icon
          type={IconType.ION}
          name="chevron-forward-outline"
          size={22}
          color={COLORS.netral600}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SIZES.gap,
    paddingVertical: SIZES.gap,
  },
  disabledBtn: {
    opacity: 0.5,
  },
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
    fontSize: 16,
    color: '#888',
  },
});

export default TablePagination;
