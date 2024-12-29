import { z } from "zod"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"
import NotificationService from "../notification-service"

export const notificationRouter = router({
  sendNotification: publicProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        imageUrl: z.string(),
        logoUrl: z.string(),
        tokens: z.array(z.string()),
      })
    )
    .mutation(async ({ c, input }) => {
      const { title, body, imageUrl, logoUrl, tokens } = input
      try {
        await NotificationService.sendNotification(
          tokens,
          title,
          body,
          imageUrl,
          logoUrl
        )
        return c.json({
          message: "Notification sent successfully",
          success: true,
        })
      } catch (error: any) {
        return c.json({
          message: "Error sending notification",
          error: error.message,
          success: false,
        })
      }
    }),
})
