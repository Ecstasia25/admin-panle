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
import BookingsTable from "./bookings-table"
import { useUser } from "@/hooks/users/use-user"

interface EventListPageProps {
    page: number
    search?: string
    pageLimit: number
    groupSize?: string
    category?: "DANCE" | "MUSIC" | "DRAMA" | "LITERARY" | "INFORMALS" | "ART" | "SPORTS" | "PHOTORAPHY";
    bookingStatus?: "PENDING" | "CONFIRMED" | "CANCELLED";
}

const AllBookingsList = ({
    page,
    search,
    pageLimit,
    groupSize,
    category,
    bookingStatus,
}: EventListPageProps) => {
    const { user } = useUser()
    const [spinReload, setSpinReload] = useState(false)
    const filters = {
        corId: user?.id || "",
        page,
        limit: pageLimit,
        ...(search && { search }),
        ...(groupSize && { groupSize }),
        ...(category && { category: category as "DANCE" | "MUSIC" | "DRAMA" | "LITERARY" | "INFORMALS" | "ART" | "SPORTS" | "PHOTORAPHY" }),
        ...(bookingStatus && { bookingStatus: bookingStatus as "PENDING" | "CONFIRMED" | "CANCELLED" }),
    }
    const queryClient = useQueryClient()

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-all-bookings", filters],
        queryFn: async () => {
            const response = await client.booking.getAllBookingsByCorId.$get(filters)
            const { data } = await response.json()
            return data
        },
    })

    const bookingsCount = data?.bookingsCount || 0

    const dataWithDates =
        data?.bookings?.map((booking) => ({
            ...booking,
            createdAt: new Date(booking.createdAt),
            updatedAt: new Date(booking.updatedAt),
            team: {
                ...booking.team,
                createdAt: new Date(booking.team.createdAt),
                updatedAt: new Date(booking.team.updatedAt),
                members: booking.team.members.map((member) => ({
                    ...member,
                    createdAt: new Date(member.createdAt),
                    updatedAt: new Date(member.updatedAt),
                  })),
            },
            event: {
                ...booking.event,
                createdAt: new Date(booking.event.createdAt),
                updatedAt: new Date(booking.event.updatedAt),
                date: new Date(booking.event.date),
            },
        })) || []

    const handleReload = () => {
        setSpinReload(true)
        queryClient.invalidateQueries({
            queryKey: ["get-all-bookings", filters],
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
                        title={`All Bookings (${bookingsCount})`}
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
                <BookingsTable
                    data={dataWithDates}
                    totalData={bookingsCount}
                    isLoading={isLoading}
                />
            </div>
        </PageContainer>
    )
}

export default AllBookingsList
