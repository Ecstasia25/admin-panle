"use client"

import { useEffect, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { client } from "@/utils/client"
import MyTeamForm from "./team-form"

interface MyTeamEditPageProps {
    teamId: string
}

const MyTeamEditPage = ({ teamId }: MyTeamEditPageProps) => {
    const [isEditPage, setIsEditPage] = useState(false)

    let team = null
    const { data } = useQuery({
        queryKey: ["get-team"],
        queryFn: async () => {
            const response = await client.team.getTeamById.$get({ id: teamId })
            const { team } = await response.json()
            return team
        },
    })

    if (data) {
        team = {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        }
    }

    useEffect(() => {
        if (teamId === "new") {
            setIsEditPage(true)
        }
    }, [teamId])
    return (
        <>
            <MyTeamForm
                initialData={team}
                teamId={data?.id}
                pageTitle={isEditPage ? "Create Team" : "Edit Team"}
            />
        </>
    )
}

export default MyTeamEditPage
