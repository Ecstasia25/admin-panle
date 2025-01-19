'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

import { Booking, Event, Team } from '@prisma/client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { BOOKING_STATUS, CATEGORY_OPTIONS, GROUP_SIZE_OPTIONS, useAdminTableFilters } from './use-bookings-table-filters';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { columns } from './columns';

interface BookingWithTeam extends Booking {
  team: Team;
  event: Event;
}

export default function EventsTable({
  data,
  totalData,
  isLoading
}: {
  data: BookingWithTeam[];
  totalData: number;
  isLoading?: boolean;

}) {
  const {
    searchQuery,
    setPage,
    setSearchQuery,
    resetFilters,
    isAnyFilterActive,
    categoryFilter,
    setCategoryFilter,
    groupSizeFilter,
    setGroupSizeFilter,
    bookingStatusFilter,
    setBookingStatusFilter

  } = useAdminTableFilters();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="bookingId"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableFilterBox
          filterKey="bookingStatus"
          title="Booking Status"
          options={BOOKING_STATUS}
          setFilterValue={
            setBookingStatusFilter
          }
          filterValue={bookingStatusFilter}
        />
        <DataTableFilterBox
          filterKey="category"
          title="Category"
          options={CATEGORY_OPTIONS}
          setFilterValue={
            setCategoryFilter
          }
          filterValue={categoryFilter}
        />
        <DataTableFilterBox
          filterKey="groupSize"
          title="Group Size"
          options={GROUP_SIZE_OPTIONS}
          setFilterValue={
            setGroupSizeFilter
          }
          filterValue={
            groupSizeFilter
          }
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable
        isLoading={isLoading}
        columns={columns} data={data} totalItems={totalData}
        noResultHeaderWidth='min-w-[130px]'
      />

    </div>
  );
}
