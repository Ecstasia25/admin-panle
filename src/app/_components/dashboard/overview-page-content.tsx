"use client"

import PageContainer from "@/components/layout/page-container"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/hooks/users/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/utils/client"
import { NumberTicker } from "@/components/shared/number-ticker"
import { Button } from "@/components/ui/button"
import {
  Clapperboard,
  Loader,
  UserCog,
  UserPlus,
  UsersRound,
} from "lucide-react"
import RecentUsers from "./recent-users"
import { useRouter } from "next/navigation"

const OverViewPageDetails = () => {
  const { user, isLoading } = useUser()

  const router = useRouter()

  if (user?.role !== "SUPERADMIN") {
    router.replace("/dashboard/profile")
  } else {
    router.replace("/dashboard")
  }

  const { data, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["get-overview-details"],
    queryFn: async () => {
      const response = await client.overview.getOverviewDetails.$get()
      const { data } = await response.json()
      return data
    },
  })

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center">
        <Loader className="size-10 shrink-0 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          {isLoading ? (
            <Skeleton className="w-[220px] h-8" />
          ) : (
            <h2 className="text-2xl font-bold tracking-tight">
              Hi, {user?.name?.split(" ")[0]} Welcome back 👋
            </h2>
          )}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="mt-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {isOverviewLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-4">
                <Skeleton className="w-60 h-24" />
                <Skeleton className="w-60 h-24" />
                <Skeleton className="w-60 h-24" />
                <Skeleton className="w-60 h-24" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      Total Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data && <NumberTicker value={data.events.length} />}
                  </CardContent>
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="noeffect"
                      size="icon"
                      className="flex items-center justify-center bg-yellow-500/30"
                    >
                      <Clapperboard className="size-5 shrink-0 text-yellow-600" />
                    </Button>
                  </div>
                </Card>
                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      Total Reaps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data && <NumberTicker value={data.reaps.length} />}
                  </CardContent>
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="noeffect"
                      size="icon"
                      className="flex items-center justify-center bg-rose-500/30"
                    >
                      <UserCog className="size-5 shrink-0 text-rose-600" />
                    </Button>
                  </div>
                </Card>
                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      Total Coordinators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data && <NumberTicker value={data.coordinators.length} />}
                  </CardContent>
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="noeffect"
                      size="icon"
                      className="flex items-center justify-center bg-violet-500/30"
                    >
                      <UserPlus className="size-5 shrink-0 text-violet-600" />
                    </Button>
                  </div>
                </Card>
                <Card className="relative">
                  <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data && <NumberTicker value={data.users.length} />}
                  </CardContent>
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="noeffect"
                      size="icon"
                      className="flex items-center justify-center bg-green-500/30"
                    >
                      <UsersRound className="size-5 shrink-0 text-green-600" />
                    </Button>
                  </div>
                </Card>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8">
              <Card className="col-span-4 md:col-span-4">
                <CardHeader className="mb-4">
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentUsers />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            analytics
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}

export default OverViewPageDetails
