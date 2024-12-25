"use client"

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import EventForm from "./event-form";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/utils/client";


interface EventEditPageProps {
    eventId: string;
}



const EventEditPage = ({ eventId }: EventEditPageProps) => {

    const [isEditPage, setIsEditPage] = useState(false)


    let event = null;
    const {
        data,
    } = useQuery({
        queryKey: ['get-event'],
        queryFn: async () => {
            const response = await client.event.getEventById.$get({ id: eventId });
            const { event } = await response.json();
            return event;
        },
    })

    if (data) {
        event = {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            date: new Date(data.date),
            discount: data.discount ?? undefined,
            finalPrice: data.finalPrice ?? undefined,
            coordinators: data.coordinators.map(coordinator => ({
                ...coordinator,
                createdAt: new Date(coordinator.createdAt),
                updatedAt: new Date(coordinator.updatedAt)
            }))
        };
    }


    useEffect(() => {
        if (eventId === "new") {
            setIsEditPage(true)
        }
    }, [eventId])
    return (
        <>
            <EventForm
                eventId={data?.id}
                initialData={event} pageTitle={isEditPage ? "Create Event" : "Edit Event"} />
        </>
    )
}

export default EventEditPage