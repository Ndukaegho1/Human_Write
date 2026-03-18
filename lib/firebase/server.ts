import { initializeApp, cert, getApps, AppOptions } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { env, hasFirebaseAdminConfig } from "@/lib/env"

function normalizePrivateKey(key: string) {
  return key.replace(/\\n/g, "\n")
}

function buildAppOptions(): AppOptions {
  return {
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(env.FIREBASE_PRIVATE_KEY),
    }),
  }
}

let firebaseAdminAuth: Auth | null = null

if (hasFirebaseAdminConfig) {
  if (!getApps().length) {
    initializeApp(buildAppOptions())
  }
  firebaseAdminAuth = getAuth()
}

export { firebaseAdminAuth }
