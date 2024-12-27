import { z } from "zod"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"
import { db } from "@/utils/db"

export const fcmRouter = router({
  createFcmToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        userId: z.string(),
        deviceOs: z.string(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { token, userId, deviceOs } = input
      const fcmToken = await db.fcmTokens.create({
        data: {
          token,
          userId,
          deviceOs,
        },
      })
      return c.json({
        success: true,
        fcmToken,
        message: "Token created successfully",
      })
    }),
  checkToken: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ c, input }) => {
      const { userId } = input
      const fcmToken = await db.fcmTokens.findFirst({
        where: {
          userId,
        },
      })
      const deviceOs = fcmToken?.deviceOs
      return c.json({
        token: fcmToken,
        deviceOs,
        success: !!fcmToken,
        message: !!fcmToken ? "Token is present" : "Token is not present",
      })
    }),
  updateToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        userId: z.string(),
        deviceOs: z.string(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { token, userId, deviceOs } = input
      const existingToken = await db.fcmTokens.findFirst({
        where: { userId },
      })
      if (!existingToken) throw new Error("Token not found")

      const fcmToken = await db.fcmTokens.update({
        where: {
          id: existingToken.id,
        },
        data: {
          token,
          deviceOs,
        },
      })
      return c.json({
        success: true,
        fcmToken,
        message: "Token updated successfully",
      })
    }),
})
