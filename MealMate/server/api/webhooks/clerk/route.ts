import { createUser } from "@/server/users"

const express = require("express")
const { Webhook } = require("svix")

const router = express.Router()

router.post(
  "/",
  // This is a generic method to parse the contents of the payload.
  // Depending on the framework, packages, and configuration, this may be
  // different or not required.
  express.raw({ type: "application/json" }),

  async (req: any, res: any) => {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!SIGNING_SECRET) {
      throw new Error(
        "Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
      )
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    // Get headers and body
    const headers = req.headers
    const payload = req.body

    // Get Svix headers for verification
    const svix_id = headers["svix-id"]
    const svix_timestamp = headers["svix-timestamp"]
    const svix_signature = headers["svix-signature"]

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return void res.status(400).json({
        success: false,
        message: "Error: Missing svix headers",
      })
    }

    let evt

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If verification fails, error out and return error code
    try {
      evt = wh.verify(JSON.stringify(payload), {
        "svix-id": svix_id as string,
        "svix-timestamp": svix_timestamp as string,
        "svix-signature": svix_signature as string,
      })
    } catch (err: any) {
      console.log("Error: Could not verify webhook:", err.message)
      return void res.status(400).json({
        success: false,
        message: err.message,
      })
    }

    try {
      switch (evt.type) {
        case "user.created":
          const { id } = evt.data
          await createUser({
            clerkUserId: id,
            ingredients: [],
            recipes: [],
          })
          console.log(`New user created: ${id}`)
          break

        case "user.deleted":
          console.log(`User deleted: ${evt.data.id}`)
          break

        default:
          console.log(`Unhandled webhook event: ${evt.type}`)
      }

      res.status(200).json({ success: true })
    } catch (error) {
      console.error("Webhook error:", error)
      res.status(500).json({ success: false, message: "Internal server error" })
    }
  }
)

export default router
