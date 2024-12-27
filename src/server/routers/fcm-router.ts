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
      })
    )
    .mutation(async ({ c, input }) => {
      const { token, userId } = input
      const fcmToken = await db.fcmTokens.create({
        data: {
          token,
          userId,
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
      return c.json({
        token: fcmToken,
        success: !!fcmToken,
        message: !!fcmToken ? "Token is present" : "Token is not present",
      })
    }),
  updateToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { token, userId } = input
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
        },
      })
      return c.json({
        success: true,
        fcmToken,
        message: "Token updated successfully",
      })
    }),
})
