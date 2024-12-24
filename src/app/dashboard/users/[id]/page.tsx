import PageContainer from "@/components/layout/page-container";
import FormCardSkeleton from "@/components/ui/form-card-skeleton";
import { Suspense } from "react";
import UserEditPage from "../_components/user-edit-page";

export const metadata = {
  title: 'User | Ecstasia Panel',
};

interface AdminDetailsProps {
  params: {
    id: string
  }
}


const AdminDetails = ({
  params
}: AdminDetailsProps) => {


  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <UserEditPage id={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  )
}

export default AdminDetails