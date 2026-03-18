"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { firebaseClientAuth } from "@/lib/firebase/client"
import { LanguageCode, languageLabels } from "@/lib/i18n"

const primaryRoutes = [
  { key: "dashboard", href: "/dashboard", icon: "dashboard", iconClass: "bg-lime-100 text-lime-700" },
  { key: "humanizer", href: "/humanizer", icon: "humanizer", iconClass: "bg-emerald-100 text-emerald-700" },
  { key: "detector", href: "/detector", icon: "detector", iconClass: "bg-sky-100 text-sky-700" },
] as const

const profileRoutes = [
  { key: "settings", href: "/settings", icon: "settings" },
  { key: "history", href: "/history", icon: "history" },
  { key: "voiceProfile", href: "/voice-profile", icon: "voice" },
  { key: "pricing", href: "/pricing", icon: "pricing" },
] as const

const languages = [
  { code: "en", label: languageLabels.en },
  { code: "fr", label: languageLabels.fr },
  { code: "es", label: languageLabels.es },
  { code: "de", label: languageLabels.de },
  { code: "pt", label: languageLabels.pt },
  { code: "it", label: languageLabels.it },
] as const

const translations = {
  en: {
    workspace: "Humanizer Workspace",
    login: "Log in",
    getStarted: "Get Started",
    collapse: "Collapse",
    createNew: "Create New",
    writingTools: "Writing Tools",
    profile: "Profile",
    dashboard: "Dashboard",
    humanizer: "Humanizer",
    detector: "AI Detector",
    settings: "Settings",
    history: "History",
    voiceProfile: "Voice Profile",
    pricing: "Pricing",
    accountDetails: "Account details",
    darkMode: "Dark mode",
    helpCenter: "Help Center",
    contactUs: "Contact us",
    logout: "Log out",
  },
  fr: {
    workspace: "Espace Humanizer",
    login: "Connexion",
    getStarted: "Commencer",
    collapse: "Reduire",
    createNew: "Creer",
    writingTools: "Outils",
    profile: "Profil",
    dashboard: "Tableau de bord",
    humanizer: "Humanizer",
    detector: "Detecteur IA",
    settings: "Parametres",
    history: "Historique",
    voiceProfile: "Profil vocal",
    pricing: "Tarifs",
    accountDetails: "Details du compte",
    darkMode: "Mode sombre",
    helpCenter: "Centre d'aide",
    contactUs: "Contact",
    logout: "Deconnexion",
  },
  es: {
    workspace: "Espacio Humanizer",
    login: "Iniciar sesion",
    getStarted: "Comenzar",
    collapse: "Ocultar",
    createNew: "Crear",
    writingTools: "Herramientas",
    profile: "Perfil",
    dashboard: "Panel",
    humanizer: "Humanizer",
    detector: "Detector IA",
    settings: "Configuracion",
    history: "Historial",
    voiceProfile: "Perfil de voz",
    pricing: "Precios",
    accountDetails: "Detalles de la cuenta",
    darkMode: "Modo oscuro",
    helpCenter: "Centro de ayuda",
    contactUs: "Contacto",
    logout: "Cerrar sesion",
  },
  de: {
    workspace: "Humanizer Bereich",
    login: "Anmelden",
    getStarted: "Starten",
    collapse: "Schliessen",
    createNew: "Neu",
    writingTools: "Werkzeuge",
    profile: "Profil",
    dashboard: "Dashboard",
    humanizer: "Humanizer",
    detector: "KI Detektor",
    settings: "Einstellungen",
    history: "Verlauf",
    voiceProfile: "Stimmprofil",
    pricing: "Preise",
    accountDetails: "Kontodetails",
    darkMode: "Dunkelmodus",
    helpCenter: "Hilfezentrum",
    contactUs: "Kontakt",
    logout: "Abmelden",
  },
  pt: {
    workspace: "Espaco Humanizer",
    login: "Entrar",
    getStarted: "Comecar",
    collapse: "Recolher",
    createNew: "Criar",
    writingTools: "Ferramentas",
    profile: "Perfil",
    dashboard: "Painel",
    humanizer: "Humanizer",
    detector: "Detector IA",
    settings: "Configuracoes",
    history: "Historico",
    voiceProfile: "Perfil de voz",
    pricing: "Precos",
    accountDetails: "Detalhes da conta",
    darkMode: "Modo escuro",
    helpCenter: "Central de ajuda",
    contactUs: "Contato",
    logout: "Sair",
  },
  it: {
    workspace: "Spazio Humanizer",
    login: "Accedi",
    getStarted: "Inizia",
    collapse: "Riduci",
    createNew: "Crea",
    writingTools: "Strumenti",
    profile: "Profilo",
    dashboard: "Dashboard",
    humanizer: "Humanizer",
    detector: "Rilevatore IA",
    settings: "Impostazioni",
    history: "Cronologia",
    voiceProfile: "Profilo voce",
    pricing: "Prezzi",
    accountDetails: "Dettagli account",
    darkMode: "Modalita scura",
    helpCenter: "Centro assistenza",
    contactUs: "Contatti",
    logout: "Esci",
  },
} as const

