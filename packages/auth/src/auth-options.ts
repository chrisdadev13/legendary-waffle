import { prisma } from "@calypso/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { type DefaultSession, type NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"

import { env } from "../env.mjs"

export enum Role {
  OWNER,
  ADMIN,
  USER,
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: Role
    } & DefaultSession["user"]
  }

  interface User {
    role: Role
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      },
    }),
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER,
        port: parseInt(env.EMAIL_PORT),
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-user",
  },
}
