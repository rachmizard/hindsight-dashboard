import { auth } from "./auth"

async function seed() {
  const email = process.env.ADMIN_EMAIL || "admin@hindsight.local"
  const password = process.env.ADMIN_PASSWORD || "admin123"

  try {
    await auth.api.signUpEmail({
      body: { email, password, name: "Admin" },
    })
    console.log("Admin user created:", email)
  } catch (e) {
    console.log("Admin user may already exist:", e)
  }
}

seed().catch(console.error)
