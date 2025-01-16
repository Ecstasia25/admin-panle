"use client"

import PageContainer from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/utils"
import { client } from "@/utils/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { RotateCcw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import MyBookingsTable from "./bookings-table"
import { useUser } from "@/hooks/users/use-user"

interface EventListPageProps {
  page: number
  search?: string
  pageLimit: number
}

const MyBookingsList = ({
  page,
  search,
  pageLimit,
}: EventListPageProps) => {
    const {user} = useUser()
  const [spinReload, setSpinReload] = useState(false)
  const filters = {
    memberId: user?.id || "",
    page,
    limit: pageLimit,
    ...(search && { search }),
  }
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-all-bookings-by-memberId", filters],
    queryFn: async () => {
      const response = await client.booking.getBookingsByMemberId.$get(filters)
        const { data } = await response.json()
      return data
    },
  })

  const bookingsCount = data?.bookingCount || 0

  const dataWithDates = data?.bookings?.map((booking) => ({
    ...booking,
    createdAt: new Date(booking.createdAt),
    updatedAt: new Date(booking.updatedAt),
    team: {
      ...booking.team,
      createdAt: new Date(booking.team.createdAt),
      updatedAt: new Date(booking.team.updatedAt),
    },
    event: {
      ...booking.event,
      createdAt: new Date(booking.event.createdAt),
      updatedAt: new Date(booking.event.updatedAt),
      date: new Date(booking.event.date),
    }
  })) || []

  const handleReload = () => {
    setSpinReload(true)
    queryClient.invalidateQueries({
      queryKey: ["get-all-bookings-by-memberId", filters],
      exact: true,
    })
    refetch()
    toast.success("Data Refetched")
    setTimeout(() => {
      setSpinReload(false)
    }, 1000)
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`My Bookings (${bookingsCount})`}
            description="View all your bookings here"
          />

          <div className="flex items-center gap-2">
            <Button
              variant={"secondary"}
              className="active:scale-95 hidden md:flex"
              onClick={handleReload}
            >
              <RotateCcw
                className={cn(
                  "mr-2 h-4 w-4 rotate-180 transition-all",
                  spinReload && "animate-spin"
                )}
              />
              Reload
            </Button>
          </div>
        </div>
        <Separator />
        <MyBookingsTable
          data={dataWithDates}
          totalData={bookingsCount}
          isLoading={isLoading}
        />
      </div>
    </PageContainer>
  )
}

export default MyBookingsList
