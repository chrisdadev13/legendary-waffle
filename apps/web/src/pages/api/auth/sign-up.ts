import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@calypso/db"
import { z } from "zod"

const signUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  teamName: z.string(),
  teamSize: z.number(),
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return
  }

  const data = req.body

  const { firstName, lastName, email, teamName, teamSize } =
    signUpSchema.parse(data)

  const userEmail = email.toLowerCase()

  if (!email) {
    res.status(422).json({ message: "Invalid email" })
    return
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
  })

  const existingTeam = await prisma.team.findFirst({
    where: {
      name: teamName,
    },
  })

  if (existingUser || existingTeam) {
    const message: string = existingUser
      ? "Email address is already registered"
      : "Team name is already taken"

    return res.status(409).json({ message })
  }

  const user = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
    },
  })

  const team = await prisma.team.create({
    data: {
      name: teamName,
      size: teamSize,
    },
  })

  await prisma.membership.create({
    data: {
      user: {
        connect: user,
      },
      team: {
        connect: team,
      },
    },
  })

  res.status(201).json({ message: "User created" })
}

export default handler
