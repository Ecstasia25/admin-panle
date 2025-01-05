import PageContainer from '@/components/layout/page-container';
import FormCardSkeleton from '@/components/ui/form-card-skeleton';
import { Suspense } from 'react'
import MyTeamEditPage from '../_components/team-edit.page';


interface EventPageProps {
    params: {
        teamId: string;
    }
}

export const metadata = {
    title: 'My Team | Ecstasia Panel'
};

const EventPage = ({ params }: EventPageProps) => {
    return (
        <PageContainer scrollable>
            <div className="flex-1 space-y-4">
                <Suspense fallback={<FormCardSkeleton />}>
                    <MyTeamEditPage teamId={params.teamId} />
                </Suspense>
            </div>
        </PageContainer>
    )
}

export default EventPage