import { EventFormSchema } from "@/app/dashboard/events/_components/event-form"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { db } from "@/utils/db"

export const eventRouter = router({
  createEvent: privateProcedure
    .input(EventFormSchema)
    .query(async ({ c, input }) => {
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
          coordinatorsId,
        },
      })

      return c.json({
        success: true,
        event,
        message: "Event created successfully",
      })
    }),
})
