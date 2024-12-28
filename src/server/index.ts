import { Hono } from "hono"
import { cors } from "hono/cors"
import { handle } from "hono/vercel"
import { authRouter } from "./routers/auth-router"
import { eventRouter } from "./routers/event-router"
import { coordinatorEvents } from "./routers/coordinator-router"
import { overviewRouter } from "./routers/overview-router"
import { fcmRouter } from "./routers/fcm-router"

const app = new Hono().basePath("/api").use(cors())

const appRouter = app
  .route("/auth", authRouter)
  .route("/event", eventRouter)
  .route("/coevents", coordinatorEvents)
  .route("/overview", overviewRouter)
  .route("/fcm", fcmRouter)

export const httpHandler = handle(app)

export default app

export type AppType = typeof appRouter
