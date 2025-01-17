"use client"


import { useQuery } from "@tanstack/react-query";
import { client } from "@/utils/client";
import MyEventForm from "./my-event-form";


interface MyEventEditPageProps {
    eventId: string;
}


const MyEventEditPage = ({ eventId }: MyEventEditPageProps) => {

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
        };
    }

    return (
        <>
            <MyEventForm
                eventId={data?.id}
                initialData={event} pageTitle={"Edit Event"} />
        </>
    )
}

export default MyEventEditPage