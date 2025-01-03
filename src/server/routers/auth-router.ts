import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { Role } from "@prisma/client"
import { router } from "../__internals/router"
import { privateProcedure, publicProcedure } from "../procedures"
import { db } from "@/utils/db"
import { z } from "zod"
import { matchSorter } from "match-sorter"

export const authRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c }) => {
    const auth = await currentUser()

    if (!auth) {
      return c.json({ isSynced: false })
    }

    const user = await db.user.findFirst({
      where: { clerkId: auth.id },
    })

    if (!user) {
      await db.user.create({
        data: {
          clerkId: auth.id,
          image: auth.imageUrl,
          name: auth.fullName,
          email: auth.emailAddresses[0].emailAddress,
          phone: auth.phoneNumbers[0]?.phoneNumber,
        },
      })

      return c.json({ isSynced: true })
    }
    return c.json({ isSynced: true })
  }),
  getUser: publicProcedure.query(async ({ c }) => {
    const auth = await currentUser()
    const user = await db.user.findUnique({
      where: { clerkId: auth?.id },
    })
    return c.json({ user })
  }),
  getUserById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ c, input }) => {
      const { id } = input
      const user = await db.user.findUnique({
        where: { id },
        include: {
          events: true,
        },
      })
      return c.json({ user })
    }),
  getAllAdmins: privateProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { page = 1, limit = 10, search } = input

      let admins = await db.user.findMany({
        where: {
          role: "ADMIN",
        },
      })

      if (search) {
        admins = matchSorter(admins, search, {
          keys: ["name", "email", "phone"],
        })
      }

      const allAdminsCount = admins.length

      const offset = (page - 1) * limit

      const paginatedAdmins = admins.slice(offset, offset + limit)

      return c.json({
        data: {
          success: true,
          allAdminsCount: allAdminsCount,
          admins: paginatedAdmins,
          message: "Admins fetched successfully",
          offset,
          limit,
        },
      })
    }),
  getAllCoordinators: privateProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { page = 1, limit = 10, search } = input

      let admins = await db.user.findMany({
        where: {
          role: "COORDINATOR",
        },
      })

      if (search) {
        admins = matchSorter(admins, search, {
          keys: ["name", "email", "phone"],
        })
      }

      const allCoordCount = admins.length

      const offset = (page - 1) * limit

      const paginatedCoord = admins.slice(offset, offset + limit)

      return c.json({
        data: {
          success: true,
          allCoordsCount: allCoordCount,
          coordinators: paginatedCoord,
          message: "Coordinators fetched successfully",
          offset,
          limit,
        },
      })
    }),
  getAllUsers: privateProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { page = 1, limit = 10, search } = input

      let users = await db.user.findMany({
        where: {
          role: "USER",
        },
      })

      if (search) {
        users = matchSorter(users, search, {
          keys: ["name", "email", "phone"],
        })
      }

      const allUsers = users.length

      const offset = (page - 1) * limit

      const paginatedUsers = users.slice(offset, offset + limit)

      return c.json({
        data: {
          success: true,
          allUsersCount: allUsers,
          users: paginatedUsers,
          message: "Users fetched successfully",
          offset,
          limit,
        },
      })
    }),

  deleteUser: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { id } = input
      await db.user.delete({
        where: {
          clerkId: id,
        },
      })
      return c.json({
        success: true,
        message: "User deleted successfully",
      })
    }),
  updateUser: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        role: z.nativeEnum(Role).optional(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { id, name, email, phone, role } = input
      await db.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          phone,
          role,
        },
      })
      return c.json({
        success: true,
        message: "User updated successfully",
      })
    }),
  getCooForEvent: privateProcedure.query(async ({ c }) => {
    const coordinators = await db.user.findMany({
      where: {
        role: {
          in: ["COORDINATOR", "ADMIN"],
        },
      },
    })

    return c.json({ coordinators })
  }),

  updateProfile: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        phone: z.string().optional(),
        collegeName: z.string().optional(),
        address: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { id, name, phone, collegeName, address, image } = input
      const user = await db.user.update({
        where: {
          id,
        },
        data: {
          name,
          phone,
          collegeName,
          address,
          image,
        },
      })
      return c.json({
        success: true,
        user,
        message: "Profile updated successfully",
      })
    }),
  getRecentUsers: privateProcedure.query(async ({ c }) => {
    const users = await db.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    })

    return c.json({ users })
  }),
})


// ExionsTech@2024