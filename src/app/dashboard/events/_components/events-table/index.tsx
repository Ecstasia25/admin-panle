'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { Event, User } from '@prisma/client';
import { useAdminTableFilters } from './use-events-table-filters';

export default function EmployeeTable({
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
      </div>
      <DataTable
        isLoading={isLoading}
        columns={columns} data={data} totalItems={totalData} />

    </div>
  );
}