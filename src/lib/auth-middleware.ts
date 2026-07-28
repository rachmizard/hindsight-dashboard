import { auth } from "@/server/auth"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { redirect } from "@tanstack/react-router"

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  return session
})

export const requireAuth = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSession()
  if (!session) {
    throw redirect({ to: "/login" })
  }
  return session
})
