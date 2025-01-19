'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';


export const GROUP_SIZE_OPTIONS = [
  { value: '1', label: 'SOLO' },
  { value: '2', label: 'DUO' },
  { value: '4', label: 'SQUAD' },
  { value: "6", label: "SEXTET" },
  { value: '8', label: 'OCTET' },
  { value: '10', label: 'CREW' }
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

export const BOOKING_STATUS = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'CONFIRMED', label: 'CONFIRMED' },
  { value: 'CANCELLED', label: 'CANCELLED' }
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

  const [groupSizeFilter, setGroupSizeFilter] = useQueryState(
    'groupSize',
    searchParams.groupSize.withOptions({ shallow: false }).withDefault('')
  );

  const [categoryFilter, setCategoryFilter] = useQueryState(
    'category',
    searchParams.category.withOptions({ shallow: false }).withDefault('')
  );

  const [bookingStatusFilter, setBookingStatusFilter] = useQueryState(
    'bookingStatus',
    searchParams.bookingStatus.withOptions({ shallow: false }).withDefault('')
  )

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setPage(1);
    setGroupSizeFilter('');
    setCategoryFilter('');
    setBookingStatusFilter('')
  }, [setSearchQuery,  setPage, setGroupSizeFilter, setCategoryFilter, setBookingStatusFilter]);

  const isAnyFilterActive = useMemo(() => {
    return Boolean(
      searchQuery ||
      groupSizeFilter ||
      categoryFilter ||
      bookingStatusFilter ||

      (page !== 1)
    );
  }, [searchQuery,  page, groupSizeFilter, categoryFilter, bookingStatusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    groupSizeFilter,
    setGroupSizeFilter,
    categoryFilter,
    setCategoryFilter,
    bookingStatusFilter,
    setBookingStatusFilter
  };
}