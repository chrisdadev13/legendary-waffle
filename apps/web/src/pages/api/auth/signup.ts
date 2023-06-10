import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@calypso/db"
import { z } from "zod"

const signUpSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(30),
  email: z.string().email(),

  group: z.string().min(2).max(100),
  groupSize: z.number(),
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return
  }

  const data = req.body

  const { firstName, lastName, email, group, groupSize } =
    signUpSchema.parse(data)

  const userEmail = email.toLowerCase()

  if (!email) {
    res.status(422).json({ message: "Invalid email" })
    return
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: userEmail }],
    },
  })

  if (existingUser) {
    const message: string = "Email address is already registere"
    return res.status(409).json({ message })
  }

  const user = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
    },
  })
}

export default handler
