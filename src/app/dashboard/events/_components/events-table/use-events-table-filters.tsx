'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const STAGE_OPTIONS = [
  { value: 'ONSTAGE', label: 'ONSTAGE' },
  { value: 'OFFSTAGE', label: 'OFFSTAGE' }
];

export const GROUP_SIZE_OPTIONS = [
  { value: '1', label: 'SOLO' },
  { value: '2', label: 'DUO' },
  { value: '4', label: 'SQUAD' },
  { value: '8', label: 'TEAM' }
];

export function useAdminTableFilters() {
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

  const [stageFilter, setStageFilter] = useQueryState(
    'stage',
    searchParams.stage.withOptions({ shallow: false }).withDefault('')
  );

  const [groupSizeFilter, setGroupSizeFilter] = useQueryState(
    'groupSize',
    searchParams.groupSize.withOptions({ shallow: false }).withDefault('')
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);

    setPage(1);
  }, [setSearchQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery
  }, [searchQuery,]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    stageFilter,
    setStageFilter,
    groupSizeFilter,
    setGroupSizeFilter
  };
}
