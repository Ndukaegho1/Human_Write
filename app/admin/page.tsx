"use client"

import { FormEvent, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollReveal } from "@/components/animation/ScrollReveal"
import { firebaseClientAuth } from "@/lib/firebase/client"

const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const ScanIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const BarChartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

type TabType = "overview" | "users" | "billing" | "analytics" | "settings"

type ActionCount = {
  action: string
  count: number
}

type PlanBucket = {
  plan: string
  users: number
  revenue?: number
}

type AdminRecentUser = {
  id: string
  email: string
  name: string
  role: string
  plan: string
  createdAt: string
  usage: number
}

type AdminUser = {
  id: string
  email: string
  name: string
  role: string
  plan: string
  createdAt: string
  usage: number
  hasActiveSubscription: boolean
}

type AnalyticsData = {
  total_users: number
  paid_users: number
  rewrite_volume: number
  detector_volume: number
  avg_latency_rewrite_ms: number
  avg_latency_detect_ms: number
  token_usage: number
  error_rate_by_status: { _id: string; count: number }[]
  request_count_by_action: ActionCount[]
  active_users_this_period: number
  window_days: number
  plan_distribution: PlanBucket[]
  active_plan_distribution: PlanBucket[]
  recent_users: AdminRecentUser[]
  estimated_monthly_revenue: number
  plan_revenue_by_plan: PlanBucket[]
}

function formatNumber(num: number) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return `${num}`
}

