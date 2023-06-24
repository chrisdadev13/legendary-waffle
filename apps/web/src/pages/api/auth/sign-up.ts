import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@calypso/db"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return
  }

  const data = req.body

  const { firstName, lastName, email, teamName, teamLimit } = data

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

    res.status(409).json({ message })
    return
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
      limit: teamLimit,
    },
  })

  await prisma.membership.create({
    data: {
      userId: user.id,
      teamId: team.id,
    },
  })

  res.status(201).json({ message: "User created" })
  return
}

export default handler
