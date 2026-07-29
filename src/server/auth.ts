import { betterAuth } from "better-auth"
import { hashPassword } from "better-auth/crypto"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate as runMigrations } from "drizzle-orm/postgres-js/migrator"
import { eq } from "drizzle-orm"
import * as schema from "./auth-schema"

const isProduction = process.env.NODE_ENV === "production"
const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required")
}

// Single shared client for queries + migrations
const queryClient = postgres(connectionString, { max: 1 })
const db = drizzle(queryClient, { schema })

// Run Drizzle migrations on startup
async function migrate() {
  try {
    await runMigrations(db, { migrationsFolder: "./drizzle" })
    console.log("[auth] PostgreSQL migrations applied successfully")
  } catch (e: any) {
    console.error("[auth] Migration error:", e?.message || e)
    throw e
  }
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "postgresql",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // update every 24h
  },
  advanced: {
    defaultCookieAttributes: {
      secure: isProduction,
      httpOnly: true,
      sameSite: "lax",
    },
  },
})

// Auto-seed admin user on first run
async function autoSeed() {
  const email = process.env.ADMIN_EMAIL || "admin@hindsight.local"
  const password = process.env.ADMIN_PASSWORD || "admin123"

  try {
    const existing = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1)

    if (existing.length > 0) {
      console.log("[auth] Admin user already exists")
      return
    }

    const hashedPassword = await hashPassword(password)
    const now = new Date()
    const userId = crypto.randomUUID()

    await db.insert(schema.user).values({
      id: userId,
      name: "Admin",
      email,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    })

    await db.insert(schema.account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    })

    console.log("[auth] Admin user created:", email)
  } catch (e: any) {
    console.error("[auth] Failed to seed admin user:", e?.message || e)
  }
}

// Run migration then seed, in sequence
migrate()
  .then(() => autoSeed())
  .catch(console.error)