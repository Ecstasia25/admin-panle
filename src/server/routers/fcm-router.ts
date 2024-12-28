import { z } from "zod"
import { router } from "../__internals/router"
import { privateProcedure, publicProcedure } from "../procedures"
import { db } from "@/utils/db"
import { matchSorter } from "match-sorter"

export const fcmRouter = router({
  createFcmToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        userId: z.string(),
        deviceOs: z.string(),
        userName: z.string(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { token, userId, deviceOs, userName } = input
      const fcmToken = await db.fcmTokens.create({
        data: {
          token,
          userId,
          deviceOs,
          userName,
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
        userName: z.string(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { token, userId, deviceOs, userName } = input
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
          userName,
        },
      })
      return c.json({
        success: true,
        fcmToken,
        message: "Token updated successfully",
      })
    }),
  getAllFcmTokens: privateProcedure.query(async ({ c }) => {
    const fcmTokens = await db.fcmTokens.findMany()
    return c.json({
      success: true,
      fcmTokens,
      message: "All tokens fetched successfully",
    })
  }),
  getAllFcmTokensByFilter: privateProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
        deviceOs: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { page = 1, limit = 10, search, deviceOs } = input

      let deviceOsArray = deviceOs ? deviceOs.split(".") : []

      let fcmTokens = await db.fcmTokens.findMany()

      if (deviceOsArray.length > 0) {
        fcmTokens = fcmTokens.filter((token) =>
          deviceOsArray.includes(token.deviceOs)
        )
      }

      if (search) {
        fcmTokens = matchSorter(fcmTokens, search, {
          keys: ["id", "deviceOs"],
        })
      }

      const offset = (page - 1) * limit

      const allTokensCount = fcmTokens.length

      const paginatedFcmTokens = fcmTokens.slice(offset, offset + limit)

      return c.json({
        success: true,
        data: {
          fcmTokens: paginatedFcmTokens,
          allTokensCount,
          offset,
          limit,
        },
        message: "All tokens fetched successfully",
      })
    }),
  getUserDetailsByFcmToken: privateProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ c, input }) => {
      const { token } = input
      const fcmToken = await db.fcmTokens.findFirst({
        where: { token },
      })
      if (!fcmToken) throw new Error("Token not found")

      const user = await db.user.findUnique({
        where: { id: fcmToken.userId },
      })
      return c.json({
        success: true,
        data: {
          fcmToken,
          user,
        },
        message: "User fetched successfully",
      })
    }),
  deleteFcmToken: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { id } = input
      await db.fcmTokens.delete({
        where: { id },
      })
      return c.json({
        success: true,
        message: "Token deleted successfully",
      })
    }),
})
