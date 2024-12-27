"use client"

import { messaging } from "@/lib/firebase"
import { getToken, isSupported } from "firebase/messaging"
import { useEffect, useState } from "react"
import useNotificationPermissionStatus from "./use-notification-permission"

const useFCMToken = () => {
  const permission = useNotificationPermissionStatus()

  const [fcmToken, setFcmToken] = useState<string | null>(null)

  useEffect(() => {
    const retrieveToken = async () => {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        if (permission === "granted") {
          const isFCMSupported = await isSupported()

          if (!isFCMSupported) return
          const fcmToken = await getToken(messaging(), {
            vapidKey: process.env.NEXT_PIBLIC_FIREBASE_VAPID_KEY,
          })

          setFcmToken(fcmToken)
        }
      }
    }
    retrieveToken()
  }, [permission])

  return fcmToken
}
export default useFCMToken
