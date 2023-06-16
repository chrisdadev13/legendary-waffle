import { Role } from "@calypso/db"
import { TRPCError } from "@trpc/server"

import { t } from "../trpc"

export const enforceUserIsAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (ctx.session?.user.role.toString() !== Role.ADMIN) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})
