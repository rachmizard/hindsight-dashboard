import { createAPIFileRoute } from "@tanstack/react-start/api"
import { auth } from "@/server/auth"

export const APIRoute = createAPIFileRoute("/api/auth/$")({
  POST: async ({ request }) => auth.handler(request),
  GET: async ({ request }) => auth.handler(request),
})
