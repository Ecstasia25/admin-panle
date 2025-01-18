import PageContainer from "@/components/layout/page-container"
import { Suspense } from "react"
import FormCardSkeleton from "@/components/ui/form-card-skeleton"
import EventBookingsPage from "./_components/booking-page"

export const metadata = {
  title: "Book | Ecstasia Panel",
}

interface EventBookingProps {
  params: {
    eventId: string
  }
}

const EventBooking = ({ params }: EventBookingProps) => {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <EventBookingsPage eventId={params.eventId} />
        </Suspense>
      </div>
    </PageContainer>
  )
}

export default EventBooking
