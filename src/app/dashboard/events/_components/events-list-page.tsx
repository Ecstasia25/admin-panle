"use client"

import PageContainer from "@/components/layout/page-container";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils";
import { Plus, RotateCcw } from "lucide-react";
import Link from "next/link";

interface EventListPageProps {
    page: number;
    search?: string;
    pageLimit: number;
}

const EventListPage = ({
    page,
    search,
    pageLimit
}: EventListPageProps) => {
    return (
        <PageContainer scrollable>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={`Events `}
                        description="Manage all the events in the system"
                    />

                    <div className='flex items-center gap-2'>
                        <Button
                            variant={'secondary'}

                            className='active:scale-95 hidden md:flex'
                        >
                            <RotateCcw className={cn("mr-2 h-4 w-4 rotate-180 transition-all",

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

            </div>
        </PageContainer>
    )
}

export default EventListPage