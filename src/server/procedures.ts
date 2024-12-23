import { db } from "@/utils/db"
import { j } from "./__internals/j"
import { currentUser } from "@clerk/nextjs/server"
import { HTTPException } from "hono/http-exception"

const authMiddleware = j.middleware(async ({ c, next }) => {
  const auth = await currentUser()

  if (!auth) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  const user = await db.user.findUnique({
    where: { clerkId: auth?.id },
  })

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  return next({ user })
})

export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure
export const privateProcedure = publicProcedure.use(authMiddleware)
