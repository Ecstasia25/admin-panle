import admin from "../lib/firebase-admin";

class NotificationService {
  static async sendNotification(
    tokens: string[],
    title: string,
    description: string,
    imageUrl: string,
    logoUrl: string,
  ) {
    const message = {
      data: {
        name: "Fusion Gala",
        price: "150",
      },
      notification: {
        title,
        body: description,
        image: imageUrl,
      },
      webpush: {
        headers: { Urgency: "high" },
        notification: {
          icon: logoUrl,
        },
      },
      tokens: tokens,
    };
    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      return response;
    } catch (error: any) {
      console.error("Error sending notification:", error);
    }
  }
}

export default NotificationService;
