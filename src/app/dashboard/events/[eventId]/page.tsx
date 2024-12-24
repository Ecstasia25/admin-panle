import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/ui/form-card-skeleton';
import React, { Suspense } from 'react'
import EventEditPage from '../_components/event-edit-page';


interface EventPageProps {
    params: {
        eventId: string;
    }
}

export const metadata = {
    title: 'Event | Ecstasia Panel'
};

const EventPage = ({ params }: EventPageProps) => {
    return (
        <PageContainer scrollable>
            <div className="flex-1 space-y-4">
                <Suspense fallback={<FormCardSkeleton />}>
                    <EventEditPage eventId={params.eventId} />
                </Suspense>
            </div>
        </PageContainer>
    )
}

export default EventPage