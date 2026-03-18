"use client"

import { FormEvent, useState } from "react"
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { useRouter } from "next/navigation"
import { firebaseClientAuth, googleProvider } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.34-.17-1.97H12v3.73h5.39a4.61 4.61 0 0 1-2 3.03v2.52h3.24c1.9-1.75 2.97-4.33 2.97-7.31Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.46l-3.24-2.52c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.42 13.86A5.98 5.98 0 0 1 6.1 12c0-.65.11-1.28.32-1.86V7.54H3.07A10 10 0 0 0 2 12c0 1.61.39 3.13 1.07 4.46l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.8.5 3.85 1.47l2.89-2.89C16.95 2.9 14.69 2 12 2A10 10 0 0 0 3.07 7.54l3.35 2.6C7.2 7.74 9.4 5.98 12 5.98Z"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const syncUser = async () => {
    const token = await firebaseClientAuth.currentUser?.getIdToken()
    if (!token) throw new Error("Missing auth token. Please login again.")
    const response = await fetch("/api/auth/sync", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Could not sync profile. Check Firebase and Mongo setup.")
    }
    return data
  }

  const finishAuth = async () => {
    try {
      await syncUser()
      setSuccess("Login successful. Redirecting...")
    } catch (err) {
      setSuccess("Signed in. Profile sync will retry when the server is available.")
      setError((err as Error).message || "Could not sync profile right now.")
    }
    router.push("/dashboard")
  }

  const withProvider = async (provider: typeof googleProvider) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await signInWithPopup(firebaseClientAuth, provider)
      await finishAuth()
    } catch (err) {
      setError((err as Error).message || "OAuth failed.")
    } finally {
      setLoading(false)
    }
  }

  const submitEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (mode === "signup" && (!firstName.trim() || !lastName.trim())) {
      setError("First name and last name are required.")
      return
    }
    if (!email || !password) {
      setError("Email and password are required.")
      return
    }
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(firebaseClientAuth, email, password)
        if (firebaseClientAuth.currentUser) {
          await updateProfile(firebaseClientAuth.currentUser, {
            displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
          })
          await firebaseClientAuth.currentUser.getIdToken(true)
        }
      } else {
        await signInWithEmailAndPassword(firebaseClientAuth, email, password)
      }
      await finishAuth()
    } catch (err) {
      setError((err as Error).message || `${mode === "signup" ? "Signup" : "Login"} failed.`)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email address first, then click Forgot password.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await sendPasswordResetEmail(firebaseClientAuth, email.trim())
      setSuccess("Password reset email sent. Check your inbox.")
    } catch (err) {
      setError((err as Error).message || "Could not send reset email.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            mode === "login" ? "bg-[var(--hx-green)] text-[#0b140f]" : "text-[var(--hx-nav-text)]"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            mode === "signup" ? "bg-[var(--hx-green)] text-[#0b140f]" : "text-[var(--hx-nav-text)]"
          }`}
        >
          Get Started
        </button>
      </div>

      <form onSubmit={submitEmail} className="space-y-3">
        {mode === "signup" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-[var(--hx-muted)]">First name</label>
              <input
                className="mt-1 w-full rounded-xl border border-[var(--hx-border)] bg-[var(--hx-card)] p-3 text-sm text-[var(--hx-text)]"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--hx-muted)]">Last name</label>
              <input
                className="mt-1 w-full rounded-xl border border-[var(--hx-border)] bg-[var(--hx-card)] p-3 text-sm text-[var(--hx-text)]"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        ) : null}
        <label className="text-xs font-semibold text-[var(--hx-muted)]">Email address</label>
        <input
          className="w-full rounded-xl border border-[var(--hx-border)] bg-[var(--hx-card)] p-3 text-sm text-[var(--hx-text)]"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="text-xs font-semibold text-[var(--hx-muted)]">Password</label>
        <input
          type="password"
          className="w-full rounded-xl border border-[var(--hx-border)] bg-[var(--hx-card)] p-3 text-sm text-[var(--hx-text)]"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === "login" ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-[var(--hx-green)] transition hover:opacity-80"
            >
              Forgot password?
            </button>
          </div>
        ) : null}
        <Button type="submit" disabled={loading} className="w-full">
          <span className="inline-flex items-center gap-2">
            <MailIcon />
            {loading ? "Working..." : mode === "signup" ? "Create account with Email" : "Continue with Email"}
          </span>
        </Button>
      </form>

      <div className="relative">
        <div className="h-px bg-[var(--hx-border)]" />
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--hx-card)] px-3 text-xs text-[var(--hx-muted)]">
          or
        </span>
      </div>

      <Button type="button" variant="ghost" disabled={loading} onClick={() => withProvider(googleProvider)} className="w-full">
        <span className="inline-flex items-center gap-2">
          <GoogleIcon />
          Continue with Google
        </span>
      </Button>
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-200">{success}</p> : null}
    </div>
  )
}
