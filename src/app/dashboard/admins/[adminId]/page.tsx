import PageContainer from "@/components/layout/page-container";
import FormCardSkeleton from "@/components/ui/form-card-skeleton";
import { Suspense } from "react";
import AdminEditPage from "../_components/admin-edit-page";

export const metadata = {
  title: 'Admin | Ecstasia Panel',
};

interface AdminDetailsProps {
  params: {
    adminId: string
  }
}


const AdminDetails = ({
  params
}: AdminDetailsProps) => {


  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <AdminEditPage adminId={params.adminId} />
        </Suspense>
      </div>
    </PageContainer>
  )
}

export default AdminDetails