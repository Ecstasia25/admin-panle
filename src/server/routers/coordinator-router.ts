import { z } from "zod"
import { router } from "../__internals/router"
import { privateProcedure, publicProcedure } from "../procedures"
import { db } from "@/utils/db"
import { EventStage } from "@prisma/client"
import { matchSorter } from "match-sorter"

export const coordinatorEvents = router({
  getFilteredCordEventsByCoId: privateProcedure
    .input(
      z.object({
        id: z.string().optional(),
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
        stage: z.nativeEnum(EventStage).optional(),
        groupSize: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { page = 1, limit = 10, search, stage, groupSize, id } = input

      let eventsArray = stage ? stage.split(".") : []
      let formatedEventsArray = groupSize ? groupSize.split(".") : []

      let coordEvents = await db.event.findMany({
        where: {
          coordinators: {
            some: {
              id,
            },
          },
        },
      })

      if (eventsArray.length > 0) {
        coordEvents = coordEvents.filter((event) =>
          eventsArray.includes(event.stage)
        )
      }
      if (formatedEventsArray.length > 0) {
        coordEvents = coordEvents.filter((event) =>
          formatedEventsArray.includes(event.groupSize)
        )
      }

      if (search) {
        coordEvents = matchSorter(coordEvents, search, {
          keys: ["title", "stage"],
        })
      }

      const allCoordEventsCount = coordEvents.length

      const offset = (page - 1) * limit

      const paginateCoordEvents = coordEvents.slice(offset, offset + limit)

      return c.json({
        success: true,
        data: {
          allCoordEvents: paginateCoordEvents,
          allCoordEvntsCount: allCoordEventsCount,
          offset,
          limit,
        },
        message: "Coordinator Events fetched successfully",
      })
    }),

  getCoEventsByCoIdPublic: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { id } = input

      let coordEvents = await db.event.findMany({
        where: {
          coordinators: {
            some: {
              id,
            },
          },
        },
      })

      return c.json({
        success: true,
        data: {
          allCoordEvents: coordEvents,
        },
        message: "Coordinator Events fetched successfully",
      })
    }),
})
