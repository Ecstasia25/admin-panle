"use client"

import { useEffect, useState } from "react"
import { messaging } from "@/lib/firebase"
import { MessagePayload, onMessage } from "firebase/messaging"
import { toast } from "sonner"
import useFCMToken from "./useFCMToken"

const FCM_TOKEN_KEY = "ecstasia-fcm-token"

const useFCM = () => {
  const token = useFCMToken()
  const [message, setMessage] = useState<MessagePayload[]>([])
  const [isPresent, setIsPresent] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem(FCM_TOKEN_KEY, token)
      setIsPresent(true)
    }
  }, [token])

  useEffect(() => {
    if (token && "serviceWorker" in navigator) {
      const fcmMessaging = messaging()
      const unsubscribe = onMessage(fcmMessaging, (payload) => {
        toast.success(payload.notification?.title || "New Notification")
        setMessage((prev) => [...prev, payload])
      })
      return () => unsubscribe()
    }
  }, [token])

  const removeToken = () => {
    localStorage.removeItem(FCM_TOKEN_KEY)
    setIsPresent(false)
  }

  return { fcmToken: token, message, removeToken, isPresent }
}

export default useFCM
