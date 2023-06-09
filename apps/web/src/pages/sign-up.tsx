import React from "react"
import { useRouter } from "next/router"
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from "@calypso/ui"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import * as z from "zod"

const signUpSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(30),
  email: z.string().email(),

  teamName: z.string().min(2).max(100),
  teamLimit: z.number(),
})

function SignUp() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      teamName: "",
      teamLimit: 5,
    },
  })
  const router = useRouter()

  const { mutate } = useMutation(
    async (values: z.infer<typeof signUpSchema>) => {
      const res = await fetch("/api/auth/sign-up", {
        body: JSON.stringify({
          ...values,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })

      const api = await res.json()
      console.log(api)
      if (!res.ok) throw api.message
    },
  )

  const onSubmit = (values: z.infer<typeof signUpSchema>) =>
    mutate(values, {
      onSuccess: () => {
        router.push({
          pathname: "/auth/login",
          query: { msg: "Account created successfully" },
        })
      },
      onError: (err: any) =>
        toast({
          variant: "destructive",
          title: "Uh oh! something went wrong",
          description: err,
        }),
    })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teamLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team</FormLabel>
              <FormControl>
                <Input type="number" placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default SignUp
