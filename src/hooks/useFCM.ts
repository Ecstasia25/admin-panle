import { useEffect, useState } from "react"

import { messaging } from "@/lib/firebase"

import { MessagePayload, onMessage } from "firebase/messaging"
import { toast } from "sonner"
import useFCMToken from "./useFCMToken"

const useFCM = () => {
  const fcmToken = useFCMToken()
  const [message, setMessage] = useState<MessagePayload[]>([])

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const fcmmessaging = messaging()
      const unsubscribe = onMessage(fcmmessaging, (payload) => {
        toast.success(payload.notification?.title || "New Notification")
        setMessage((message) => [...message, payload])
      })

      return () => unsubscribe()
    }
  }, [fcmToken])

  return { fcmToken, message }
}
export default useFCM