function formatLatency(ms: number) {
  if (ms < 1_000) return `${Math.round(ms)}ms`
  return `${(ms / 1_000).toFixed(1)}s`
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

function normalizePlan(plan: string) {
  return (plan || "free").toString().toLowerCase()
}

function displayPlan(plan: string) {
  const normalized = normalizePlan(plan)
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

function planBadge(plan: string) {
  const normalized = normalizePlan(plan)
  switch (normalized) {
    case "free":
      return "bg-gray-500/20 text-gray-200 border border-gray-500/40"
    case "starter":
      return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
    case "pro":
      return "bg-sky-500/20 text-sky-300 border border-sky-500/40"
    case "max":
      return "bg-violet-500/20 text-violet-300 border border-violet-500/40"
    case "team":
      return "bg-orange-500/20 text-orange-300 border border-orange-500/40"
    default:
      return "bg-teal-500/20 text-teal-300 border border-teal-500/40"
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [users, setUsers] = useState<AdminUser[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [usersPage, setUsersPage] = useState(1)
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 25,
  })

  const getAdminHeaders = async (): Promise<Record<string, string> | null> => {
    if (!firebaseClientAuth.currentUser) return null
    const token = await firebaseClientAuth.currentUser.getIdToken()
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const headers = await getAdminHeaders()
      if (!headers) {
        throw new Error("Please sign in with an admin account.")
      }

      const res = await fetch("/api/admin/analytics?days=30", { headers })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Failed to load analytics")
      }
      const payload = (await res.json()) as AnalyticsData
      setAnalytics(payload)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load analytics")
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      const params = new URLSearchParams({
        page: String(usersPage),
        limit: String(usersPagination.limit),
      })
      if (search) params.set("q", search)

      const headers = await getAdminHeaders()
      if (!headers) {
        throw new Error("Please sign in with an admin account.")
      }

      const res = await fetch(`/api/admin/users?${params.toString()}`, { headers })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Failed to load users")
      }
      const payload = (await res.json()) as {
        users: AdminUser[]
        pagination: { page: number; total: number; totalPages: number; limit: number }
      }

      setUsers(payload.users ?? [])
      setUsersPagination(payload.pagination ?? usersPagination)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load users")
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    void fetchAnalytics()
  }, [])

  useEffect(() => {
    if (activeTab === "users") {
      void fetchUsers()
    }
  }, [activeTab, usersPage, search])

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChartIcon },
    { id: "users", label: "Users", icon: UsersIcon },
    { id: "billing", label: "Billing", icon: CreditCardIcon },
    { id: "analytics", label: "Analytics", icon: ActivityIcon },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ] as const

  const totalStatusCount = (analytics?.error_rate_by_status ?? []).reduce((sum, row) => sum + Number(row.count || 0), 0)
  const successRate =
    totalStatusCount === 0
      ? 0
      : Math.round(((analytics?.error_rate_by_status.find((row) => row._id === "success")?.count ?? 0) / totalStatusCount) * 10000) / 100

  const errorRateRate =
    totalStatusCount === 0
      ? 0
      : Math.round(((analytics?.error_rate_by_status.find((row) => row._id === "error")?.count ?? 0) / totalStatusCount) * 10000) / 100

  const blockedRate =
    totalStatusCount === 0
      ? 0
      : Math.round(((analytics?.error_rate_by_status.find((row) => row._id === "blocked")?.count ?? 0) / totalStatusCount) * 10000) / 100

  const planRows = analytics?.plan_distribution ?? []
  const activePlanRows = analytics?.active_plan_distribution ?? []
  const latestUsers = analytics?.recent_users ?? []
  const actionRows = analytics?.request_count_by_action ?? []
  const revenueRows = analytics?.plan_revenue_by_plan ?? []
  const totalPlanUsers = planRows.reduce((sum, row) => sum + Number(row.users || 0), 0)

  const usersCanPrev = usersPage > 1
  const usersCanNext = usersPage < usersPagination.totalPages

  const stats = [
    { label: "Total Users", value: formatNumber(analytics?.total_users ?? 0), icon: UsersIcon },
    { label: "Active Users (30d)", value: formatNumber(analytics?.active_users_this_period ?? 0), icon: ActivityIcon },
    { label: "Paid Users", value: formatNumber(analytics?.paid_users ?? 0), icon: CreditCardIcon },
    { label: "Rewrite Volume", value: formatNumber(analytics?.rewrite_volume ?? 0), icon: FileTextIcon },
    { label: "Detector Checks", value: formatNumber(analytics?.detector_volume ?? 0), icon: ScanIcon },
    { label: "Token Usage", value: formatNumber(analytics?.token_usage ?? 0), icon: ClockIcon },
  ] as const

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSearch(searchInput.trim())
    setUsersPage(1)
  }

  const onSearchClear = () => {
    setSearchInput("")
    setSearch("")
    setUsersPage(1)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f1b2e_0%,_#070b12_35%,_#05070b_100%)] text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 pb-12 md:p-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-zinc-700/50 bg-zinc-900/70 p-6 shadow-xl shadow-black/30 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Admin Console</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Platform Control Center</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300">
              Operations, billing health, and user management in one place. Data refreshes from server metrics and usage logs.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid gap-3 rounded-2xl border border-zinc-700/40 bg-zinc-900/40 p-3 backdrop-blur sm:grid-cols-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 rounded-xl px-3 py-3 text-left transition ${
                  activeTab === tab.id
                    ? "border border-zinc-400/40 bg-zinc-200/10 text-white"
                    : "border border-transparent text-zinc-300 hover:border-zinc-500/30 hover:bg-zinc-200/5"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-900/20 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {activeTab === "overview" && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <ScrollReveal key={stat.label}>
                  <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
                    <div className="mb-2 inline-flex rounded-full border border-zinc-600 bg-zinc-800/60 p-2 text-zinc-200">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-zinc-300">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            {analyticsLoading ? (
              <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
                <p className="text-sm text-zinc-300">Loading analytics...</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <ScrollReveal>
                  <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
                    <h2 className="text-sm font-semibold tracking-wide text-zinc-200">Plan mix</h2>
                    <div className="mt-4 space-y-3">
                      {planRows.length === 0 ? (
                        <p className="text-sm text-zinc-400">No plan data yet.</p>
                      ) : (
                        planRows.map((item) => {
                          const share = totalPlanUsers === 0 ? 0 : (Number(item.users) / totalPlanUsers) * 100
                          return (
                            <div key={item.plan}>
                              <div className="mb-1 flex items-center justify-between text-xs text-zinc-200">
                                <span className="inline-flex items-center gap-2">
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] ${planBadge(item.plan)}`}>
                                    {displayPlan(item.plan)}
                                  </span>
                                  <span>{formatNumber(item.users)} users</span>
                                </span>
                                <span>{share.toFixed(0)}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-zinc-800">
                                <div className="h-2 rounded-full bg-sky-500" style={{ width: `${Math.max(share, 2)}%` }} />
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </Card>
                </ScrollReveal>

                <ScrollReveal>
                  <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
                    <h2 className="text-sm font-semibold tracking-wide text-zinc-200">Revenue (estimated monthly)</h2>
                    <p className="mt-2 text-3xl font-semibold text-emerald-300">
                      {formatMoney(analytics?.estimated_monthly_revenue ?? 0)}
                    </p>
                    <p className="text-xs text-zinc-400">Based on active subscriptions and configured plan rates.</p>

                    <div className="mt-4 space-y-3">
                      {revenueRows.length === 0 ? (
                        <p className="text-sm text-zinc-400">No revenue breakdown yet.</p>
                      ) : (
                        revenueRows.map((row) => (
                          <div key={row.plan} className="flex items-center justify-between text-sm">
                            <span className={`rounded-md border px-2 py-1 text-xs uppercase tracking-[0.15em] ${planBadge(row.plan)}`}>
                              {displayPlan(row.plan)}
                            </span>
                            <span className="text-zinc-100">
                              {formatNumber(row.users)} users · {formatMoney(row.revenue ?? 0)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </ScrollReveal>
              </div>
            )}

            <ScrollReveal>
              <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
                <h2 className="text-sm font-semibold text-zinc-200">Recent users</h2>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-zinc-400">
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Plan</th>
                        <th className="px-3 py-2">Role</th>
                        <th className="px-3 py-2">Usage</th>
                        <th className="px-3 py-2">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center text-zinc-400">
                            No recent users.
                          </td>
                        </tr>
                      ) : (
                        latestUsers.map((user) => (
                          <tr key={user.id} className="border-t border-zinc-800">
                            <td className="px-3 py-3">{user.name}</td>
                            <td className="px-3 py-3 text-zinc-300">{user.email}</td>
                            <td className="px-3 py-3">
                              <span className={`rounded-full border px-2 py-0.5 text-xs uppercase tracking-[0.14em] ${planBadge(user.plan)}`}>
                                {displayPlan(user.plan)}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-zinc-300">{user.role}</td>
                            <td className="px-3 py-3">{formatNumber(user.usage)}</td>
                            <td className="px-3 py-3 text-zinc-300">{formatDate(user.createdAt)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </ScrollReveal>
          </>
        )}

        {activeTab === "users" && (
          <ScrollReveal>
            <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-sm font-semibold text-zinc-200">Users Management</h2>
                <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search by name, email, role..."
                    className="w-64 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                  />
                  <button type="submit" className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-900">
                    Search
                  </button>
                  {search ? (
                    <button type="button" onClick={onSearchClear} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200">
                      Clear
                    </button>
                  ) : null}
                </form>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-zinc-400">
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Plan</th>
                      <th className="px-3 py-2">Role</th>
                      <th className="px-3 py-2">Usage</th>
                      <th className="px-3 py-2">Active Subscription</th>
                      <th className="px-3 py-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-6 text-center text-zinc-400">
                          Loading users...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-6 text-center text-zinc-400">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-t border-zinc-800">
                          <td className="px-3 py-3">{user.name}</td>
                          <td className="px-3 py-3 text-zinc-300">{user.email}</td>
                          <td className="px-3 py-3">
                            <span className={`rounded-full border px-2 py-0.5 text-xs uppercase tracking-[0.14em] ${planBadge(user.plan)}`}>
                              {displayPlan(user.plan)}
                            </span>
                          </td>
                          <td className="px-3 py-3">{user.role}</td>
                          <td className="px-3 py-3">{formatNumber(user.usage)}</td>
                          <td className="px-3 py-3">
                            <span className={user.hasActiveSubscription ? "text-emerald-300" : "text-zinc-400"}>
                              {user.hasActiveSubscription ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-zinc-300">{formatDate(user.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-zinc-400">
                  Total users: <span className="text-zinc-200">{formatNumber(usersPagination.total)}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!usersCanPrev || usersLoading}
                    onClick={() => setUsersPage((prev) => Math.max(1, prev - 1))}
                    className="rounded-lg border border-zinc-700 px-3 py-2 text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="rounded-md border border-zinc-700 px-3 py-2 text-zinc-300">
                    {usersPagination.page}/{usersPagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={!usersCanNext || usersLoading}
                    onClick={() => setUsersPage((prev) => prev + 1)}
                    className="rounded-lg border border-zinc-700 px-3 py-2 text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        )}

        {activeTab === "billing" && (
          <div className="grid gap-4 md:grid-cols-2">
            <ScrollReveal>
              <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
                <h2 className="text-sm font-semibold text-zinc-200">Active plan distribution</h2>
                <div className="mt-4 space-y-3">
                  {activePlanRows.length === 0 ? (
                    <p className="text-sm text-zinc-400">No active subscriptions found.</p>
                  ) : (
                    activePlanRows.map((row) => (
                      <div key={row.plan} className="rounded-lg border border-zinc-800 p-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">{displayPlan(row.plan)}</p>
                        <p className="mt-1 text-xl font-semibold text-zinc-100">{formatNumber(row.users)} users</p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </ScrollReveal>

            <ScrollReveal>
              <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
                <h2 className="text-sm font-semibold text-zinc-200">Billing health</h2>
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-zinc-300">
                    Avg rewrite latency:{" "}
                    <span className="text-zinc-100 font-semibold">{formatLatency(analytics?.avg_latency_rewrite_ms ?? 0)}</span>
                  </p>
                  <p className="text-sm text-zinc-300">
                    Avg detector latency:{" "}
                    <span className="text-zinc-100 font-semibold">{formatLatency(analytics?.avg_latency_detect_ms ?? 0)}</span>
                  </p>
                  <p className="text-sm text-zinc-300">
                    Requests this window: <span className="text-zinc-100 font-semibold">{formatNumber(actionRows.reduce((sum, row) => sum + row.count, 0))}</span>
                  </p>
                  <p className="text-sm text-zinc-300">
                    Success rate: <span className="text-emerald-300 font-semibold">{successRate.toFixed(1)}%</span>
                  </p>
                  <p className="text-sm text-zinc-300">
                    Error rate: <span className="text-red-300 font-semibold">{errorRateRate.toFixed(1)}%</span>
                  </p>
                  <p className="text-sm text-zinc-300">
                    Blocked rate: <span className="text-amber-300 font-semibold">{blockedRate.toFixed(1)}%</span>
                  </p>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        )}

        {activeTab === "analytics" && (
          <ScrollReveal>
            <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
              <h2 className="text-sm font-semibold text-zinc-200">Request action distribution (last 30 days)</h2>
              <div className="mt-4 space-y-3">
                {actionRows.length === 0 ? (
                  <p className="text-sm text-zinc-400">No action data yet.</p>
                ) : (
                  actionRows.map((row) => {
                    const total = actionRows.reduce((sum, item) => sum + item.count, 0)
                    const share = total === 0 ? 0 : (row.count / total) * 100
                    return (
                      <div key={row.action}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="capitalize text-zinc-200">{row.action}</span>
                          <span className="text-zinc-300">{formatNumber(row.count)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-800">
                          <div className="h-2 rounded-full bg-indigo-400" style={{ width: `${Math.max(share, 2)}%` }} />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>
          </ScrollReveal>
        )}

        {activeTab === "settings" && (
          <div className="grid gap-4 md:grid-cols-2">
            <ScrollReveal>
              <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
                <h2 className="text-sm font-semibold text-zinc-200">Maintenance settings</h2>
                <div className="mt-4 space-y-2 text-sm text-zinc-300">
                  <p>Admin panel reads from secure server APIs and only allows role-based access for users with `admin` role.</p>
                  <p>For production, rotate keys and monitor these metrics daily.</p>
                </div>
              </Card>
            </ScrollReveal>
            <ScrollReveal>
              <Card className="rounded-2xl border-zinc-700/40 bg-zinc-900/50 p-5">
                <h2 className="text-sm font-semibold text-zinc-200">Data sources</h2>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li>• usage_logs (actions, latency, status)</li>
                  <li>• rewrite_requests + detector_requests (volumes)</li>
                  <li>• subscriptions + users collections (billing and plans)</li>
                </ul>
              </Card>
            </ScrollReveal>
          </div>
        )}
      </div>
    </main>
  )
}
