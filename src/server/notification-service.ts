import admin from "../lib/firebase-admin"

class NotificationService {
  static async sendNotification(
    tokens: string[],
    title: string,
    body: string,
    imageUrl: string,
    logoUrl: string
  ) {
    const message = {
      notification: {
        title,
        body: body,
      },
      tokens: tokens,
    }
    try {
      const response = await admin.messaging().sendEachForMulticast(message)
      return response
    } catch (error: any) {
      console.error("Error sending notification:", error)
    }
  }
}

export default NotificationService
