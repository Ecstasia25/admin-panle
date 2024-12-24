"use client";
import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils'
import { RotateCcw } from 'lucide-react'
import React from 'react'
import { Heading } from '@/components/ui/heading'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/utils/client'

import { toast } from 'sonner'
import { useUser } from '@/hooks/users/use-user';
import UserTable from './users-table';
interface UserListPageProps {
  page: number;
  search?: string;
  pageLimit: number;
}

const UserListPage = ({
  page,
  search,
  pageLimit
}: UserListPageProps) => {
  const { user } = useUser();
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
    queryKey: ['get-all-users', filters],
    queryFn: async () => {
      const response = await client.auth.getAllUsers.$get(filters);
      const { data } = await response.json();
      return data;
    },
  })

  const coordsCount = data?.allUsersCount || 0;

  const dataWithDates = data?.users?.map((user) => ({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  })).filter((coordinator) => coordinator.id !== user?.id);

  const handleReload = () => {
    setSpinReload(true);
    queryClient.invalidateQueries({ queryKey: ['get-all-coordinators', filters], exact: true });
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
            title={`User (${coordsCount})`}
            description="Manage all the users in the system"
          />

          <div className='flex items-center gap-2'>
            <Button
              variant={'secondary'}
              onClick={handleReload}
              className='active:scale-95 hidden md:flex'
            >
              <RotateCcw className={cn("mr-2 h-4 w-4 rotate-180 transition-all",
                spinReload && "animate-spin"
              )} />
              Reload
            </Button>
            {/* <Link
              href={'/dashboard/admins/new'}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link> */}
          </div>
        </div>
        <Separator />

        {/* {isLoading ? (
          <DataTableSkeleton columnCount={6} rowCount={5} />
        ) : ( */}
        <UserTable
          data={dataWithDates || []}
          totalData={coordsCount}
          isLoading={isLoading}
        />
        {/* )} */}
      </div>
    </PageContainer>
  )
}

export default UserListPage