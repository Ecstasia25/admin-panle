"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
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
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { cn } from "@/utils"
import { useUser } from "@/hooks/users/use-user"
import { generateTeamId } from "@/lib/utils"
import FormCardSkeleton from "@/components/ui/form-card-skeleton"
import { Checkbox } from "@/components/ui/checkbox"

const GROUP_SIZE = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const

const TeamFormSchema = z.object({
    name: z.string().min(1, { message: "Team name is required" }),
    teamId: z.string().min(3, { message: "Team ID is required" }),
    groupSize: z.string({ required_error: "Group size is required" }),
    reapId: z.string({ required_error: "Representative ID is required" }),
    collegeOnly: z.boolean().optional(),
})

type TeamFormValues = z.infer<typeof TeamFormSchema>

export default function TeamForm({
    initialData,
    pageTitle,
    teamId,
}: {
    initialData: Team | null
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
            collegeOnly: false,
        },
    })

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

    useEffect(() => {
        if (user) {
            form.setValue("reapId", user.id)
        }
    }, [user, form])

    useEffect(() => {
        if (teamData && !isTeamLoading) {
            form.reset({
                name: teamData.name,
                groupSize: teamData.groupSize.toString(),
                teamId: teamData.teamId,
                reapId: teamData.reapId,
                collegeOnly: teamData.collegeOnly,
            })
            setIsFormReady(true)
        }
    }, [teamData, isTeamLoading, form])

    const { mutate: createTeam, isPending: isCreatingTeam } = useMutation({
        mutationFn: async (data: TeamFormValues) => {
            const res = await client.team.createTeam.$post(data)
            if (!res.ok) throw new Error("Failed to create team")
            const json = await res.json()
            if (!json.success)
                throw new Error(json.message || "Failed to create team")
            return json
        },
        onSuccess: () => {
            toast.success("Team created successfully")
            router.push("/dashboard/teams")
        },
        onError: (error) => toast.error(error.message),
    })

    const { mutate: updateTeam, isPending: isUpdatingTeam } = useMutation({
        mutationFn: async (data: TeamFormValues) => {
            if (!teamId) throw new Error("Team ID is required for update")
            const res = await client.team.updateTeam.$post({
                ...data,
                id: teamId,
            })
            if (!res.ok) throw new Error("Failed to update team")
            const json = await res.json()
            if (!json.success)
                throw new Error(json.message || "Failed to update team")
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
        if (teamId) {
            updateTeam(values)
        } else {
            createTeam(values)
        }
    }

    if (teamId && (isTeamLoading || !isFormReady)) {
        return <FormCardSkeleton />
    }

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
                                            <Input placeholder="Enter team name" {...field} />
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                            <FormField
                                control={form.control}
                                name="collegeOnly"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white dark:bg-background">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>College Only</FormLabel>
                                            <FormDescription className="-ml-6 text-xs">
                                                If you enable this, only college students can join this
                                                team.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {teamId && (
                                <FormField
                                    control={form.control}
                                    name="teamId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Team ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Team ID"
                                                    {...field}
                                                    disabled
                                                    className="bg-muted"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {teamId && (
                                <div className="felx flex-col">
                                    <FormLabel>Representative Name</FormLabel>
                                    <Input
                                        value={teamData?.reap?.name ?? ""}
                                        disabled
                                        className="bg-muted mt-2"
                                    />
                                </div>
                            )}
                            {teamId && (
                                <FormField
                                    control={form.control}
                                    name="reapId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Representative ID</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled className="bg-muted" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        <div className="w-full flex items-center justify-end">
                            <Button
                                disabled={isCreatingTeam || isUpdatingTeam || isTeamLoading}
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
