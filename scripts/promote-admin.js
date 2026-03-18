import fs from "node:fs"
import path from "node:path"
import { MongoClient } from "mongodb"

/**
 * Usage:
 *   node scripts/promote-admin.js your-email@example.com
 *
 * Reads MONGODB_URI from process env first, then .env.local.
 * Promotes a user by email (case-insensitive) to admin role.
 */

function loadEnvFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8")
  const map = {}
  for (const line of raw.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const [rawKey, ...rest] = trimmed.split("=")
    const key = rawKey?.trim()
    if (!key) continue
    map[key] = rest.join("=").trim().replace(/^"|"$/g, "")
  }
  return map
}

const email = process.argv[2]
if (!email) {
  console.error("Usage: node scripts/promote-admin.js <user-email>")
  process.exit(1)
}

const envPath = path.join(process.cwd(), ".env.local")
const fileEnv = fs.existsSync(envPath) ? loadEnvFile(envPath) : {}
const uri = process.env.MONGODB_URI || fileEnv.MONGODB_URI

if (!uri) {
  console.error("Missing MONGODB_URI. Set it in environment or .env.local")
  process.exit(1)
}

const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const usersFilter = { email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } }

const client = new MongoClient(uri)

try {
  await client.connect()
  const users = client.db().collection("users")

  const result = await users.findOneAndUpdate(
    usersFilter,
    {
      $set: {
        role: "admin",
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" }
  )

  if (!result.value) {
    console.error(`No user found with email: ${email}`)
    process.exitCode = 1
  } else {
    console.log(`✅ Promoted ${email} to admin.`)
    console.log(`User id: ${String(result.value._id)}`)
    console.log(`Role now: ${result.value.role}`)
    process.exitCode = 0
  }
} catch (err) {
  console.error("Failed to promote user:", err?.message || String(err))
  process.exitCode = 1
} finally {
  await client.close()
}
