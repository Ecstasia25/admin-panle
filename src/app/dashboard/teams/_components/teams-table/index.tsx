'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { Team } from '@prisma/client';
import { GROUP_SIZE_OPTIONS, useAdminTableFilters } from './use-team-table-filters';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';

export default function EventsTable({
  data,
  totalData,
  isLoading
}: {
  data: Team[];
  totalData: number;
  isLoading?: boolean;

}) {
  const {
    searchQuery,
    setPage,
    setSearchQuery,
    resetFilters,
    isAnyFilterActive,
    groupSizeFilter,
    setGroupSizeFilter,
  } = useAdminTableFilters();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
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
