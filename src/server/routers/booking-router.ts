import { z } from "zod"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { BokingStatus, EventCategory } from "@prisma/client"
import { db } from "@/utils/db"
import { matchSorter } from "match-sorter"

export const bookingRouter = router({
  createBooking: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
        userId: z.string(),
        teamId: z.string(),
        price: z.string(),
        status: z
          .nativeEnum(BokingStatus, {
            required_error: "Status is required",
          })
          .default(BokingStatus.PENDING),
      })
    )
    .mutation(async ({ c, input }) => {
      const { eventId, userId, teamId, status, price } = input
      const booking = await db.booking.create({
        data: {
          event: { connect: { id: eventId } },
          leader: { connect: { id: userId } },
          team: { connect: { id: teamId } },
          price,
          status,
        },
      })
      return c.json({
        success: true,
        booking,
        message: "Booking created successfully",
      })
    }),
  updateBooking: privateProcedure
    .input(
      z.object({
        bookingId: z.string(),
        status: z
          .nativeEnum(BokingStatus, {
            required_error: "Status is required",
          })
          .optional(),
        paymentScreenshot: z.string().optional(),
        isPaid: z.boolean().optional(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { bookingId, status, paymentScreenshot, isPaid } = input
      const booking = await db.booking.update({
        where: { id: bookingId },
        data: {
          status,
          paymentScreenshot,
          isPaid,
        },
      })
      return c.json({
        success: true,
        booking,
        message: "Booking updated successfully",
      })
    }),
  getAllBookings: privateProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
        category: z.nativeEnum(EventCategory).optional(),
        groupSize: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { page = 1, limit = 10, search, category, groupSize } = input

      let categoryFormatedArray = category ? category.split(".") : []
      let groupSizeFormatedArray = groupSize ? groupSize.split(".") : []

      let bookings = await db.booking.findMany({
        include: {
          team: true,
          event: true,
        },
      })

      if (search) {
        bookings = matchSorter(bookings, search, {
          keys: ["team.name", "leader.name", "event.name"],
        })
      }

      if (categoryFormatedArray.length > 0) {
        bookings = bookings.filter((booking) => {
          return categoryFormatedArray.every((category) => {
            return booking.event.category === category
          })
        })
      }

      if (groupSizeFormatedArray.length > 0) {
        bookings = bookings.filter((booking) => {
          return groupSizeFormatedArray.every((groupSize) => {
            return booking.event.groupSize === groupSize
          })
        })
      }

      const allBooikings = bookings.length

      const offset = (page - 1) * limit

      const paginatedBookings = bookings.slice(offset, offset + limit)

      return c.json({
        success: true,
        data: {
          bookings: paginatedBookings,
          bookingsCount: allBooikings,
          offset,
          limit,
        },
        message: "Bookings fetched successfully",
      })
    }),
  getBookingById: privateProcedure
    .input(
      z.object({
        bookingId: z.string(),
      })
    )
    .query(async ({ c, input }) => {
      const { bookingId } = input
      const booking = await db.booking.findUnique({
        where: { id: bookingId },
      })
      return c.json({
        success: true,
        booking,
        message: "Booking fetched successfully",
      })
    }),
  getBookingsByMemberId: privateProcedure
    .input(
      z.object({
        memberId: z.string(),
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ c, input }) => {
      const { memberId, page = 1, limit = 10, search } = input

      let bookings = await db.booking.findMany({
        where: {
          team: {
            members: {
              some: {
                id: memberId,
              },
            },
          },
        },
        include: {
          team: true,
          event: true,
        },
      })

      const allBooikings = bookings.length
      const offset = (page - 1) * limit

      const paginatedBookings = bookings.slice(offset, offset + limit)

      if (search) {
        bookings = matchSorter(bookings, search, {
          keys: ["team.name", "leader.name", "event.name"],
        })
      }
      return c.json({
        success: true,
        data: {
          bookings: paginatedBookings,
          bookingCount: allBooikings,
          offset,
          limit,
        },
        message: "Bookings fetched successfully",
      })
    }),
  deleteBooking: privateProcedure
    .input(
      z.object({
        bookingId: z.string(),
      })
    )
    .mutation(async ({ c, input }) => {
      const { bookingId } = input
      await db.booking.delete({
        where: {
          id: bookingId,
        },
      })
      return c.json({
        success: true,
        message: "Booking deleted successfully",
      })
    }),
})
