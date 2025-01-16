'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { Booking, Event, Team } from '@prisma/client';
import { useAdminTableFilters } from './use-bookings-table-filters';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';

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

  } = useAdminTableFilters();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="team"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
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
