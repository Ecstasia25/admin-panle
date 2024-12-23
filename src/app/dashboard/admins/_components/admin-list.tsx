"use client";
import PageContainer from '@/components/layout/page-container'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils'
import { Plus, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Heading } from '@/components/ui/heading'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/utils/client'
import AdminsTable from "./admins-table"
import { toast } from 'sonner'
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton'

interface AdminListingPageProps {
  page: number;
  search?: string;
  pageLimit: number;
}

const AdminListingPage = ({
  page,
  search,
  pageLimit
}: AdminListingPageProps) => {
  const [spinReload, setSpinReload] = React.useState(false);
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
  };

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['get-all-admins', filters],
    queryFn: async () => {
      const response = await client.auth.getAllAdmins.$get(filters);
      const { data } = await response.json();
      return data;
    },
  })

  const adminsCount = data?.allAdminsCount || 0;

  const dataWithDates = data?.admins?.map((admin) => ({
    ...admin,
    createdAt: new Date(admin.createdAt),
    updatedAt: new Date(admin.updatedAt),
  }))

  const handleReload = () => {
    setSpinReload(true);
    queryClient.invalidateQueries({ queryKey: ['get-all-admins', filters], exact: true });
    refetch();
    toast.success('Data Refetched');
    setTimeout(() => {
      setSpinReload(false);
    }, 1000)
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Admins (${adminsCount})`}
            description="Manage all the admins in the system"
          />

          <div className='flex items-center gap-2'>
            <Button
              variant={'secondary'}
              onClick={handleReload}
              className='active:scale-95'
            >
              <RotateCcw className={cn("mr-2 h-4 w-4 rotate-180 transition-all",
                spinReload && "animate-spin"
              )} />
              Reload
            </Button>
            <Link
              href={'/dashboard/admins/new'}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
        <Separator />

        {/* {isLoading ? (
          <DataTableSkeleton columnCount={6} rowCount={5} />
        ) : ( */}
          <AdminsTable
            data={dataWithDates || []}
            totalData={adminsCount}
            isLoading={isLoading}
          />
        {/* )} */}
      </div>
    </PageContainer>
  )
}

export default AdminListingPage