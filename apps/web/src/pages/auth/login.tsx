import React from "react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { useRouter } from "next/router"
import { toast } from "@calypso/ui"
import { getCsrfToken } from "next-auth/react"

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}

export default function Login({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const query = router.query
  React.useEffect(() => {
    if (query.msg)
      toast({
        variant: "default",
        title: "Message: ",
        description: query.msg,
      })
  }, [query])

  return (
    <form method="post" action="/api/auth/signin/email">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Email address
        <input type="email" id="email" name="email" />
      </label>
      <button type="submit">Sign in with Email</button>
    </form>
  )
}
