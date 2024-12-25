import { EventStage } from "@prisma/client"
import { router } from "../__internals/router"
import { privateProcedure, publicProcedure } from "../procedures"
import { db } from "@/utils/db"
import { z } from "zod"
import { matchSorter } from "match-sorter"

export const eventRouter = router({
  createEvent: privateProcedure
    .input(
      z.object({
        title: z.string().min(3, {
          message: "Title is Required",
        }),
        description: z.string().min(10, {
          message: "Description is Required",
        }),
        poster: z.string({
          required_error: "Poster is Required",
        }),
        date: z.date({
          required_error: "Date is Required",
        }),
        stage: z.nativeEnum(EventStage, {
          required_error: "Stage is Required",
        }),
        groupSize: z.string({
          required_error: "Group Size is Required",
        }),
        slotCount: z.string({
          required_error: "Slot Count is Required",
        }),
        archived: z.boolean().optional(),
        price: z.string({
          required_error: "Price is Required",
        }),
        discount: z.string().optional(),
        finalPrice: z.string().optional(),
        coordinators: z.array(z.string()).min(1, {
          message: "At least one coordinator is required",
        }),
      })
    )
    .mutation(async ({ c, input }) => {
      try {
        const {
          title,
          description,
          poster,
          date,
          stage,
          groupSize,
          slotCount,
          archived,
          price,
          discount,
          finalPrice,
          coordinators,
        } = input

        // Create the event in the database
        const event = await db.event.create({
          data: {
            title,
            description,
            poster,
            date,
            stage,
            groupSize,
            slotCount,
            archived,
            price,
            discount,
            finalPrice,
            coordinators: {
              connect: coordinators.map((id) => ({
                id,
              })),
            },
          },
        })

        // Return a success response
        return c.json({
          success: true,
          event,
          message: "Event created successfully",
        })
      } catch (error) {
        console.error("Error creating event:", error)

        // Return an error response
        return c.json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to create the event",
        })
      }
    }),
  getEvents: privateProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { page = 1, limit = 10, search } = input
      let events = await db.event.findMany({
        include: {
          coordinators: true,
        },
      })

      if (search) {
        events = matchSorter(events, search, {
          keys: ["title", "stage"],
        })
      }

      const allEvents = events.length

      const offset = (page - 1) * limit

      const paginatedEvents = events.slice(offset, offset + limit)

      return c.json({
        data: {
          success: true,
          allEventCount: allEvents,
          events: paginatedEvents,
          message: "Events fetched successfully",
          offset,
          limit,
        },
      })
    }),
  getEventById: privateProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "Event ID is Required",
        }),
      })
    )
    .query(async ({ c, input }) => {
      const { id } = input
      const event = await db.event.findUnique({
        where: { id },
        include: { coordinators: true },
      })
      return c.json({
        success: true,
        event,
        message: "Event fetched successfully",
      })
    }),
  updateEvent: privateProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "Event ID is Required",
        }),
        title: z.string().min(3, {
          message: "Title is Required",
        }),
        description: z.string().min(10, {
          message: "Description is Required",
        }),
        poster: z.string({
          required_error: "Poster is Required",
        }),
        date: z.date({
          required_error: "Date is Required",
        }),
        stage: z.nativeEnum(EventStage, {
          required_error: "Stage is Required",
        }),
        groupSize: z.string({
          required_error: "Group Size is Required",
        }),
        slotCount: z.string({
          required_error: "Slot Count is Required",
        }),
        archived: z.boolean().optional(),
        price: z.string({
          required_error: "Price is Required",
        }),
        discount: z.string().optional(),
        finalPrice: z.string().optional(),
        coordinators: z.array(z.string()).min(1, {
          message: "At least one coordinator is required",
        }),
      })
    )
    .mutation(async ({ c, input }) => {
      try {
        const {
          id,
          title,
          description,
          poster,
          date,
          stage,
          groupSize,
          slotCount,
          archived,
          price,
          discount,
          finalPrice,
          coordinators,
        } = input

        const currentEvent = await db.event.findUnique({
          where: { id },
          include: {
            coordinators: true,
          },
        })

        if (!currentEvent) {
          return c.json({
            success: false,
            message: "Event Not Found",
          })
        }
        // Update the event in the database
        const event = await db.event.update({
          where: { id },
          data: {
            title,
            description,
            poster,
            date,
            stage,
            groupSize,
            slotCount,
            archived,
            price,
            discount,
            finalPrice,
            coordinators: {
              disconnect: currentEvent.coordinators.map((e) => ({ id: e.id })),

              connect: coordinators.map((id) => ({
                id,
              })),
            },
          },
        })

        // Return a success response
        return c.json({
          success: true,
          event,
          message: "Event updated successfully",
        })
      } catch (error) {
        console.error("Error updating event:", error)

        // Return an error response
        return c.json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update the event",
        })
      }
    }),
  deleteEvent: privateProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "Event ID is Required",
        }),
      })
    )
    .mutation(async ({ c, input }) => {
      try {
        const { id } = input

        await db.event.delete({
          where: { id },
        })

        return c.json({
          success: true,
          message: "Event deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting event:", error)

        return c.json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete the event",
        })
      }
    }),
  getEventsPublic: publicProcedure.query(async ({ c }) => {
    const events = await db.event.findMany({})
    return c.json({
      success: true,
      events,
      message: "Event fetched successfully",
    })
  }),
})