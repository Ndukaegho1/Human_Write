"use client"

import { useEffect, useState } from "react"

export type LanguageCode = "en" | "fr" | "es" | "de" | "pt" | "it"

export const languageLabels: Record<LanguageCode, string> = {
  en: "English",
  fr: "Francais",
  es: "Espanol",
  de: "Deutsch",
  pt: "Portugues",
  it: "Italiano",
}

export function useLanguage() {
  const [language, setLanguage] = useState<LanguageCode>("en")

  useEffect(() => {
    const initial = (localStorage.getItem("hw-language") as LanguageCode | null) || "en"
    setLanguage(initial)

    const onLanguageUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ language?: LanguageCode }>).detail
      if (detail?.language) setLanguage(detail.language)
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === "hw-language" && event.newValue) {
        setLanguage(event.newValue as LanguageCode)
      }
    }

    window.addEventListener("hw-language-updated", onLanguageUpdated as EventListener)
    window.addEventListener("storage", onStorage)

    return () => {
      window.removeEventListener("hw-language-updated", onLanguageUpdated as EventListener)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  return language
}
