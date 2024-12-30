import { z } from "zod"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"
import NotificationService from "@/service/notification-service"

export const notificationRouter = router({
  sendNotification: publicProcedure
    .input(
      z.object({
        tokens: z.array(z.string()),
        title: z.string(),
        body: z.string(),
        imageUrl: z.string(),
        logoUrl: z.string(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { tokens, title, body, imageUrl, logoUrl } = input

      try {
        await NotificationService.sendNotification(
          tokens,
          title,
          body,
          imageUrl,
          logoUrl
        )
        return c.json({
          success: true,
          message: "Notification sent successfully",
        })
      } catch (error: any) {
        return c.json({
          success: false,
          message: "Error sending notification",
        })
      }
    }),
})
