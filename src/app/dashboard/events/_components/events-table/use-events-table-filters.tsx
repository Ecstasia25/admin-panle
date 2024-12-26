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

export const CATEGORY_OPTIONS = [
  { value: 'DANCE', label: 'DANCE' },
  { value: 'MUSIC', label: 'MUSIC' },
  { value: 'DRAMA', label: 'DRAMA' },
  { value: 'LITERARY', label: 'LITERARY' },
  { value: 'INFORMALS', label: 'INFORMALS' },
  { value: 'ART', label: 'ART' },
  { value: 'SPORTS', label: 'SPORTS' },
  { value: 'PHOTORAPHY', label: 'PHOTORAPHY' }
];

export const DAY_OPTIONS = [
  { value: "DAY1", label: "DAY1" },
  { value: "DAY2", label: "DAY2" }
]

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

  const [categoryFilter, setCategoryFilter] = useQueryState(
    'category',
    searchParams.category.withOptions({ shallow: false }).withDefault('')
  );

  const [dayFilter, setDayFilter] = useQueryState(
    'day',
    searchParams.day.withOptions({ shallow: false }).withDefault('')
  )

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStageFilter('');
    setGroupSizeFilter('');
    setCategoryFilter('');
    setDayFilter('');
    setPage(1);
  }, [setSearchQuery, setStageFilter, setGroupSizeFilter, setCategoryFilter, setPage, setDayFilter]);

  const isAnyFilterActive = useMemo(() => {
    return Boolean(
      searchQuery ||
      stageFilter ||
      groupSizeFilter ||
      dayFilter ||
      categoryFilter ||
      (page !== 1)
    );
  }, [searchQuery, stageFilter, groupSizeFilter, categoryFilter, page, dayFilter]);

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
    setGroupSizeFilter,
    categoryFilter,
    setCategoryFilter,
    dayFilter,
    setDayFilter
  };
}