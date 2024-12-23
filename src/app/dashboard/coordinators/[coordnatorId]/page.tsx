import PageContainer from "@/components/layout/page-container";
import FormCardSkeleton from "@/components/ui/form-card-skeleton";
import { Suspense } from "react";
import AdminEditPage from "../_components/admin-edit-page";
import CoordinatorEditPage from "../_components/coordinator-edit-page";

export const metadata = {
  title: 'Coordinator | Ecstasia Panel',
};

interface AdminDetailsProps {
  params: {
    coordnatorId: string
  }
}


const AdminDetails = ({
  params
}: AdminDetailsProps) => {


  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <CoordinatorEditPage coordnatorId={params.coordnatorId} />
        </Suspense>
      </div>
    </PageContainer>
  )
}

export default AdminDetails