'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { Event } from '@prisma/client';
import { CATEGORY_OPTIONS, GROUP_SIZE_OPTIONS, STAGE_OPTIONS, useAdminTableFilters } from './use-events-table-filters';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';

export default function EventsTable({
  data,
  totalData,
  isLoading
}: {
  data: Event[];
  totalData: number;
  isLoading?: boolean;

}) {
  const {
    searchQuery,
    setPage,
    setSearchQuery,
    resetFilters,
    isAnyFilterActive,
    stageFilter,
    setStageFilter,
    groupSizeFilter,
    setGroupSizeFilter,
    categoryFilter,
    setCategoryFilter,

  } = useAdminTableFilters();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="title"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
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
          filterKey="stage"
          title="Stage"
          options={STAGE_OPTIONS}
          setFilterValue={
            setStageFilter
          }
          filterValue={stageFilter}
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
