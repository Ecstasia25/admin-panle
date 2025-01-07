"use client"

import PageContainer from "@/components/layout/page-container"
import { Button, buttonVariants } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/utils"
import { client } from "@/utils/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import TeamsTable from "./teams-table"
import { useUser } from "@/hooks/users/use-user"
import { useRouter } from "next/navigation"

interface YourTeamListProps {
  page: number
  search?: string
  pageLimit: number
  groupSize?: string
}

const YourTeamList = ({
  page,
  search,
  pageLimit,
  groupSize,
}: YourTeamListProps) => {
  const { user } = useUser()
  const router = useRouter()
  const [spinReload, setSpinReload] = useState(false)

  const filters = {
    memberId: user?.id || "",
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(groupSize && { groupSize }),
  }
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-your-joined-teams", filters],
    queryFn: async () => {
      const response = await client.team.getTeamsByMemberId.$get(filters)
      const { data } = await response.json()
      return data
    },
  })

  const teamsCount = data?.allTeamsCount || 0

  const dataWithDates = data?.teams?.map((team) => ({
    ...team,
    createdAt: new Date(team.createdAt),
    updatedAt: new Date(team.updatedAt),
  }))

  const handleReload = () => {
    setSpinReload(true)
    queryClient.invalidateQueries({
      queryKey: ["get-your-joined-teams", filters],
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
            title={`Joined Teams (${teamsCount})`}
            description="View all your teams you joined"
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
            <Link
              href={"/dashboard/yourteams/join"}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Join
            </Link>
          </div>
        </div>
        <Separator />
        <TeamsTable
          data={dataWithDates || []}
          totalData={teamsCount}
          isLoading={isLoading}
        />

        <Separator />
      </div>
    </PageContainer>
  )
}

export default YourTeamList
