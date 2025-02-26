const express = require("express")
const bodyParser = require("body-parser")
const { Webhook } = require("svix")

const router = express.Router()

router.post(
  "/",
  // This is a generic method to parse the contents of the payload.
  // Depending on the framework, packages, and configuration, this may be
  // different or not required.
  bodyParser.raw({ type: "application/json" }),

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

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log("Webhook payload:", evt.data)

    return void res.status(200).json({
      success: true,
      message: "Webhook received",
    })
  }
)

export default router
