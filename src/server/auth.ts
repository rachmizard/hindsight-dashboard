import { betterAuth } from "better-auth"
import { hashPassword } from "better-auth/crypto"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
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

// Monkey-patch better-sqlite3 Statement prototype to auto-convert booleans to 0/1
// Better Auth's Drizzle adapter passes JavaScript booleans as query params,
// but better-sqlite3 only accepts numbers, strings, bigints, buffers, and null.
// Must patch at prototype level because Drizzle calls stmt.raw().all() internally.
const origPrepare = Database.prototype.prepare
Database.prototype.prepare = function (this: any, sql: string) {
  const stmt = origPrepare.call(this, sql)
  const origRun = stmt.run.bind(stmt)
  const origGet = stmt.get.bind(stmt)
  const origAll = stmt.all.bind(stmt)
  const origIterate = stmt.iterate.bind(stmt)
  const toNum = (a: any) => (typeof a === "boolean" ? (a ? 1 : 0) : a)
  stmt.run = function (...args: any[]) {
    return origRun(...args.map(toNum))
  }
  stmt.get = function (...args: any[]) {
    return origGet(...args.map(toNum))
  }
  stmt.all = function (...args: any[]) {
    return origAll(...args.map(toNum))
  }
  stmt.iterate = function (...args: any[]) {
    return origIterate(...args.map(toNum))
  }
  return stmt
}

const db = drizzle(sqlite, { schema })

// Auto-run migrations on startup (inline SQL — no external file dependency)
function runMigrations() {
  const migrationSql = [
    `CREATE TABLE IF NOT EXISTS "user" (
      "id" text PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "email" text NOT NULL,
      "email_verified" integer NOT NULL,
      "image" text,
      "created_at" text NOT NULL,
      "updated_at" text NOT NULL
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "user_email_unique" ON "user" ("email")`,
    `CREATE TABLE IF NOT EXISTS "session" (
      "id" text PRIMARY KEY NOT NULL,
      "expires_at" text NOT NULL,
      "token" text NOT NULL,
      "created_at" text NOT NULL,
      "updated_at" text NOT NULL,
      "ip_address" text,
      "user_agent" text,
      "user_id" text NOT NULL REFERENCES "user"("id")
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "session_token_unique" ON "session" ("token")`,
    `CREATE TABLE IF NOT EXISTS "account" (
      "id" text PRIMARY KEY NOT NULL,
      "account_id" text NOT NULL,
      "provider_id" text NOT NULL,
      "user_id" text NOT NULL REFERENCES "user"("id"),
      "access_token" text,
      "refresh_token" text,
      "id_token" text,
      "access_token_expires_at" text,
      "refresh_token_expires_at" text,
      "scope" text,
      "password" text,
      "created_at" text NOT NULL,
      "updated_at" text NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "verification" (
      "id" text PRIMARY KEY NOT NULL,
      "identifier" text NOT NULL,
      "value" text NOT NULL,
      "expires_at" text NOT NULL,
      "created_at" text,
      "updated_at" text
    )`,
  ]
  for (const stmt of migrationSql) {
    sqlite.exec(stmt)
  }
  console.log("[auth] Migrations applied successfully")
}
runMigrations()

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
      emailVerified: 1,
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
