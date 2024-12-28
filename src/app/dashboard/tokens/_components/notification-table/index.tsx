'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { Event, FcmTokens } from '@prisma/client';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { OS_OPTIONS, useNotificationFilters } from './use-notification-table-filters';

export default function EventsTable({
  data,
  totalData,
  isLoading
}: {
  data: FcmTokens[];
  totalData: number;
  isLoading?: boolean;

}) {
  const {
    searchQuery,
    setPage,
    setSearchQuery,
    resetFilters,
    isAnyFilterActive,
    deviceOs,
    setDeviceOs

  } = useNotificationFilters();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="deviceOs"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        {/* <DataTableFilterBox
          filterKey="deviceOs"
          title="Device Os"
          options={OS_OPTIONS}
          setFilterValue={setDeviceOs}
          filterValue={deviceOs}
        /> */}
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
