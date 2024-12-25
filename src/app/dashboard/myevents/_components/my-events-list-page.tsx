"use client"

import PageContainer from "@/components/layout/page-container";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils";
import { client } from "@/utils/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import MyEventsTable from "./my-events-table"
import { ApiHeading } from "@/components/shared/api-heading";
import { ApiList } from "./my-events-table/api-list";
import { useUser } from "@/hooks/users/use-user";
import { useRouter } from "next/navigation";

interface MyEventsListPageProps {
    page: number;
    search?: string;
    pageLimit: number;
    stage?: "ONSTAGE" | "OFFSTAGE" | undefined | null;
    groupSize?: string;
}

const MyEventsListPage = ({
    page,
    search,
    pageLimit,
    stage,
    groupSize,
}: MyEventsListPageProps) => {
    const { user } = useUser();
    const router = useRouter();
    const [spinReload, setSpinReload] = useState(false);



    const filters = {
        id: user?.id,
        page,
        limit: pageLimit,
        ...(search && { search }),
        ...(stage && { stage: stage as "ONSTAGE" | "OFFSTAGE" }),
        ...(groupSize && { groupSize }),
    };
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ['get-all-coevents', filters],
        queryFn: async () => {
            const response = await client.coevents.getFilteredCordEventsByCoId.$get(filters);
            const { data } = await response.json();
            return data;
        },
    })

    const eventsCount = data?.allCoordEvntsCount || 0;

    const dataWithDates = data?.allCoordEvents?.map((event) => ({
        ...event,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
        date: new Date(event.date),
    }))



    const handleReload = () => {
        setSpinReload(true);
        queryClient.invalidateQueries({ queryKey: ['get-all-coevents', filters], exact: true });
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
                        title={`Assigned Events (${eventsCount})`}
                        description="Manage all the events assigned to you in the system"
                    />

                    <div className='flex items-center gap-2'>
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
                <MyEventsTable
                    data={dataWithDates || []}
                    totalData={eventsCount}
                    isLoading={isLoading}
                />

                <ApiHeading title="API" description="API calls for my events" />
                <Separator />
                <ApiList entityName="myevents" entityNameId="id" />
            </div>
        </PageContainer>
    )
}

export default MyEventsListPage