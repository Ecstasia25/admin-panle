"use client"

import { ImageUploader } from "@/components/shared/image-uploader"
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
import { Textarea } from "@/components/ui/textarea"
import { client } from "@/utils/client"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Event,
  EventCategory,
  EventDay,
  EventStage,
  User,
} from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  CalendarIcon,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  WandSparkles,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { cn } from "@/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelect } from "@/components/ui/multi-select"
import FormCardSkeleton from "@/components/ui/form-card-skeleton"

const GROUP_SIZE = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
] as const

type CoordinatorOption = {
  value: string
  label: string
}

const EventFormSchema = z.object({
  title: z.string().min(3, { message: "Title is Required" }),
  rules: z.array(z.string()).min(1, {
    message: "Rules is Required",
  }),
  category: z.nativeEnum(EventCategory, {
    required_error: "Category is Required",
  }),
  poster: z.string({ required_error: "Poster is Required" }),
  date: z.date({ required_error: "Date is Required" }),
  stage: z.nativeEnum(EventStage, { required_error: "Stage is Required" }),
  groupSize: z.string({ required_error: "Group Size is Required" }),
  slotCount: z.string({ required_error: "Slot Count is Required" }),
  archived: z.boolean().optional(),
  price: z.string({ required_error: "Price is Required" }),
  pricePerPerson: z.boolean().optional(),
  day: z.nativeEnum(EventDay, {
    required_error: "Event day is required",
  }),
  coordinators: z.array(z.string()).min(1, {
    message: "At least one coordinator is required",
  }),
})

type EventFormValues = z.infer<typeof EventFormSchema>

