"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { client } from "@/utils/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Team } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, RotateCcw, Save, WandSparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { cn } from "@/utils"
import { useUser } from "@/hooks/users/use-user"
import { generateTeamId } from "@/lib/utils"
import FormCardSkeleton from "@/components/ui/form-card-skeleton"
import { MultiSelect } from "@/components/ui/multi-select"
import { CopyInput } from "@/components/ui/copy-input"

type MemberOption = {
    value: string
    label: string
}

const GROUP_SIZE = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const

const TeamFormSchema = z.object({
    name: z.string().min(1, { message: "Team name is required" }),
    teamId: z.string().min(3, { message: "Team ID is required" }),
    groupSize: z.string({ required_error: "Group size is required" }),
    reapId: z.string({ required_error: "Representative ID is required" }),
    members: z.array(z.string()),
})

type TeamFormValues = z.infer<typeof TeamFormSchema>

export default function MyTeamForm({
    initialData,
    pageTitle,
    teamId,
}: {
    initialData: (Team & { members: { id: string }[] }) | null
    pageTitle: string
    teamId?: string
}) {
    const { user } = useUser()
    const [spinReload, setSpinReload] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()
    const [isFormReady, setIsFormReady] = useState(false)

    

    const form = useForm<TeamFormValues>({
        resolver: zodResolver(TeamFormSchema),
        defaultValues: {
            name: "",
            teamId: generateTeamId(),
            groupSize: "1",
            reapId: user?.id || "",
            members: [],
        },
    })

    // Query for team data
    const { data: teamData, isLoading: isTeamLoading } = useQuery({
        queryKey: ["get-team", teamId],
        queryFn: async () => {
            if (!teamId) return null
            const response = await client.team.getTeamById.$get({ id: teamId })
            const { team } = await response.json()
            return team
        },
        enabled: !!teamId,
    })

    // Query for college users
    const { data: collegeUsers, isLoading: isCollegeUsersLoading } = useQuery({
        queryKey: ["get-college-users", user?.collegeName],
        queryFn: async () => {
            if (!user?.collegeName) return []
            const response = await client.auth.getAllUsersByCollegeName.$get({
                collegeName: user.collegeName,
            })
            const { users } = await response.json()
            return users
        },
        enabled: !!user?.collegeName,
    })

    // Format user options for MultiSelect, excluding the current user and team representative
    const formatedUserOptions: MemberOption[] = collegeUsers
        ?.filter((collegeUser) => {
            const isCurrentUser = collegeUser.id === user?.id
            const isTeamRep = teamData?.reapId === collegeUser.id
            return !isCurrentUser && !isTeamRep
        })
        .map((user) => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
        })) || []

    // Handle form initialization and updates
    useEffect(() => {
        if (teamData && !isTeamLoading) {
            const memberIds = teamData.members
                .filter((member) => member.id !== teamData.reapId)
                .map((member) => member.id)

            form.reset({
                name: teamData.name,
                groupSize: teamData.groupSize.toString(),
                teamId: teamData.teamId,
                reapId: teamData.reapId,
                members: memberIds,
            })
            setIsFormReady(true)
        }
    }, [teamData, isTeamLoading, form])

    // Create team mutation
    const { mutate: createTeam, isPending: isCreatingTeam } = useMutation({
        mutationFn: async (data: TeamFormValues) => {
            const res = await client.team.createTeam.$post(data)
            if (!res.ok) throw new Error("Failed to create team")
            const json = await res.json()
            if (!json.success) throw new Error(json.message || "Failed to create team")
            return json
        },
        onSuccess: () => {
            toast.success("Team created successfully")
            router.push("/dashboard/myteams")
        },
        onError: (error) => toast.error(error.message),
    })

    // Update team mutation
    const { mutate: updateTeam, isPending: isUpdatingTeam } = useMutation({
        mutationFn: async (data: TeamFormValues) => {
            if (!teamId) throw new Error("Team ID is required for update")
            const res = await client.team.updateTeam.$post({
                ...data,
                id: teamId,
            })
            if (!res.ok) throw new Error("Failed to update team")
            const json = await res.json()
            if (!json.success) throw new Error(json.message || "Failed to update team")
            return json
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-team"] })
            toast.success("Team updated successfully")
        },
        onError: (error) => toast.error(error.message),
    })

    function reloadPage() {
        queryClient.invalidateQueries({ queryKey: ["get-team"] })
        setSpinReload(true)
        router.refresh()
        setTimeout(() => {
            setSpinReload(false)
        }, 900)
    }

    function onSubmit(values: TeamFormValues) {
        // Validate team size
        const selectedMembersCount = values.members.length
        const maxGroupSize = parseInt(values.groupSize)

        if (selectedMembersCount > maxGroupSize) { // -1 to account for the representative
            toast.error(`Maximum ${maxGroupSize} members allowed for this team size`)
            return
        }

        if (teamId) {
            updateTeam(values)
        } else {
            createTeam(values)
        }
    }

    // Show loading state
    if (teamId && (isTeamLoading || !isFormReady)) {
        return <FormCardSkeleton />
    }

    const isLoading = isTeamLoading || isCollegeUsersLoading
    const isPending = isCreatingTeam || isUpdatingTeam

    const newChangesMade = 
    form.formState.isDirty ||
    form.getValues("name") !== teamData?.name ||
    form.getValues("groupSize") !== teamData?.groupSize.toString() ||
    form.getValues("members").length !== teamData?.members.length ||
    form.getValues("members").some((member: string) => !teamData?.members.some((m) => m.id === member))

    return (
        <Card className="mx-auto w-full">
            <CardHeader>
                <div className="w-full flex items-center justify-between">
                    <CardTitle className="text-left text-2xl font-bold">
                        {pageTitle} {initialData?.name ? `(${initialData.name})` : ""}
                    </CardTitle>
                    <Button
                        variant="outline"
                        className="active:scale-95 hidden md:flex"
                        onClick={reloadPage}
                        disabled={isLoading || isPending}
                    >
                        <RotateCcw
                            className={cn(
                                "mr-2 h-4 w-4 rotate-180 transition-all",
                                spinReload && "animate-spin"
                            )}
                        />
                        Reload Window
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Team Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter team name"
                                                {...field}
                                                disabled={isLoading || isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="groupSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Team Size (maximum members)</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isLoading || isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select team size" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {GROUP_SIZE.map((size) => (
                                                    <SelectItem key={size} value={size}>
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {teamId && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="teamId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Team ID</FormLabel>
                                                <FormControl>
                                                    <CopyInput
                                                        value={field.value}
                                                        readOnly
                                                        className="bg-muted"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <FormLabel>Representative Name (Not Editable)</FormLabel>
                                        <Input
                                            value={teamData?.reap?.name ?? ""}
                                            disabled
                                            className="bg-muted mt-2"
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="reapId"
                                        render={({ field }) => (
                                            <FormItem className="-mt-3">
                                                <FormLabel>Representative ID (Not Editable)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled className="bg-muted" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <FormLabel>Representative College Name (Not Editable)</FormLabel>
                                        <Input
                                            value={teamData?.reap?.collegeName ?? ""}
                                            disabled
                                            className="bg-muted mt-2"
                                        />
                                    </div>
                                </>
                            )}
                            <FormField
                                control={form.control}
                                name="members"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>
                                            Add Team Members (From {user?.collegeName})
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={formatedUserOptions}
                                                value={field.value}
                                                defaultValue={field.value}
                                                onValueChange={field.onChange}
                                                placeholder="Select members"
                                                disabled={isLoading || isPending}
                                                maxCount={parseInt(form.getValues("groupSize"))}
                                                variant="inverted"
                                                className="bg-background"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full flex items-center justify-end">
                            <Button
                                disabled={isLoading || isPending || !newChangesMade}
                                type="submit"
                                className="mr-2"
                            >
                                {teamId ? (
                                    <>
                                        Update
                                        {isUpdatingTeam ? (
                                            <Loader2 className="size-4 ml-2 shrink-0 animate-spin" />
                                        ) : (
                                            <Save className="size-4 ml-2 shrink-0" />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        Create
                                        {isCreatingTeam ? (
                                            <Loader2 className="size-4 ml-2 shrink-0 animate-spin" />
                                        ) : (
                                            <WandSparkles className="size-4 ml-2 shrink-0" />
                                        )}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}