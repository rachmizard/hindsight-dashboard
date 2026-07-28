import { betterAuth } from "better-auth"
import { hashPassword } from "better-auth/crypto"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import Database from "better-sqlite3"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { mkdirSync } from "node:fs"
import { dirname } from "node:path"
import * as schema from "./auth-schema"

const isProduction = process.env.NODE_ENV === "production"
const dbPath =
  process.env.DATABASE_URL ||
  (isProduction ? "/data/better-auth.db" : "./.data/better-auth.db")

mkdirSync(dirname(dbPath), { recursive: true })

const sqlite = new Database(dbPath)
sqlite.pragma("journal_mode = WAL")
const db = drizzle(sqlite, { schema })

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
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
  plugins: [tanstackStartCookies()],
  advanced: {
    defaultCookieAttributes: {
      secure: isProduction,
      httpOnly: true,
      sameSite: "lax",
    },
  },
})

// Auto-seed admin user on first run (direct DB insert, bypasses disableSignUp)
async function autoSeed() {
  const email = process.env.ADMIN_EMAIL || "admin@hindsight.local"
  const password = process.env.ADMIN_PASSWORD || "admin123"

  try {
    const existing = db.select().from(schema.user).where(eq(schema.user.email, email)).all()
    if (existing.length > 0) {
      console.log("[auth] Admin user already exists")
      return
    }

    const hashedPassword = await hashPassword(password)
    const now = new Date().toISOString()
    const userId = crypto.randomUUID()

    db.insert(schema.user).values({
      id: userId,
      name: "Admin",
      email,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    }).run()

    db.insert(schema.account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    }).run()

    console.log("[auth] Admin user created:", email)
  } catch (e: any) {
    console.error("[auth] Failed to seed admin user:", e?.message || e)
  }
}

autoSeed().catch(console.error)
