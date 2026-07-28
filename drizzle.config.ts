import { defineConfig } from "drizzle-kit"

const isProduction = process.env.NODE_ENV === "production"

export default defineConfig({
  schema: "./src/server/auth-schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      (isProduction ? "/data/better-auth.db" : "./.data/better-auth.db"),
  },
})
