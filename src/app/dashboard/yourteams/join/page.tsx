"use client"
import PageContainer from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Loader2, Phone, ShieldCheck, Sparkle, UserCheck } from "lucide-react"
import { useUser } from "@/hooks/users/use-user"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/utils/client"
import { Skeleton } from "@/components/ui/skeleton"
import { CopyButton } from "@/components/shared/copy-button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export const TeamCodeFormSchema = z.object({
    teamCode: z
        .string()
        .min(6, "Team code must be 6 characters long")
        .max(6, "Team code must be 6 characters long"),
})

export type TeamCodeFormValues = z.infer<typeof TeamCodeFormSchema>

const JoinDetailsPage = () => {
    const { user } = useUser()
    const router = useRouter()
    const [redirecting, setRedirecting] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ["get-all-college-reaps"],
        queryFn: async () => {
            const response = await client.auth.getReapsByCollegeName.$get({
                collegeName: user?.collegeName || "",
            })
            const { reaps } = await response.json()
            return reaps
        },
    })

    const reapsCount = data?.length || 0

    const form = useForm<TeamCodeFormValues>({
        resolver: zodResolver(TeamCodeFormSchema),
        defaultValues: {
            teamCode: "",
        },
    })

    function onSubmit(values: TeamCodeFormValues) {
        setRedirecting(true)
        router.push(`/dashboard/yourteams/join/${values.teamCode}`)
        setTimeout(() => {
            setRedirecting(false)
        }, 1200)
    }

    return (
        <PageContainer scrollable>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={`Join Team`}
                        description="Join a team by entering the team code "
                    />
                </div>
                <Separator />
                <Card className="mx-auto w-full">
                    <CardHeader className="flex flex-col gap-2">
                        <Alert variant={"destructive"}>
                            <Info className="size-4 shrink-0 mt-0.5" />
                            <AlertTitle>Don’t have a code?</AlertTitle>
                            <AlertDescription>
                                Reach out to your college event representative for assistance.
                                Contact details are provided below.
                            </AlertDescription>
                        </Alert>
                        {isLoading ? (
                            <Skeleton className="w-full h-40" />
                        ) : (
                            <>
                                <Alert>
                                    <ShieldCheck className="size-4 shrink-0 mt-0.5" />
                                    <AlertTitle>
                                        Your College Event
                                        {reapsCount > 0 ? "representatives" : "representative"}{" "}
                                        Details
                                    </AlertTitle>
                                    {reapsCount > 0 ? (
                                        <>
                                            {data?.map((reap, index) => (
                                                <div key={reap.id} className="flex flex-col mt-3">
                                                    <AlertDescription className="text-lg font-semibold underline underline-offset-1 mb-1">
                                                        Representative {index + 1}
                                                    </AlertDescription>
                                                    <AlertDescription className="text-md flex items-center gap-2">
                                                        <UserCheck className="size-4 shrink-0" /> Name :{" "}
                                                        {reap.name}
                                                    </AlertDescription>
                                                    <div className="flex items-center gap-2 justify-between">
                                                        {reap.phone && (
                                                            <AlertDescription className="text-md flex items-center gap-2">
                                                                <Phone className="size-4 shrink-0" /> Contact
                                                                Details : {reap.phone}
                                                            </AlertDescription>
                                                        )}
                                                        {reap.phone && (
                                                            <CopyButton
                                                                value={reap.phone}
                                                                label="Contact Number"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <AlertDescription>
                                            No representatives found for your college
                                        </AlertDescription>
                                    )}
                                </Alert>
                            </>
                        )}
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className=""
                            >
                                <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-3">
                                    <FormField
                                        control={form.control}
                                        name="teamCode"
                                        render={({ field }) => (
                                            <FormItem className="w-[300px]">
                                                <FormLabel>Team Code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="enter team code" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        disabled={redirecting}
                                        type="submit" className="w-full md:w-auto mt-7">
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
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    )
}

export default JoinDetailsPage
