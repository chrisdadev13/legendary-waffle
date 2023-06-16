import {
  enforceUserIsAdmin,
  enforceUserIsAuth,
} from "../middlewares/authMiddleware"
import { t } from "../trpc"

export const protectedProcedure = t.procedure.use(enforceUserIsAuth)
export const rbacProcedure = t.procedure.use(enforceUserIsAdmin)
