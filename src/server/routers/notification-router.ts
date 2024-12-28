import { z } from "zod"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import NotificationService from "../notification-service"

export const notificationRouter = router({
  sendNotification: privateProcedure
    .input(
      z.object({
        token: z.string().nonempty("Token is required"),
        title: z.string().nonempty("Title is required"),
        body: z.string().nonempty("Body is required"),
        imageUrl: z.string().optional(),
        logoUrl: z.string().optional(),
        clickAction: z.string().optional(),
      })
    )
    .mutation(async ({ input, c }) => {
      try {
        const { token, title, body, imageUrl, logoUrl, clickAction } = input

        // Send notification using the NotificationService
        const result = await NotificationService.sendNotification({
          token,
          title,
          body,
          imageUrl,
          logoUrl,
          clickAction,
        })

        return c.json({
          success: true,
          result,
          message: "Notification sent successfully",
        })
      } catch (error: any) {
        console.error("Notification error:", error)

        return c.json({
          success: false,
          message: error.message || "Failed to send notification",
        })
      }
    }),
})
