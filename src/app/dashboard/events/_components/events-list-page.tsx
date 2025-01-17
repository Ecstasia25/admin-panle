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
import EventsTable from "./events-table"
import { ApiHeading } from "@/components/shared/api-heading";
import { ApiList } from "./events-table/api-list";

interface EventListPageProps {
    page: number;
    search?: string;
    pageLimit: number;
    stage?: "ONSTAGE" | "OFFSTAGE" | undefined | null;
    groupSize?: string;
    day?: string;
    category?: "DANCE" | "MUSIC" | "DRAMA" | "LITERARY" | "INFORMALS" | "ART" | "SPORTS" | "PHOTORAPHY";
}

const EventListPage = ({
    page,
    search,
    pageLimit,
    stage,
    groupSize,
    category,
    day
}: EventListPageProps) => {
    const [spinReload, setSpinReload] = useState(false);
    const filters = {
        page,
        limit: pageLimit,
        ...(search && { search }),
        ...(stage && { stage: stage as "ONSTAGE" | "OFFSTAGE" }),
        ...(groupSize && { groupSize }),
        ...(day && { day }),
        ...(category && { category: category as "DANCE" | "MUSIC" | "DRAMA" | "LITERARY" | "INFORMALS" | "ART" | "SPORTS" | "PHOTORAPHY" }),
    };
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        refetch
    } = useQuery({
        queryKey: ['get-all-events', filters],
        queryFn: async () => {
            const response = await client.event.getEvents.$get(filters);
            const { data } = await response.json();
            return data;
        },
    })

    const eventsCount = data?.allEventCount || 0;

    const dataWithDates = data?.events?.map((event) => ({
        ...event,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
        date: new Date(event.date),
    }))



    const handleReload = () => {
        setSpinReload(true);
        queryClient.invalidateQueries({ queryKey: ['get-all-events', filters], exact: true });
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
                        title={`Events (${eventsCount})`}
                        description="Manage all the events in the system"
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
                        <Link
                            href={'/dashboard/events/new'}
                            className={cn(buttonVariants({ variant: 'default' }))}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add New
                        </Link>
                    </div>
                </div>
                <Separator />
                <EventsTable
                    data={dataWithDates || []}
                    totalData={eventsCount}
                    isLoading={isLoading}
                />

                <ApiHeading title="API" description="API calls for events" />
                <Separator />
                <ApiList entityName="event" entityNameId="id" />
            </div>
        </PageContainer>
    )
}

export default EventListPage