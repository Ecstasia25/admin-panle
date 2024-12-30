import NotificationService from "@/service/notification-service"

const sendFirebaseNotification = async (req: any, res: any) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        message: "Method not allowed. Only POST is supported.",
        success: false,
      })
    }

    const reqBody = await req.json()
    const { tokens, title, body, imageUrl, logoUrl } = reqBody

    if (!tokens || !title || !body) {
      return res.status(400).json({
        message:
          "Missing required fields: 'tokens', 'title', and 'body' are mandatory.",
        success: false,
      })
    }

    await NotificationService.sendNotification(
      tokens,
      title,
      body,
      imageUrl,
      logoUrl
    )

    return res.status(200).json({
      message: "Notification sent successfully",
      success: true,
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Error sending notification",
      error: error.message,
      success: false,
    })
  }
}

export default sendFirebaseNotification
