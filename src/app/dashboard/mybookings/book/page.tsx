"use client"

import { Loader, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const BookingPage = () => {
    const router = useRouter()

    useEffect(() => {
        router.replace("/dashboard/mybookings")
    }, [])

    return (
        <div className="w-full h-full min-h-screen flex items-center justify-center">
            <Loader className="h-10 w-10 animate-spin text-primary" />
        </div>
    )
}

export default BookingPage