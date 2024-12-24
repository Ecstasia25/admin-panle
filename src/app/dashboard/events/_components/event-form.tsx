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
import { PhoneInput } from "@/components/ui/phone-input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/hooks/users/use-user"
import { client } from "@/utils/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Event, EventStage } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CalendarIcon, Loader2, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
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


const GROUP_SIZE = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const


export const EventFormSchema = z.object({
    title: z.string().min(3, {
        message: "Title is Required",
    }),
    description: z.string().min(10, {
        message: "Description is Required",
    }),
    poster: z.string({
        required_error: "Poster is Required",
    }),
    date: z.date({
        required_error: "Date is Required",
    }),
    stage: z.nativeEnum(EventStage, {
        required_error: "Stage is Required",
    }),
    groupSize: z.string({
        required_error: "Group Size is Required",
    }),
    slotCount: z.string({
        required_error: "Slot Count is Required",
    }),
    archived: z.boolean().optional(),
    price: z.string({
        required_error: "Price is Required",
    }),
    discount: z.string().optional(),
    finalPrice: z.string().optional(),
    coordinatorsId: z.array(z.string(), {
        required_error: "Coordinator is Required",
    }),
})

export default function EventForm({
    initialData,
    pageTitle,
    pageState,
}: {
    initialData: Event | null
    pageTitle: string
    pageState: "create" | "edit"
}) {
    const [spinReload, setSpinReload] = useState(false);
    const router = useRouter()
    const {
        data,
        isLoading,
    } = useQuery({
        queryKey: ['get-event-coordinators'],
        queryFn: async () => {
            const response = await client.auth.getCooForEvent.$get();
            const { coordinatorOptions } = await response.json();
            return coordinatorOptions;
        },
    })

    const { mutate: createEvent, isPending: isCreatingEvent } = useMutation({
        mutationFn: async (data: z.infer<typeof EventFormSchema>) => {
            const res = await client.event.createEvent.$post(data);
            
            if (!res.ok) {
                throw new Error("Failed to create event")
            }
    
            const json = await res.json();
            if (!json.success) {
                throw new Error(json.message || "Failed to create event")
            }
            return json;
        },
        onSuccess: () => {
            toast.success("Event created successfully")
            router.push("/dashboard/events")
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error);
        },
    })


    const form = useForm<z.infer<typeof EventFormSchema>>({
        resolver: zodResolver(EventFormSchema),
        defaultValues: {
            title: "",
            description: "",
            poster: "https://firebasestorage.googleapis.com/v0/b/agrios-4f389.appspot.com/o/Event%2F1735057584524-fusiongala.png?alt=media&token=9e6ef397-4d1e-456f-8638-0b5c44402c32",
            date: new Date(),
            stage: EventStage.OFFSTAGE,
            groupSize: "1",
            slotCount: "30",
            archived: false,
            price: "100",
            discount: "",
            finalPrice: "",
            coordinatorsId: [],
        },
    })


    function relaodPage() {
        setSpinReload(true);
        window.location.reload()
        router.refresh()
        setTimeout(() => {
            setSpinReload(false);
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
            newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour)
        } else if (type === "minute") {
            newDate.setMinutes(parseInt(value, 10))
        } else if (type === "ampm") {
            const hours = newDate.getHours()
            if (value === "AM" && hours >= 12) {
                newDate.setHours(hours - 12)
            } else if (value === "PM" && hours < 12) {
                newDate.setHours(hours + 12)
            }
        }

        form.setValue("date", newDate)
    }

    function onSubmit(values: z.infer<typeof EventFormSchema>) {
        console.log(values);
        createEvent(values)
    }

    const price = form.watch("price");
    const discount = form.watch("discount");


    const finalPrice = useMemo(() => {
        const basePrice = parseFloat(price) || 0;
        const discountPercent = parseFloat(discount ?? "0") || 0;

        if (!isNaN(basePrice) && !isNaN(discountPercent)) {
            const discountAmount = (basePrice * discountPercent) / 100;
            const calculated = (basePrice - discountAmount).toString();
            form.setValue("finalPrice", calculated);
            return calculated;
        }
        return null;
    }, [price, discount, form]);

    return (
        <Card className="mx-auto w-full">
            <CardHeader>
                <div className="w-full flex items-center justify-between">
                    <CardTitle className="text-left text-2xl font-bold">
                        {pageTitle}
                    </CardTitle>
                    <Button
                        variant={"outline"}
                        className="active:scale-95 hidden md:flex"
                        onClick={relaodPage}
                    >
                        <RotateCcw className={cn("mr-2 h-4 w-4 rotate-180 transition-all",
                            spinReload && "animate-spin"
                        )} />
                        Reload Window
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                                <Input
                                                    placeholder="Enter event title"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter event description"
                                                    {...field}
                                                    className="resize-none h-[100px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="w-full flex items-center gap-4">
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
                                        name="stage"
                                        render={({ field }) => (
                                            <FormItem className="w-full md:w-1/2 -mt-2">
                                                <FormLabel>
                                                    Event Stage Type
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger
                                                            className=""
                                                        >
                                                            <SelectValue placeholder="Select event stage type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(EventStage).map((stage) => (
                                                            <SelectItem key={stage} value={stage}
                                                                className=""
                                                            >
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
                                name="price"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Event Event Price
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter event price"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Event Discount Percentage
                                        </FormLabel>
                                        <FormControl
                                        >
                                            <div className="relative flex items-center gap-2">
                                                <Input
                                                    {...field}
                                                    placeholder="Enter discount"
                                                />
                                                <span className="absolute top-[27%] right-[35%] text-sm">%</span>
                                                <Input
                                                    className="w-[80px]"
                                                    disabled
                                                    value={finalPrice || ""}
                                                    placeholder="Enter discount"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="coordinatorsId"
                                render={({ field }) => (
                                    <FormItem
                                    >
                                        <FormLabel>
                                            Event Coordinators
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={data ?? []}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                placeholder="Select Coordinators"
                                                variant="inverted"
                                                maxCount={2}
                                                disabled={isLoading}
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger
                                                >
                                                    <SelectValue placeholder="Select event group size" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {GROUP_SIZE.map((size) => (
                                                    <SelectItem key={size} value={size}
                                                    >
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
                                        <FormLabel>
                                            Event Slot Avaliable Count
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter slot count"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="archived"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Archive Event
                                            </FormLabel>
                                            <FormDescription className="-ml-6 text-xs">
                                                If you enable this, the event will be archived and not visible to users
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full flex items-center justify-end">

                            {pageState === "edit" ? (
                                <Button
                                    type="submit"
                                    className="mr-2"
                                >
                                    Create
                                    {isCreatingEvent && (
                                        <Loader2 className="size-4 ml-2 shrink-0 animate-spin" />
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="mr-2"
                                >
                                    Update
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
