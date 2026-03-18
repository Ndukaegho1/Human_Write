import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

export const hasFirebaseClientConfig = Boolean(config.apiKey && config.authDomain && config.projectId)

let firebaseClientAuth: Auth | null = null
let googleProvider: GoogleAuthProvider | null = null
let firebaseClientError: string | null = null

if (hasFirebaseClientConfig) {
  try {
    const app = getApps().length ? getApp() : initializeApp(config)
    firebaseClientAuth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
  } catch (error) {
    firebaseClientError = error instanceof Error ? error.message : "Firebase client configuration failed."
  }
} else {
  firebaseClientError = "Firebase client configuration is missing."
}

export { firebaseClientAuth, googleProvider, firebaseClientError }
