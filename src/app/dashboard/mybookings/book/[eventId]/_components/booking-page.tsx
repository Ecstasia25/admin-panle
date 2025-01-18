"use client"

import { useUser } from "@/hooks/users/use-user"
import { client } from "@/utils/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { RiTeamLine } from "react-icons/ri"
import { cn } from "@/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronDown } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { CopyButton } from "@/components/shared/copy-button"

interface EventBookingsPageProps {
  eventId: string
}

// Schema validation for the booking form
const BookingFormSchema = z.object({
  leaderId: z.string().nonempty("Leader ID is required"),
  eventId: z.string().nonempty("Event ID is required"),
  price: z.string().nonempty("Price is required"),
  teamId: z.string().nonempty("Team is required"),
  paymentScreenshot: z.string().nonempty("Payment Screenshot is required"),
})

type BookingFormValues = z.infer<typeof BookingFormSchema>

const EventBookingsPage = ({ eventId }: EventBookingsPageProps) => {
  const [isFormReady, setIsFormReady] = useState(false)
  const { user } = useUser()

  const upiId = process.env.NEXT_PUBLIC_PAYMENT_UPI_ID!

  // Form setup with zod validation
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      leaderId: "",
      eventId,
      teamId: "",
      price: "",
      paymentScreenshot: "",
    },
  })

  // Fetch event data
  const { data: eventData, isLoading: isEventLoading } = useQuery({
    queryKey: ["get-event", eventId],
    queryFn: async () => {
      const response = await client.event.getEventById.$get({ id: eventId })
      const { event } = await response.json()
      return event
    },
  })

  // Fetch teams for the user
  const { data: teamsData, isLoading: isTeamLoading } = useQuery({
    queryKey: ["user-teams", user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const response = await client.team.getTeamsByMemberId.$get({
        memberId: user.id,
      })
      const { data } = await response.json()
      return data
    },
    enabled: !!user?.id,
  })

  // Calculate price dynamically
  const calculatedPrice = () => {
    if (!eventData) return ""
    const { pricePerPerson, groupSize, price } = eventData
    if (pricePerPerson) {
      return (parseFloat(price) * parseInt(groupSize)).toString()
    }
    return price
  }

  // Set form defaults when event and user data are ready
  useEffect(() => {
    if (eventData && user) {
      form.reset({
        leaderId: user.id,
        eventId: eventData.id,
        price: calculatedPrice(),
        teamId: "",
        paymentScreenshot: "",
      })
      setIsFormReady(true)
    }
  }, [eventData, user, form, isFormReady])

  // Form submission handler
  const onSubmit = (values: BookingFormValues) => {
    console.log("Form submitted with values:", values)
  }

  const isFixedTeamSize = eventData?.pricePerPerson

  const filteredTeams = isFixedTeamSize
    ? teamsData?.teams
    : teamsData?.teams.filter(
        (team) => team.members.length === Number(eventData?.groupSize)
      )

  const teams =
    filteredTeams?.map((team) => ({
      value: team.id,
      label: team.name,
    })) || []

  const Square = ({
    className,
    children,
  }: {
    className?: string
    children: React.ReactNode
  }) => (
    <span
      data-square
      className={cn(
        "flex size-5 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground",
        className
      )}
      aria-hidden="true"
    >
      {children}
    </span>
  )

  return (
    <Card className="mx-auto w-full min-h-[90vh]">
      <CardHeader>
        <div className="w-full flex items-center justify-between">
          {isEventLoading ? (
            <Skeleton className="w-[50%] h-8" />
          ) : (
            <CardTitle className="text-left text-2xl font-bold">
              Register for {eventData?.title}
            </CardTitle>
          )}
        </div>
      </CardHeader>
      <Separator className="w-full mb-4" />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isEventLoading ? (
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="w-[40%] h-5" />
                <Skeleton className="w-[40%] h-5" />
                <Skeleton className="w-[40%] h-5" />
              </div>
            ) : (
              <div className="w-full flex flex-col gap-3">
                <h1 className="text-md font-medium">
                  Event Title: {eventData?.title}
                </h1>
                {eventData?.pricePerPerson ? (
                  <h1 className="text-md font-medium">
                    Registration fee for each participant: ₹ {eventData?.price}{" "}
                    /-
                  </h1>
                ) : (
                  <h1 className="text-md font-medium">
                    Registration fee for the team: ₹ {calculatedPrice()} /-
                  </h1>
                )}
                <h1 className="text-md font-medium">
                  {eventData?.pricePerPerson
                    ? `Maximum ${eventData?.groupSize} participants allowed in a team`
                    : `Only ${eventData?.groupSize} members team allowed for this event`}
                </h1>
              </div>
            )}
            {isTeamLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : teamsData?.teams?.length ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-1 md:col-span-3 flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="teamId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col col-span-2">
                        <div className="flex flex-col gap-1">
                          <FormLabel>Select your team</FormLabel>
                          <p className="text-sm font-medium text-red-600 w-[70%]">
                            Here you can see only eligible teams for this event
                            (in case of any issue contact college
                            representative) *
                          </p>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[400px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? teams.find(
                                      (team) => team.value === team.value
                                    )?.label
                                  : "Choose your team"}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command>
                              <CommandInput placeholder="Search team..." />
                              <CommandList>
                                <CommandEmpty>No teams found</CommandEmpty>
                                <CommandGroup>
                                  {teams.map((team) => (
                                    <CommandItem
                                      value={team.label}
                                      key={team.value}
                                      onSelect={() => {
                                        form.setValue("teamId", team.value)
                                      }}
                                    >
                                      <Square className="bg-indigo-400/20 text-indigo-500 mt-1">
                                        {team.label.charAt(0).toUpperCase()}
                                      </Square>
                                      {team.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          team.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup>
                                  <Link href="/dashboard/yourteams/join">
                                    <Button
                                      variant={"ghost"}
                                      className="w-full justify-start font-normal"
                                    >
                                      <RiTeamLine className="size-4 shrink-0 mr-2" />
                                      Join a new team
                                    </Button>
                                  </Link>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-sapn-1 flex flex-col gap-2 items-start justify-start border rounded-xl p-4">
                    <Image
                      src="/payment-qr/qr.jpg"
                      width={400}
                      height={400}
                      alt="Payment QR Code"
                      className="w-72 border object-cover rounded-xl pointer-events-none select-none"
                    />
                    <div className="flex items-center gap-2">
                      <h1 className="font-medium text-sm">UPI ID: {upiId}</h1>
                      <CopyButton label="UPI ID" value={upiId} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end">
                <Link href="/dashboard/yourteams/join">
                  <Button className="flex items-center gap-2">
                    Join a Team to Register
                    <RiTeamLine className="size-4 shrink-0" />
                  </Button>
                </Link>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default EventBookingsPage
