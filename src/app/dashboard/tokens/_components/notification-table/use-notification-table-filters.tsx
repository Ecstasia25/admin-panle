'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const OS_OPTIONS = [
  { value: 'Android', label: 'Android' },
  { value: 'IOS', label: 'IOS' },
  { value: 'Windows', label: 'Windows' }
]

export function useNotificationFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );


  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const [deviceOs, setDeviceOs] = useQueryState(
    'deviceOs',
    searchParams.deviceOs.withDefault('')
  )

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setDeviceOs('');
    setPage(1);
  }, [setSearchQuery, setPage, setDeviceOs]);

  const isAnyFilterActive = useMemo(() => {
    return Boolean(
      searchQuery ||
      deviceOs ||
      (page !== 1)
    )
  }, [searchQuery, deviceOs, page]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    deviceOs,
    setDeviceOs
  };
}
