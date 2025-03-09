const express = require("express")

const router = express.Router()

router.post("/", async (req: any, res: any) => {
  res.status(201).send("User created")
})

export default router