export default function EventForm({
  initialData,
  pageTitle,
  eventId,
}: {
  initialData: Event | null
  pageTitle: string
  eventId?: string
}) {
  const [spinReload, setSpinReload] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isFormReady, setIsFormReady] = useState(false)

  const { data: coordinatorOptions, isLoading: isCoordinatorsLoading } =
    useQuery({
      queryKey: ["get-event-coordinators"],
      queryFn: async () => {
        const response = await client.auth.getCooForEvent.$get()
        const { coordinators } = await response.json()
        return coordinators
      },
    })

  const { data: eventData, isLoading: isEventLoading } = useQuery({
    queryKey: ["get-event"],
    queryFn: async () => {
      if (!eventId) throw new Error("Event ID is required")
      const response = await client.event.getEventById.$get({ id: eventId })
      const { event } = await response.json()
      return event
    },
  })

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: "",
      rules: [],
      category: EventCategory.DANCE,
      poster: "",
      date: new Date(),
      stage: EventStage.OFFSTAGE,
      groupSize: "1",
      slotCount: "30",
      archived: false,
      pricePerPerson: false,
      price: "100",
      day: "DAY1",
      coordinators: [],
    },
  })

  useEffect(() => {
    if (eventData && !isCoordinatorsLoading && !isEventLoading) {
      form.reset({
        title: eventData.title,
        rules: eventData.rules,
        category: eventData.category,
        poster: eventData.poster,
        date: new Date(eventData.date),
        stage: eventData.stage,
        groupSize: eventData.groupSize.toString(),
        slotCount: eventData.slotCount.toString(),
        archived: eventData.archived,
        price: eventData.price.toString(),
        pricePerPerson: eventData.pricePerPerson,
        day: eventData.day,
        coordinators: eventData.coordinators.map(
          (coordinator) => coordinator.id
        ),
      })
      setIsFormReady(true)
    }
  }, [initialData, isEventLoading, form, isFormReady])

  const formatedCoordinatorOptions: CoordinatorOption[] =
    coordinatorOptions?.map((coordinator) => ({
      value: coordinator.id,
      label: coordinator.name || "",
    })) || []

  const { mutate: createEvent, isPending: isCreatingEvent } = useMutation({
    mutationFn: async (data: EventFormValues) => {
      const res = await client.event.createEvent.$post(data)
      if (!res.ok) throw new Error("Failed to create event")
      const json = await res.json()
      if (!json.success)
        throw new Error(json.message || "Failed to create event")
      return json
    },
    onSuccess: () => {
      toast.success("Event created successfully")
      router.push("/dashboard/events")
    },
    onError: (error) => toast.error(error.message),
  })

  const { mutate: updateEvent, isPending: isUpdatingEvent } = useMutation({
    mutationFn: async (data: EventFormValues) => {
      const res = await client.event.updateEvent.$post({
        ...data,
        id: initialData?.id || "",
      })
      if (!res.ok) throw new Error("Failed to update event")
      const json = await res.json()
      if (!json.success)
        throw new Error(json.message || "Failed to update event")
      return json
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-event"] })
      toast.success("Event updated successfully")
    },
    onError: (error) => toast.error(error.message),
  })

  function relaodPage() {
    queryClient.invalidateQueries({ queryKey: ["get-event"] })
    setSpinReload(true)
    window.location.reload()
    router.refresh()
    setTimeout(() => {
      setSpinReload(false)
    }, 900)
  }

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue("date", date)
    }
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
    const currentDate = form.getValues("date") || new Date()
    let newDate = new Date(currentDate)

    if (type === "hour") {
      const hour = parseInt(value, 10)
      const isPM = newDate.getHours() >= 12
      newDate.setHours(isPM ? hour + 12 : hour)
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10))
    } else if (type === "ampm") {
      const hours = newDate.getHours()
      const currentHour = hours % 12
      if (value === "AM" && hours >= 12) {
        newDate.setHours(currentHour)
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(currentHour + 12)
      }
    }

    form.setValue("date", newDate)
  }

  function onSubmit(values: EventFormValues) {
    if (eventId) {
      updateEvent(values)
    } else {
      createEvent(values)
    }
  }

  if (eventId && (isEventLoading || !isFormReady)) {
    return <FormCardSkeleton />
  }

  const RulesInput = ({
    value,
    onChange,
  }: {
    value: string[]
    onChange: (value: string[]) => void
  }) => {
    const [rules, setRules] = useState(Array.isArray(value) ? value : [""])

    const handleAddRule = () => {
      setRules([...rules, ""])
    }

    const handleRemoveRule = (index: number) => {
      const newRules = rules.filter((_, i) => i !== index)
      setRules(newRules)
      onChange(newRules)
    }

    const handleRuleChange = (index: number, newValue: string) => {
      const newRules = rules.map((rule, i) => (i === index ? newValue : rule))
      setRules(newRules)
      onChange(newRules)
    }

    return (
      <ScrollArea className="h-[200px] w-full p-4 border rounded-xl border-primary">
        <div className="space-y-2 m-2">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={rule}
                onChange={(e) => handleRuleChange(index, e.target.value)}
                placeholder={`Rule ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleRemoveRule(index)}
                className="h-10 w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRule}
            className="w-full"
          >
            Add Rule
            <Plus className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </ScrollArea>
    )
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <div className="w-full flex items-center justify-between">
          <CardTitle className="text-left text-2xl font-bold">
            {pageTitle} {initialData?.title ? `(${initialData.title})` : ""}
          </CardTitle>
          <Button
            variant="outline"
            className="active:scale-95 hidden md:flex"
            onClick={relaodPage}
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
            <div className="w-full flex flex-col md:flex-row items-start h-full">
              <div className="w-full md:w-2/6 h-full">
                <FormField
                  control={form.control}
                  name="poster"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Poster</FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value ? [field.value] : []}
                          onChange={(url) => field.onChange(url)}
                          onRemove={() => field.onChange("")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full md:w-4/6 flex-1 flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Rules</FormLabel>
                      <FormControl>
                        <RulesInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full md:w-1/2">
                        <FormLabel>Enter event date & time (12h)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full h-10 pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP hh:mm aa")
                                ) : (
                                  <span>MM/DD/YYYY hh:mm aa</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <div className="sm:flex">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={handleDateSelect}
                                initialFocus
                              />
                              <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                                <ScrollArea className="w-64 sm:w-auto">
                                  <div className="flex sm:flex-col p-2">
                                    {Array.from({ length: 12 }, (_, i) => i + 1)
                                      .reverse()
                                      .map((hour) => (
                                        <Button
                                          key={hour}
                                          size="icon"
                                          variant={
                                            field.value &&
                                            field.value.getHours() % 12 ===
                                              hour % 12
                                              ? "default"
                                              : "ghost"
                                          }
                                          className="sm:w-full shrink-0 aspect-square"
                                          onClick={() =>
                                            handleTimeChange(
                                              "hour",
                                              hour.toString()
                                            )
                                          }
                                        >
                                          {hour}
                                        </Button>
                                      ))}
                                  </div>
                                  <ScrollBar
                                    orientation="horizontal"
                                    className="sm:hidden"
                                  />
                                </ScrollArea>
                                <ScrollArea className="w-64 sm:w-auto">
                                  <div className="flex sm:flex-col p-2">
                                    {Array.from(
                                      { length: 12 },
                                      (_, i) => i * 5
                                    ).map((minute) => (
                                      <Button
                                        key={minute}
                                        size="icon"
                                        variant={
                                          field.value &&
                                          field.value.getMinutes() === minute
                                            ? "default"
                                            : "ghost"
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() =>
                                          handleTimeChange(
                                            "minute",
                                            minute.toString()
                                          )
                                        }
                                      >
                                        {minute.toString().padStart(2, "0")}
                                      </Button>
                                    ))}
                                  </div>
                                  <ScrollBar
                                    orientation="horizontal"
                                    className="sm:hidden"
                                  />
                                </ScrollArea>
                                <ScrollArea className="">
                                  <div className="flex sm:flex-col p-2">
                                    {["AM", "PM"].map((ampm) => (
                                      <Button
                                        key={ampm}
                                        size="icon"
                                        variant={
                                          field.value &&
                                          ((ampm === "AM" &&
                                            field.value.getHours() < 12) ||
                                            (ampm === "PM" &&
                                              field.value.getHours() >= 12))
                                            ? "default"
                                            : "ghost"
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() =>
                                          handleTimeChange("ampm", ampm)
                                        }
                                      >
                                        {ampm}
                                      </Button>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem className="w-full md:w-1/2 -mt-2">
                        <FormLabel>Event Day</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(EventDay).map((stage) => (
                              <SelectItem key={stage} value={stage}>
                                {stage}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Event Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(EventCategory).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                name="stage"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Event Stage Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event stage type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(EventStage).map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
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
                name="pricePerPerson"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white dark:bg-background">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Price per person</FormLabel>
                      <FormDescription className="-ml-6 text-xs">
                        If you enable this, the price will be calculated per
                        person
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Event Price / Price per person</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coordinators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Coordinators</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={formatedCoordinatorOptions}
                        value={field.value}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select Coordinators"
                        disabled={isCoordinatorsLoading}
                        maxCount={1}
                        variant="inverted"
                        className="bg-background"
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
                  <FormItem className="w-full">
                    <FormLabel>
                      Event Group Size(member count in a team)
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event group size" />
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
                name="slotCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Slot Avaliable Count</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter slot count" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="archived"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white dark:bg-background">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Archive Event</FormLabel>
                      <FormDescription className="-ml-6 text-xs">
                        If you enable this, the event will be archived and not
                        visible to users
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex items-center justify-end">
              <Button type="submit" className="mr-2">
                {initialData?.id ? (
                  <>
                    Update
                    {isUpdatingEvent ? (
                      <Loader2 className="size-4 ml-2 shrink-0 animate-spin" />
                    ) : (
                      <Save className="size-4 ml-2 shrink-0" />
                    )}
                  </>
                ) : (
                  <>
                    Create
                    {isCreatingEvent ? (
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
