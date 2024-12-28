"use client";

import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils'
import { client } from '@/utils/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner';
import NotificationTokenTable from './notification-table';

interface NotificationsListPageProps {
    page: number;
    search?: string;
    pageLimit: number;
    deviceOs?: string;
}
const NotificationsListPage = ({
    page,
    search,
    pageLimit,
    deviceOs,
}: NotificationsListPageProps) => {

    const [spinReload, setSpinReload] = useState(false);

    const filters = {
        page,
        limit: pageLimit,
        ...(search && { search }),
        ...(deviceOs && { deviceOs }),
    };

    const {
        data,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ['get-all-fcms', filters],
        queryFn: async () => {
            const response = await client.fcm.getAllFcmTokensByFilter.$get(filters);
            const { data } = await response.json();
            return data;
        },
        refetchOnMount: true,
    })


    const dataWithDates = data?.fcmTokens.map((token) => ({
        ...token,
        createdAt: new Date(token.createdAt),
        updatedAt: new Date(token.updatedAt),
    }))



    const handleReload = () => {
        setSpinReload(true);
        refetch();
        toast.success('Data Refetched');
        setTimeout(() => {
            setSpinReload(false);
        }, 1000);
    }

    const tokenCount = data?.allTokensCount || 0;
    return (
        <PageContainer scrollable>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={`Registered FCM Toekns (${tokenCount})`}
                        description="Manage all the events assigned to you in the system"
                    />

                    <div className='flex items-center gap-2'>
                        <Button
                            className='active:scale-95 hidden md:flex'
                        >
                            Send Notification
                        </Button>
                        <Button
                            variant={'secondary'}

                            className='active:scale-95 hidden md:flex'
                            onClick={handleReload}
                        >
                            <RotateCcw className={cn("mr-2 h-4 w-4 rotate-180 transition-all",
                                spinReload && "animate-spin"
                            )} />
                            Reload
                        </Button>
                    </div>
                </div>
                <Separator />
                <NotificationTokenTable data={dataWithDates ?? []} totalData={tokenCount} isLoading={isLoading} />
            </div>
        </PageContainer>
    )
}

export default NotificationsListPage