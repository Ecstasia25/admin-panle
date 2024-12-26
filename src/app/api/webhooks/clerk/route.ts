import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { db } from "@/utils/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!SIGNING_SECRET) {
    return NextResponse.json(
      { error: "Missing CLERK_WEBHOOK_SECRET" },
      { status: 500 }
    )
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 })
  }

  try {
    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(SIGNING_SECRET)
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent

    switch (evt.type) {
      case "user.created": {
        const {
          id,
          email_addresses,
          image_url,
          first_name,
          last_name,
          phone_numbers,
        } = evt.data

        if (!id || !email_addresses?.length) {
          return NextResponse.json(
            { error: "Missing required user data" },
            { status: 400 }
          )
        }

        await db.user.create({
          data: {
            clerkId: id,
            email: email_addresses[0].email_address,
            name: [first_name, last_name].filter(Boolean).join(" "),
            image: image_url,
            phone: phone_numbers?.[0]?.phone_number || null,
          },
        })

        return NextResponse.json(
          { message: "User created successfully" },
          { status: 201 }
        )
      }

      default: {
        return NextResponse.json(
          { message: "Webhook received" },
          { status: 200 }
        )
      }
    }
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    )
  }
}
