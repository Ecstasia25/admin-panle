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

    const token = "eo3FDGFULUY_9WL4CP6s7K:APA91bGyNem6KqtQg1KeFi85Dp9zxPrWWtNr_ouYztkXUVYEH6L476E-DWHkboSFWzK0RcSxxzaNDqD9QDTGa5KEda3rCQip2Zb4xvbqBztWb1nDS6QaYBY"

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


    const { mutate: sendNotification } = useMutation({
        mutationFn: async (data: { token: string; title: string; body: string, logoUrl: string, imageUrl: string, clickAction: string }) => {
            const res = await client.notification.sendNotification.$post({
                token: data.token,
                title: data.title,
                body: data.body,
                logoUrl: data.logoUrl,
                imageUrl: data.imageUrl,
                clickAction: data.clickAction,
            })
            const json = await res.json()
            if (!json.success) throw new Error(json.message)
            return json
        },
        onSuccess: () => {
            toast.success("Notification sent")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to send notification")
        },
    })
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
                            onClick={() => {
                                sendNotification({
                                    token: token,
                                    title: "Ecstasia 2025",
                                    body: "New Event Added",
                                    logoUrl: "https://firebasestorage.googleapis.com/v0/b/ecstasia2024.appspot.com/o/Typo%20and%20Logos%2FLOGO.svg?alt=media&token=82bd1e1d-26f8-4a0c-b2f4-f5115909b837",
                                    imageUrl: "https://ecstasia.uem.edu.in/assets/knownsense/knownsense.png",
                                    clickAction: "https://ecstasia.uem.edu.in/"
                                })
                            }}
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