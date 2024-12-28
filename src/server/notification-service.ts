import { adminMessaging } from "@/lib/firebase"

class NotificationService {
  static async sendNotification({
    token,
    title,
    body,
    imageUrl,
    logoUrl,
    clickAction,
  }: {
    token: string
    title: string
    body: string
    imageUrl?: string
    logoUrl?: string
    clickAction?: string
  }) {
    const message = {
      notification: {
        title,
        body,
        image: imageUrl,
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
        notification: {
          title,
          body,
          icon: logoUrl || "/icon.png",
          image: imageUrl,
          badge: logoUrl || "/badge.png",
          requireInteraction: true,
          data: {
            url: clickAction || "",
          },
          actions: [
            {
              action: "view",
              title: "View Now",
              icon: "/view-icon.png",
            },
          ],
          click_action: clickAction,
        },
        fcm_options: {
          link: clickAction,
        },
      },
      data: {
        url: clickAction || "",
        clickAction: clickAction || "",
      },
      token,
    }

    try {
      const response = await adminMessaging.send(message)
      return response
    } catch (error: any) {
      console.error("Notification error:", error)
      throw new Error(error.message || "Error sending notification")
    }
  }
}

export default NotificationService
