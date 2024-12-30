"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { client } from "@/utils/client"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Loader } from "lucide-react"

interface User {
    email: string
    name: string
    image: string
    createdAt: Date
}

interface RecentUserItemsProps {
    loading: boolean
    userImage: string
    userFallbackString: string
    userName: string
    createdAt: Date
    userEmail: string
}

const RecentUserItems = ({
    loading,
    userImage,
    userFallbackString,
    userEmail,
    userName,
    createdAt
}: RecentUserItemsProps) => {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                    <AvatarImage src={userImage} alt="Avatar" />
                    <AvatarFallback className="uppercase text-sm">
                        {
                            userFallbackString.split(' ').map((word) => word[0]).join('')
                        }
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    {loading ? (
                        <Skeleton className="h-4 w-20 rounded-xl" />
                    ) : (
                        <p className="text-sm font-medium leading-none">
                            {userName}
                        </p>
                    )}
                    {loading ? (
                        <Skeleton className="h-4 w-40 rounded-xl" />
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {userEmail}
                        </p>
                    )}
                </div>
            </div>
            <div className="space-y-1">
                <div className="text-sm font-normal">
                    {format(createdAt, "PPP")}
                </div>
                <div className="text-xs font-normal flex items-center justify-end">
                    {format(createdAt, "hh:mm a")}
                </div>
            </div>
        </div>
    )
}

const RecentUsers = () => {
    const { data: recentUsers, isLoading } = useQuery({
        queryKey: ['get-recent-users'],
        queryFn: async () => {
            const response = await client.auth.getRecentUsers.$get()
            const { users } = await response.json()
            return users.map(user => ({
                ...user,
                createdAt: new Date(user.createdAt)
            })) as User[]
        },
    })

    if (!recentUsers) {
        return (
            <div className="flex min-h-[40vh] w-full items-center justify-center">
                <Loader className="size-6 animate-spin shrink-0" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {recentUsers.map((user) => (
                <RecentUserItems
                    key={user.email}
                    userEmail={user.email}
                    userName={user.name}
                    userImage={user.image}
                    userFallbackString={user.name}
                    createdAt={user.createdAt}
                    loading={isLoading}
                />
            ))}
        </div>
    )
}

export default RecentUsers