function Icon({ name }: { name: string }) {
  if (name === "dashboard")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h8V3H3zM13 21h8v-6h-8zM13 10h8V3h-8zM3 21h8v-7H3z" />
      </svg>
    )
  if (name === "humanizer")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7h16M4 12h10M4 17h7M18 14l3 3-3 3" />
      </svg>
    )
  if (name === "detector")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5M8 11h6" />
      </svg>
    )
  if (name === "summarizer")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 6h14M5 12h14M5 18h9" />
      </svg>
    )
  if (name === "grammar")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 4h10v6H5zM10 10v10M6 16h8" />
      </svg>
    )
  if (name === "plagiarism")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="11" height="15" rx="2" />
        <path d="M9 7h4M9 11h4M17 15l4 4M17 19l4-4" />
      </svg>
    )
  if (name === "settings")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5L9 6a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.5 3h5l.5-3a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6c.07-.33.1-.66.1-1Z" />
      </svg>
    )
  if (name === "history")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2" />
      </svg>
    )
  if (name === "voice")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="3" width="6" height="10" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
      </svg>
    )
  if (name === "collapse")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16M14 12h4M16 10l2 2-2 2" />
      </svg>
    )
  if (name === "expand")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M15 4v16M10 12H6M8 10l-2 2 2 2" />
      </svg>
    )
  if (name === "chevron-down")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
      </svg>
    )
  if (name === "account")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c1.8-3.5 5-5 8-5s6.2 1.5 8 5" />
      </svg>
    )
  if (name === "language")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    )
  if (name === "moon")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
      </svg>
    )
  if (name === "help")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.1 9a3 3 0 1 1 5.6 1.5c-.6.8-1.5 1.2-2.1 1.8-.4.4-.6.8-.6 1.7" />
        <path d="M12 17h.01" />
      </svg>
    )
  if (name === "contact")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    )
  if (name === "logout")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M2 12h20" />
    </svg>
  )
}

