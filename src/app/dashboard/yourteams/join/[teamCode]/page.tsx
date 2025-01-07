"use client"
import PageContainer from "@/components/layout/page-container"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/hooks/users/use-user"
import { client } from "@/utils/client"
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Copy,
    CopyCheck,
    HeartCrack,
    HeartHandshake,
    Info,
    Loader2,
    Mail,
    MoveRight,
    PartyPopper,
    Sparkle,
    Sticker,
    TriangleAlert,
    UserRound,
    UserRoundSearch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { DynamicModal } from "@/components/ui/dynamic-modal"
import { z } from "zod"

interface TeamJoinConfirmationPageProps {
    params: {
        teamCode: string
    }
}

// Form schemas
const TeamCodeFormSchema = z.object({
    teamCode: z.string().min(6, "Team code must be 6 characters long").max(6, "Team code must be 6 characters long"),
})

const TeamExitFormSchema = z.object({
    teamCode: z.string().min(1, "Team code is required"),
})

type TeamCodeFormValues = z.infer<typeof TeamCodeFormSchema>
type TeamExitFormValues = z.infer<typeof TeamExitFormSchema>

const TeamJoinConfirmationPage = ({
    params,
}: TeamJoinConfirmationPageProps) => {
    const { user } = useUser()
    const [showExitModal, setShowExitModal] = useState(false)
    const [isCopying, setIsCopying] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()
    const [redirecting, setRedirecting] = useState(false)

    // Query for team data
    const { data: teamData, isLoading } = useQuery({
        queryKey: ["get-team-by-teamcode", params.teamCode],
        queryFn: async () => {
            const response = await client.team.getTeamByTeamCode.$get({
                teamId: params.teamCode,
            })
            const { team } = await response.json()
            return team
        },
    })

    // Join team form
    const joinForm = useForm<TeamCodeFormValues>({
        resolver: zodResolver(TeamCodeFormSchema),
        defaultValues: {
            teamCode: "",
        },
    })

    // Exit team form
    const exitForm = useForm<TeamExitFormValues>({
        resolver: zodResolver(TeamExitFormSchema),
        defaultValues: {
            teamCode: "",
        },
    })

    // Join team mutation
    const { mutate: joinTeam, isPending: isJoiningTeam } = useMutation({
        mutationFn: async (data: { id: string; userId: string }) => {
            const res = await client.team.joinTeam.$post(data)
            if (!res.ok) throw new Error("Failed to join team")
            const json = await res.json()
            if (!json.success) throw new Error(json.message || "Failed to join team")
            return json
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["get-team-by-teamcode", params.teamCode],
            })
            toast.success(`Joined ${teamData?.name} successfully`)
        },
        onError: (error) => toast.error(error.message),
    })

    // Exit team mutation
    const { mutate: exitTeam, isPending: isExitingTeam } = useMutation({
        mutationFn: async (data: { id: string; userId: string }) => {
            const res = await client.team.exitTeam.$post(data)
            if (!res.ok) throw new Error("Failed to exit team")
            const json = await res.json()
            if (!json.success) throw new Error(json.message || "Failed to exit team")
            return json
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["get-team-by-teamcode", params.teamCode],
            })
            toast.success(`Exited ${teamData?.name} successfully`)
            setShowExitModal(false)
            exitForm.reset()
        },
        onError: (error) => {
            toast.error(error.message)
            exitForm.reset()
        },
    })

    // Form submission handlers
    const onJoinSubmit = (values: TeamCodeFormValues) => {
        setRedirecting(true)
        router.push(`/dashboard/yourteams/join/${values.teamCode}`)
        setTimeout(() => {
            setRedirecting(false)
        }, 1200)
    }

    const onExitSubmit = (values: TeamExitFormValues) => {
        if (values.teamCode !== teamData?.teamId) {
            toast.error("Team code does not match")
            return
        }

        if (teamData) {
            exitTeam({
                id: teamData.id,
                userId: user?.id || "",
            })
        }
    }

    // Utility functions
    const onCopy = (id: string) => {
        setIsCopying(true)
        navigator.clipboard.writeText(id)
        toast.success("Team code copied")
        setTimeout(() => {
            setIsCopying(false)
        }, 2000)
    }

    const handleJoinTeam = () => {
        if (user?.collegeName === null) {
            toast.info("Please update your college name on profile to join a team")
            return
        }
        if (teamData) {
            joinTeam({
                id: teamData.id,
                userId: user?.id || "",
            })
        } else {
            toast.error("Team data is not available")
        }
    }

    // Computed values
    const isReachedMaxMembers =
        teamData?.members?.length === Number(teamData?.groupSize)
    const checkUserPresentInTeam = teamData?.members?.find(
        (member) => member.id === user?.id
    )

    // Loading state
    if (isLoading) {
        return (
            <PageContainer scrollable>
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <Skeleton className="w-72 h-8" />
                    </div>
                    <Separator />
                </div>
            </PageContainer>
        )
    }

    // No team found state
    if (!teamData?.name) {
        return (
            <PageContainer scrollable>
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <Heading
                            title={`No Team Found with Team Code: ${params.teamCode}`}
                            description="Please check the team code and try again or enter a valid team code"
                        />
                    </div>
                    <Separator />
                    <Card>
                        <CardHeader>
                            <Alert
                                variant="destructive"
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <Info className="size-4 shrink-0" />
                                    <AlertTitle>
                                        Contact your college event representative for assistance
                                    </AlertTitle>
                                </div>
                                <Link href="/dashboard/yourteams/join">
                                    <Button>View Details</Button>
                                </Link>
                            </Alert>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Form {...joinForm}>
                                <form onSubmit={joinForm.handleSubmit(onJoinSubmit)}>
                                    <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-3">
                                        <FormField
                                            control={joinForm.control}
                                            name="teamCode"
                                            render={({ field }) => (
                                                <FormItem className="w-[300px]">
                                                    <FormLabel>Enter New Valid Team Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter team code" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            disabled={redirecting}
                                            type="submit"
                                            className="w-full md:w-auto mt-7"
                                        >
                                            {redirecting ? "Joining" : "Join Team"}
                                            {redirecting ? (
                                                <Loader2 className="size-4 shrink-0 ml-2 animate-spin" />
                                            ) : (
                                                <Sparkle className="size-4 shrink-0 ml-2" />
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardHeader>
                    </Card>
                </div>
            </PageContainer>
        )
    }

    // Main render
    return (
        <>
            <PageContainer scrollable>
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <Heading
                            title={`Join Team: ${teamData.name}`}
                            description="Confirm your team join request"
                        />
                    </div>
                    <Separator />
                    <Card className="mx-auto w-full">
                        <CardHeader className="flex flex-col gap-2">
                            <Alert>
                                <Info className="size-4 shrink-0 mt-0.5" />
                                <AlertTitle className="flex items-center gap-2 w-full mb-2">
                                    Team Info <MoveRight className="size-4 shrink-0 mt-0.5" />
                                </AlertTitle>
                                <AlertDescription className="mt-2">
                                    <span className="font-semibold">College Name: </span>
                                    {teamData.reap.collegeName}
                                </AlertDescription>
                                <AlertDescription className="mt-2">
                                    <span className="font-semibold">Representative Name: </span>
                                    {teamData.reap.name}
                                </AlertDescription>
                                <AlertDescription className="mt-2">
                                    <span className="font-semibold">Maximum Team Members: </span>
                                    {teamData.groupSize}
                                </AlertDescription>
                            </Alert>
                        </CardHeader>
                        <CardContent>
                            {teamData.members?.length > 0 ? (
                                <Alert>
                                    <Info className="size-4 shrink-0 mt-0.5" />
                                    <AlertTitle className="flex items-center gap-2 w-full mb-2">
                                        Joined Members
                                        <MoveRight className="size-4 shrink-0 mt-0.5" />
                                    </AlertTitle>
                                    {teamData.members.map((member) => (
                                        <AlertDescription
                                            key={member.id}
                                            className="mt-2 flex items-center gap-2"
                                        >
                                            <span className="font-semibold flex items-center gap-1">
                                                <UserRound className="size-4 shrink-0" />
                                                Name:
                                            </span>
                                            {member.name} /
                                            <span className="font-semibold flex items-center gap-1">
                                                <Mail className="size-4 shrink-0" />
                                                Email:
                                            </span>
                                            {member.email}
                                        </AlertDescription>
                                    ))}
                                </Alert>
                            ) : (
                                <Alert>
                                    <Info className="size-4 shrink-0 mt-0.5" />
                                    <AlertTitle className="flex items-center gap-2 w-full mb-2 text-md font-normal">
                                        No Members Joined Yet
                                        <UserRoundSearch className="size-4 shrink-0 mt-0.5" />
                                    </AlertTitle>
                                </Alert>
                            )}
                            <div className="w-full flex items-center justify-end mt-3">
                                {checkUserPresentInTeam ? (
                                    <Button disabled>
                                        Already Joined
                                        <PartyPopper className="size-4 shrink-0 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleJoinTeam}
                                        disabled={isJoiningTeam || isReachedMaxMembers}
                                    >
                                        {isReachedMaxMembers
                                            ? "Team Full"
                                            : isJoiningTeam
                                                ? "Joining"
                                                : "Confirm Join Request"}
                                        {isJoiningTeam ? (
                                            <Loader2 className="size-4 shrink-0 ml-2 animate-spin" />
                                        ) : isReachedMaxMembers ? (
                                            <Sticker className="size-4 shrink-0 ml-2" />
                                        ) : (
                                            <HeartHandshake className="size-4 shrink-0 ml-2" />
                                        )}
                                    </Button>
                                )}
                                {checkUserPresentInTeam && (
                                    <Button
                                        onClick={() => setShowExitModal(true)}
                                        disabled={isExitingTeam}
                                        className="ml-3"
                                        variant="destructive"
                                    >
                                        {isExitingTeam ? "Exiting" : "Exit Team"}
                                        {isExitingTeam ? (
                                            <Loader2 className="size-4 shrink-0 ml-2 animate-spin" />
                                        ) : (
                                            <HeartCrack className="size-4 shrink-0 ml-2" />
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>

            <DynamicModal
                showModal={showExitModal}
                setShowModal={setShowExitModal}
                onClose={() => {
                    setShowExitModal(false)
                    exitForm.reset()
                }}
            >
                <div className="flex flex-col gap-3 px-6 py-6 md:px-3 md:py-3">
                    <h1 className="text-xl font-semibold flex items-center gap-2">
                        Exit Team
                        <TriangleAlert className="size-4 shrink-0 mt-0.5" />
                    </h1>
                    <p className="text-sm font-normal">
                        Are you sure you want to exit the team?
                    </p>
                    <Form {...exitForm}>
                        <form
                            onSubmit={exitForm.handleSubmit(onExitSubmit)}
                            className="flex flex-col w-full gap-2"
                        >
                            <div className="w-full">
                                <FormField
                                    control={exitForm.control}
                                    name="teamCode"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <div className="w-full flex items-center justify-between">
                                                <FormLabel>Enter Team Code to Confirm Exit</FormLabel>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    className="active:scale-95 flex items-center justify-center"
                                                    onClick={() => onCopy(teamData?.teamId || "")}
                                                >
                                                    {isCopying ? (
                                                        <CopyCheck className="size-4 shrink-0 text-green-500" />
                                                    ) : (
                                                        <Copy className="size-4 shrink-0" />
                                                    )}
                                                </Button>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter team code to confirm exit"
                                                    {...field}
                                                    disabled={isExitingTeam}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Please enter the team code to confirm your exit
                                            </p>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full flex items-center justify-end gap-3 mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowExitModal(false)
                                        exitForm.reset()
                                    }}
                                    disabled={isExitingTeam}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={isExitingTeam || !exitForm.formState.isValid}
                                >
                                    {isExitingTeam ? "Exiting" : "Confirm Exit"}
                                    {isExitingTeam && (
                                        <Loader2 className="size-4 shrink-0 ml-2 animate-spin" />
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DynamicModal>
        </>
    )
}

export default TeamJoinConfirmationPage
