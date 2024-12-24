"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EventForm from "./event-form";


interface EventEditPageProps {
    eventId: string;
}


const EventEditPage = ({ eventId }: EventEditPageProps) => {

    const [isEditPage, setIsEditPage] = useState(false)
    const router = useRouter()

    const event = null;

    useEffect(() => {
        if (eventId === "new") {
            setIsEditPage(true)
        }
    }, [eventId])
    return (
        <>
            <EventForm pageState={isEditPage ? "edit" :"create"} initialData={event} pageTitle={isEditPage ? "Create Event" : "Edit Event"} />
        </>
    )
}

export default EventEditPage