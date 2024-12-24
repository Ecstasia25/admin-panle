import { EventFormSchema } from "@/app/dashboard/events/_components/event-form"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { db } from "@/utils/db"

export const eventRouter = router({
  createEvent: privateProcedure
    .input(EventFormSchema)
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
          coordinatorsId,
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
            discount: discount || null,
            finalPrice: finalPrice || null,
            coordinatorsId,
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
})
