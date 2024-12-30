import admin from "@/utils/firebase";

class NotificationService {
  /**
   * Sends a notification to specific device tokens using Firebase Admin SDK.
   * 
   * @param tokens - Array of target device notification tokens.
   * @param title - The title of the notification.
   * @param body - The body content of the notification.
   * @param imageUrl - The image URL to display in the notification.
   * @param logoUrl - The logo URL for additional branding.
   * @returns Response from Firebase or throws an error.
   */
  static async sendNotification(
    tokens: string[],
    title: string,
    body: string,
    imageUrl: string,
    logoUrl: string
  ) {
    if (!tokens || tokens.length === 0) {
      console.error("Error: At least one notification token is required.");
      return;
    }

    const message = {
      notification: {
        title,
        body,
        image: imageUrl,
      },
      android: {
        notification: {
          icon: "default", // Default app icon if no custom logo is provided
          color: "#1A73E8", // Customize notification accent color
          image: imageUrl,
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title,
              body,
            },
            "mutable-content": 1,
          },
        },
        fcm_options: {
          image: imageUrl,
        },
      },
      webpush: {
        notification: {
          title,
          body,
          icon: logoUrl,
          image: imageUrl,
        },
        fcm_options: {
          link: "https://your-default-link.com", // Add a default link for web users
        },
      },
      tokens, // Target device tokens
    };

    try {
      // Send the notification
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log("Notification sent successfully:", response);
      return response;
    } catch (error: any) {
      console.error("Error sending notification:", error.message, error);
      throw error;
    }
  }
}

export default NotificationService;
