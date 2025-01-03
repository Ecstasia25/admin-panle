import PageContainer from "@/components/layout/page-container";
import FormCardSkeleton from "@/components/ui/form-card-skeleton";
import { Suspense } from "react";
import ReapEditPage from "../_components/reaps-edit-page";

export const metadata = {
  title: 'Reap | Ecstasia Panel',
};

interface AdminDetailsProps {
  params: {
    reapId: string
  }
}


const ReapDetails = ({
  params
}: AdminDetailsProps) => {


  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ReapEditPage reapId={params.reapId} />
        </Suspense>
      </div>
    </PageContainer>
  )
}

export default ReapDetails