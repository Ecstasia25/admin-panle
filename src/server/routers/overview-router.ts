import { db } from "@/utils/db"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"

export const overviewRouter = router({
  getOverviewDetails: privateProcedure.query(async ({ c }) => {
    const users = await db.user.findMany({
      where: {
        role: "USER",
      },
      include: {
        events: true,
      },
    })
    const events = await db.event.findMany({
      include: {
        coordinators: true,
      },
    })
    const admins = await db.user.findMany({
      where: {
        role: "ADMIN",
      },
      include: {
        events: true,
      },
    })
    const coordinators = await db.user.findMany({
      where: {
        role: "COORDINATOR",
      },
      include: {
        events: true,
      },
    })

    const reaps = await db.user.findMany({
      where: {
        role: "REAP",
      },
      include: {
        events: true,
      },
    })

    return c.json({
      success: true,
      message: "Overview details",
      data: {
        events: events,
        users: users,
        admins: admins,
        coordinators: coordinators,
        reaps: reaps,
      },
    })
  }),
})