function ProfileMenu({
  email,
  darkMode,
  language,
  languageOpen,
  onToggleLanguageOpen,
  onSelectLanguage,
  onToggleDarkMode,
  onLogout,
}: {
  email: string
  darkMode: boolean
  language: LanguageCode
  languageOpen: boolean
  onToggleLanguageOpen: () => void
  onSelectLanguage: (language: LanguageCode) => void
  onToggleDarkMode: () => void
  onLogout: () => void
}) {
  const t = translations[language]
  const currentLanguage = languages.find((item) => item.code === language)?.label || "English"

  return (
    <div className="w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[28px] border border-[var(--hx-border)] bg-[var(--hx-card)] shadow-2xl">
      <div className="border-b border-[var(--hx-border)] px-6 py-5 text-[15px] font-medium text-[var(--hx-nav-link-active)]">{email}</div>
      <div className="divide-y divide-[var(--hx-border)]">
        <Link href="/settings" className="flex items-center gap-4 px-6 py-5 text-[15px] font-medium text-[var(--hx-nav-link)] transition hover:bg-[var(--hx-green-soft)]/40">
          <Icon name="account" />
          <span>{t.accountDetails}</span>
        </Link>
        <button
          type="button"
          onClick={onToggleLanguageOpen}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-[15px] font-medium text-[var(--hx-nav-link)] transition hover:bg-[var(--hx-green-soft)]/40"
        >
          <span className="inline-flex items-center gap-4">
            <Icon name="language" />
            <span>{currentLanguage}</span>
          </span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
        {languageOpen ? (
          <div className="grid gap-1 bg-[var(--hx-surface)] px-4 py-3">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => onSelectLanguage(item.code)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                  language === item.code
                    ? "bg-[var(--hx-green-soft)] text-[var(--hx-nav-link-active)]"
                    : "text-[var(--hx-nav-link)] hover:bg-[var(--hx-green-soft)]/40"
                }`}
              >
                <Icon name="language" />
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-[15px] font-medium text-[var(--hx-nav-link)] transition hover:bg-[var(--hx-green-soft)]/40"
        >
          <span className="inline-flex items-center gap-4">
            <Icon name="moon" />
            <span>{t.darkMode}</span>
          </span>
          <span
            className={`relative inline-flex h-8 w-14 items-center rounded-full border transition ${
              darkMode ? "border-[var(--hx-green)] bg-[var(--hx-green-soft)]" : "border-[var(--hx-border)] bg-transparent"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full transition ${
                darkMode ? "translate-x-7 bg-[var(--hx-green)]" : "translate-x-1 bg-[var(--hx-nav-muted)]"
              }`}
            />
          </span>
        </button>
        <Link href="/help-center" className="flex items-center gap-4 px-6 py-5 text-[15px] font-medium text-[var(--hx-nav-link)] transition hover:bg-[var(--hx-green-soft)]/40">
          <Icon name="help" />
          <span>{t.helpCenter}</span>
        </Link>
        <Link href="/contact-us" className="flex items-center gap-4 px-6 py-5 text-[15px] font-medium text-[var(--hx-nav-link)] transition hover:bg-[var(--hx-green-soft)]/40">
          <Icon name="contact" />
          <span>{t.contactUs}</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-4 px-6 py-5 text-left text-[15px] font-medium text-[var(--hx-nav-link)] transition hover:bg-[var(--hx-green-soft)]/40"
        >
          <Icon name="logout" />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  )
}

export function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [language, setLanguage] = useState<LanguageCode>("en")
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("hw-sidebar-collapsed") === "true"
    const themeValue = localStorage.getItem("hw-theme")
    const savedDark = themeValue ? themeValue === "dark" : localStorage.getItem("hw-dark-mode") === "true"
    const savedLanguage = (localStorage.getItem("hw-language") as LanguageCode | null) || "en"
    setCollapsed(saved)
    setDarkMode(savedDark)
    setLanguage(savedLanguage)
    document.documentElement.classList.toggle("sidebar-collapsed", saved)
    document.documentElement.classList.toggle("dark", savedDark)
    document.documentElement.lang = savedLanguage

    const unsubscribe = onAuthStateChanged(firebaseClientAuth, (user) => {
      setUserEmail(user?.email || null)
      setDisplayName(user?.displayName || null)
      setAvatarUrl(user?.photoURL || null)

      if (!user) {
        localStorage.removeItem("hw-profile-cache")
        return
      }

      user
        .getIdToken()
        .then(async (token) => {
          const response = await fetch("/api/auth/sync", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => null)
          const data = await response?.json().catch(() => null)
          const profile = {
            email: data?.user?.email || user.email || null,
            displayName: data?.user?.display_name || user.displayName || null,
            avatarUrl: data?.user?.avatar_url || user.photoURL || null,
          }
          setUserEmail(profile.email)
          setDisplayName(profile.displayName)
          setAvatarUrl(profile.avatarUrl)
          localStorage.setItem("hw-profile-cache", JSON.stringify(profile))
        })
        .catch(() => null)
    })

    const cached = localStorage.getItem("hw-profile-cache")
    if (cached) {
      try {
        const profile = JSON.parse(cached) as { email?: string; displayName?: string; avatarUrl?: string }
        setUserEmail(profile.email || null)
        setDisplayName(profile.displayName || null)
        setAvatarUrl(profile.avatarUrl || null)
      } catch {
        // ignore stale cache
      }
    }

    const handleProfileUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ email?: string; displayName?: string; avatarUrl?: string }>).detail
      if (!detail) return
      setUserEmail(detail.email || null)
      setDisplayName(detail.displayName || null)
      setAvatarUrl(detail.avatarUrl || null)
    }

    window.addEventListener("hw-profile-updated", handleProfileUpdated as EventListener)

    return () => {
      unsubscribe()
      window.removeEventListener("hw-profile-updated", handleProfileUpdated as EventListener)
    }
  }, [])

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    document.documentElement.classList.toggle("sidebar-collapsed", next)
    localStorage.setItem("hw-sidebar-collapsed", String(next))
  }

  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("hw-dark-mode", String(next))
  }

  const selectLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage)
    setLanguageOpen(false)
    localStorage.setItem("hw-language", nextLanguage)
    document.documentElement.lang = nextLanguage
    window.dispatchEvent(new CustomEvent("hw-language-updated", { detail: { language: nextLanguage } }))
  }

  const handleLogout = async () => {
    await signOut(firebaseClientAuth).catch(() => null)
    localStorage.removeItem("hw-profile-cache")
    setProfileOpen(false)
    router.push("/auth")
  }

  const isActive = (href: string) => pathname === href
  const userInitial = (displayName || userEmail || "N").charAt(0).toUpperCase()
  const t = translations[language]

  const itemClass = (href: string) =>
    `relative rounded-2xl border px-3 py-2.5 text-[15px] transition ${
      isActive(href)
        ? "border-[var(--hx-green)]/60 bg-[var(--hx-green-soft)] text-[var(--hx-nav-link-active)]"
        : "border-[var(--hx-border)] text-[var(--hx-nav-link)] hover:border-[var(--hx-green)]/40 hover:text-[var(--hx-nav-link-active)]"
    }`

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--hx-border)] bg-[var(--hx-panel)] px-4 py-4 backdrop-blur md:hidden">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--hx-green)] text-xs font-black text-[#08100d]">
            HW
          </span>
          <span className="text-lg font-semibold">HumanWrite</span>
        </Link>
        {userEmail ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--hx-border)] bg-[var(--hx-card)] p-1 pr-2"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1788d7] text-lg font-semibold text-white">{userInitial}</span>
              <Icon name="chevron-down" />
            </button>
            {profileOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50">
                <ProfileMenu
                  email={userEmail}
                  darkMode={darkMode}
                  language={language}
                  languageOpen={languageOpen}
                  onToggleLanguageOpen={() => setLanguageOpen((open) => !open)}
                  onSelectLanguage={selectLanguage}
                  onToggleDarkMode={toggleDarkMode}
                  onLogout={handleLogout}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="rounded-full border border-[var(--hx-border)] px-3 py-1 text-xs text-[var(--hx-nav-text)] hover:border-[var(--hx-green)]/50"
            >
              {t.login}
            </Link>
            <Link
              href="/auth"
              className="rounded-full bg-[var(--hx-green)] px-3 py-1 text-xs font-semibold text-[#08100d]"
            >
              {t.getStarted}
            </Link>
          </div>
        )}
      </header>

      <header className="sticky top-0 z-40 hidden border-b border-[var(--hx-border)] bg-[linear-gradient(180deg,rgba(223,244,228,0.88),rgba(242,250,244,0.9))] backdrop-blur md:flex md:h-20 md:items-center md:justify-between md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--hx-green)] text-sm font-black text-white shadow-sm">
              HW
            </span>
            <span className="text-[34px] font-semibold leading-none text-[var(--hx-green)]">HumanWrite</span>
          </Link>
        </div>

        <div className="hidden lg:block">
          <p className="text-[17px] font-semibold text-[var(--hx-nav-link-active)]">{t.workspace}</p>
        </div>

        <div className="relative flex items-center gap-4">
          {userEmail ? (
            <>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="inline-flex items-center gap-3 rounded-full pl-2"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Profile" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1788d7] text-lg font-semibold text-white">
                    {userInitial}
                  </span>
                )}
              </button>
              {profileOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.9rem)] z-50">
                  <ProfileMenu
                    email={userEmail}
                    darkMode={darkMode}
                    language={language}
                    languageOpen={languageOpen}
                    onToggleLanguageOpen={() => setLanguageOpen((open) => !open)}
                    onSelectLanguage={selectLanguage}
                    onToggleDarkMode={toggleDarkMode}
                    onLogout={handleLogout}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth"
                className="rounded-full border border-[var(--hx-border)] px-4 py-2 text-sm text-[var(--hx-nav-text)] hover:border-[var(--hx-green)]/50"
              >
                {t.login}
              </Link>
              <Link
                href="/auth"
                className="rounded-full bg-[var(--hx-green)] px-4 py-2 text-sm font-semibold text-white"
              >
                {t.getStarted}
              </Link>
            </div>
          )}
        </div>
      </header>

      <aside className="hidden border-r border-[var(--hx-border)] bg-[var(--hx-panel)] p-4 md:fixed md:left-0 md:top-20 md:block md:h-[calc(100vh-5rem)] md:w-[var(--sidebar-w)] md:overflow-y-auto">
        <div className="flex h-full flex-col space-y-6">
          <div className={`${collapsed ? "flex justify-center" : "hidden"}`}>
            <Link href="/" className="group inline-flex items-center gap-2 pt-1">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--hx-green)] text-xs font-black text-[#08100d]">
                HW
              </span>
            </Link>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={toggleCollapsed}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--hx-border)] px-3 py-2 text-sm font-semibold text-[var(--hx-nav-text)] transition hover:border-[var(--hx-green)]/50"
            >
              <Icon name={collapsed ? "expand" : "collapse"} />
              {!collapsed ? <span>{t.collapse}</span> : null}
            </button>
            <Link
              href="/humanizer"
              className={`block rounded-xl bg-[var(--hx-green)] px-3 py-2 text-[15px] font-semibold text-[#08100d] ${
                collapsed ? "text-center" : ""
              }`}
            >
              {collapsed ? "+" : t.createNew}
            </Link>
          </div>

          <div className="space-y-2">
            {!collapsed ? <p className="px-1 text-xs font-semibold uppercase tracking-wide text-[var(--hx-nav-muted)]">{t.writingTools}</p> : null}
            {primaryRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`${itemClass(route.href)} flex items-center ${collapsed ? "justify-center" : "gap-3"}`}
                title={t[route.key]}
              >
                {isActive(route.href) ? (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-[var(--hx-green)]" />
                ) : null}
                <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${route.iconClass}`}>
                  <Icon name={route.icon} />
                </span>
                {!collapsed ? <span>{t[route.key]}</span> : null}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            {!collapsed ? <p className="px-1 text-xs font-semibold uppercase tracking-wide text-[var(--hx-nav-muted)]">{t.profile}</p> : null}
            {profileRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`${itemClass(route.href)} block ${collapsed ? "text-center" : ""}`}
                title={t[route.key]}
              >
                {isActive(route.href) ? (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-[var(--hx-green)]" />
                ) : null}
                <span className={`inline-flex items-center ${collapsed ? "justify-center" : "gap-2"}`}>
                  <Icon name={route.icon} />
                  {!collapsed ? t[route.key] : null}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-auto space-y-2 pt-2">
            {!userEmail ? (
              <>
                <Link
                  href="/auth"
                  className="block rounded-xl border border-[var(--hx-border)] px-3 py-2 text-center text-[15px] text-[var(--hx-nav-text)] hover:border-[var(--hx-green)]/50"
                >
                  {t.login}
                </Link>
                <Link
                  href="/auth"
                  className="block rounded-xl bg-[var(--hx-green)] px-3 py-2 text-center text-[15px] font-semibold text-[#08100d]"
                >
                  {t.getStarted}
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  )
}
