import { useState, useCallback } from 'react';
import { SortOrder } from 'types/api';

export type UseTablePaginationProps = {
  initialPage?: number;
  initialLimit?: number;
  initialSort?: SortOrder;
  initialField?: string;
};

export const useTable = ({
  initialPage = 1,
  initialLimit = 10,
  initialSort = SortOrder.ASC,
  initialField = 'id',
}: UseTablePaginationProps = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [sort, setSort] = useState<SortOrder | null>(initialSort);
  const [field, setField] = useState<string | null>(initialField);

  const onChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const onToggleSort = useCallback(
    (newField: string) => {
      if (newField !== field) {
        setField(newField);
        setSort(SortOrder.ASC);
      }
      setSort(sort === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC);
      setPage(1);
    },
    [field, sort],
  );

  return {
    page,
    limit,
    sort,
    field,
    onChangePage,
    onChangeLimit,
    onToggleSort,
  };
};
