import "../styles/globals.css"
import type { AppType } from "next/app"
import { Toaster } from "@/components/ui/toaster"
import { api } from "@/utils/api"
import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
