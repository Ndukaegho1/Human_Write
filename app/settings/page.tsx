"use client"

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animation/ScrollReveal"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { firebaseClientAuth } from "@/lib/firebase/client"
import { useLanguage } from "@/lib/i18n"

export default function SettingsPage() {
  const language = useLanguage()
  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const extraCopy = {
    firstName: "First name",
    lastName: "Last name",
    setPassword: "Add password",
    setPasswordText: "Signed up with Google? Send yourself a secure password setup email for this account.",
    setPasswordSent: "Password setup email sent. Check your inbox.",
    passwordSetupFailed: "Could not start password setup.",
    uploadAction: "Upload photo",
    removeAction: "Remove photo",
    imageRemoved: "Profile picture removed. Save changes to keep this update.",
  }

  const copy = {
    en: {
      title: "Settings",
      subtitle: "Manage your account, billing, and data controls.",
      account: "Account",
      accountText: "Plan and usage are available on your billing profile.",
      currentPlan: "Current plan: Free",
      usage: "Monthly usage: 0 / 30 rewrites",
      manageBilling: "Manage billing",
      profileInfo: "Profile info",
      profilePicture: "Profile picture",
      loadingImage: "Loading image...",
      uploadImage: "Upload an image to replace your current photo.",
      displayName: "Display name",
      updateEmail: "Update email",
      saving: "Saving...",
      saveChanges: "Save changes",
      profileUpdated: "Profile updated.",
      loginAgain: "Please log in again.",
      imageFile: "Please choose an image file.",
      imageSize: "Please use an image under 1MB for now.",
      imageRead: "Could not read that image.",
      profileUpdateFailed: "Could not update profile.",
      appearance: "Appearance",
      appearanceText: "Theme mode is controlled here.",
      workspace: "Profile Workspace",
      workspaceText: "Manage personal writing assets from one place.",
      history: "History",
      voiceProfile: "Voice Profile",
      pricing: "Pricing",
      dataControls: "Data controls",
      dataControlsText: "You can request profile deletion from account support.",
    },
    fr: {
      title: "Parametres",
      subtitle: "Gerez votre compte, la facturation et les controles des donnees.",
      account: "Compte",
      accountText: "Le plan et l'utilisation sont disponibles dans votre profil de facturation.",
      currentPlan: "Forfait actuel : Gratuit",
      usage: "Utilisation mensuelle : 0 / 30 reformulations",
      manageBilling: "Gerer la facturation",
      profileInfo: "Informations du profil",
      profilePicture: "Photo de profil",
      loadingImage: "Chargement de l'image...",
      uploadImage: "Telechargez une image pour remplacer votre photo actuelle.",
      displayName: "Nom affiche",
      updateEmail: "Mettre a jour l'e-mail",
      saving: "Enregistrement...",
      saveChanges: "Enregistrer",
      profileUpdated: "Profil mis a jour.",
      loginAgain: "Veuillez vous reconnecter.",
      imageFile: "Veuillez choisir une image.",
      imageSize: "Veuillez utiliser une image de moins de 1 Mo.",
      imageRead: "Impossible de lire cette image.",
      profileUpdateFailed: "Impossible de mettre a jour le profil.",
      appearance: "Apparence",
      appearanceText: "Le mode de theme est controle ici.",
      workspace: "Espace profil",
      workspaceText: "Gerez vos ressources d'ecriture depuis un seul endroit.",
      history: "Historique",
      voiceProfile: "Profil vocal",
      pricing: "Tarifs",
      dataControls: "Controle des donnees",
      dataControlsText: "Vous pouvez demander la suppression du profil via le support.",
    },
    es: {
      title: "Configuracion",
      subtitle: "Administra tu cuenta, facturacion y controles de datos.",
      account: "Cuenta",
      accountText: "El plan y el uso estan disponibles en tu perfil de facturacion.",
      currentPlan: "Plan actual: Gratis",
      usage: "Uso mensual: 0 / 30 reescrituras",
      manageBilling: "Gestionar facturacion",
      profileInfo: "Informacion del perfil",
      profilePicture: "Foto de perfil",
      loadingImage: "Cargando imagen...",
      uploadImage: "Sube una imagen para reemplazar tu foto actual.",
      displayName: "Nombre visible",
      updateEmail: "Actualizar correo",
      saving: "Guardando...",
      saveChanges: "Guardar cambios",
      profileUpdated: "Perfil actualizado.",
      loginAgain: "Vuelve a iniciar sesion.",
      imageFile: "Selecciona un archivo de imagen.",
      imageSize: "Usa una imagen de menos de 1 MB por ahora.",
      imageRead: "No se pudo leer la imagen.",
      profileUpdateFailed: "No se pudo actualizar el perfil.",
      appearance: "Apariencia",
      appearanceText: "El modo de tema se controla aqui.",
      workspace: "Espacio de perfil",
      workspaceText: "Administra tus recursos de escritura desde un solo lugar.",
      history: "Historial",
      voiceProfile: "Perfil de voz",
      pricing: "Precios",
      dataControls: "Controles de datos",
      dataControlsText: "Puedes solicitar la eliminacion del perfil desde soporte.",
    },
    de: {
      title: "Einstellungen",
      subtitle: "Verwalten Sie Ihr Konto, die Abrechnung und Datenkontrollen.",
      account: "Konto",
      accountText: "Plan und Nutzung sind in Ihrem Abrechnungsprofil verfugbar.",
      currentPlan: "Aktueller Plan: Kostenlos",
      usage: "Monatliche Nutzung: 0 / 30 Umschreibungen",
      manageBilling: "Abrechnung verwalten",
      profileInfo: "Profilinformationen",
      profilePicture: "Profilbild",
      loadingImage: "Bild wird geladen...",
      uploadImage: "Laden Sie ein Bild hoch, um Ihr aktuelles Foto zu ersetzen.",
      displayName: "Anzeigename",
      updateEmail: "E-Mail aktualisieren",
      saving: "Speichern...",
      saveChanges: "Anderungen speichern",
      profileUpdated: "Profil aktualisiert.",
      loginAgain: "Bitte erneut anmelden.",
      imageFile: "Bitte eine Bilddatei auswahlen.",
      imageSize: "Bitte vorerst ein Bild unter 1 MB verwenden.",
      imageRead: "Das Bild konnte nicht gelesen werden.",
      profileUpdateFailed: "Profil konnte nicht aktualisiert werden.",
      appearance: "Darstellung",
      appearanceText: "Der Theme-Modus wird hier gesteuert.",
      workspace: "Profilbereich",
      workspaceText: "Verwalten Sie Ihre Schreibressourcen an einem Ort.",
      history: "Verlauf",
      voiceProfile: "Sprachprofil",
      pricing: "Preise",
      dataControls: "Datenkontrolle",
      dataControlsText: "Sie konnen die Loschung des Profils uber den Support anfordern.",
    },
    pt: {
      title: "Configuracoes",
      subtitle: "Gerencie sua conta, cobranca e controles de dados.",
      account: "Conta",
      accountText: "Plano e uso estao disponiveis no seu perfil de cobranca.",
      currentPlan: "Plano atual: Gratis",
      usage: "Uso mensal: 0 / 30 reescritas",
      manageBilling: "Gerenciar cobranca",
      profileInfo: "Informacoes do perfil",
      profilePicture: "Foto de perfil",
      loadingImage: "Carregando imagem...",
      uploadImage: "Envie uma imagem para substituir sua foto atual.",
      displayName: "Nome exibido",
      updateEmail: "Atualizar e-mail",
      saving: "Salvando...",
      saveChanges: "Salvar alteracoes",
      profileUpdated: "Perfil atualizado.",
      loginAgain: "Faca login novamente.",
      imageFile: "Escolha um arquivo de imagem.",
      imageSize: "Use uma imagem com menos de 1 MB por enquanto.",
      imageRead: "Nao foi possivel ler a imagem.",
      profileUpdateFailed: "Nao foi possivel atualizar o perfil.",
      appearance: "Aparencia",
      appearanceText: "O modo de tema e controlado aqui.",
      workspace: "Espaco do perfil",
      workspaceText: "Gerencie seus recursos de escrita em um so lugar.",
      history: "Historico",
      voiceProfile: "Perfil de voz",
      pricing: "Precos",
      dataControls: "Controles de dados",
      dataControlsText: "Voce pode solicitar a exclusao do perfil ao suporte.",
    },
    it: {
      title: "Impostazioni",
      subtitle: "Gestisci account, fatturazione e controlli dei dati.",
      account: "Account",
      accountText: "Piano e utilizzo sono disponibili nel profilo di fatturazione.",
      currentPlan: "Piano attuale: Gratuito",
      usage: "Utilizzo mensile: 0 / 30 riscritture",
      manageBilling: "Gestisci fatturazione",
      profileInfo: "Informazioni profilo",
      profilePicture: "Foto profilo",
      loadingImage: "Caricamento immagine...",
      uploadImage: "Carica un'immagine per sostituire la foto attuale.",
      displayName: "Nome visualizzato",
      updateEmail: "Aggiorna e-mail",
      saving: "Salvataggio...",
      saveChanges: "Salva modifiche",
      profileUpdated: "Profilo aggiornato.",
      loginAgain: "Accedi di nuovo.",
      imageFile: "Seleziona un file immagine.",
      imageSize: "Usa per ora un'immagine sotto 1 MB.",
      imageRead: "Impossibile leggere l'immagine.",
      profileUpdateFailed: "Impossibile aggiornare il profilo.",
      appearance: "Aspetto",
      appearanceText: "La modalita tema si controlla qui.",
      workspace: "Spazio profilo",
      workspaceText: "Gestisci le tue risorse di scrittura da un unico posto.",
      history: "Cronologia",
      voiceProfile: "Profilo vocale",
      pricing: "Prezzi",
      dataControls: "Controlli dati",
      dataControlsText: "Puoi richiedere l'eliminazione del profilo tramite il supporto.",
    },
  }[language]

  useEffect(() => {
    const user = firebaseClientAuth.currentUser
    if (user?.email) setEmail(user.email)
    if (user?.displayName) {
      setDisplayName(user.displayName)
      const [first, ...rest] = user.displayName.split(/\s+/)
      setFirstName(first || "")
      setLastName(rest.join(" "))
    }
    if (user?.photoURL) setAvatarUrl(user.photoURL)

    const cached = localStorage.getItem("hw-profile-cache")
    if (!cached) return

    try {
      const profile = JSON.parse(cached) as {
        email?: string
        displayName?: string
        firstName?: string
        lastName?: string
        avatarUrl?: string
      }
      if (profile.email) setEmail(profile.email)
      if (profile.displayName) setDisplayName(profile.displayName)
      if (profile.firstName) setFirstName(profile.firstName)
      if (profile.lastName) setLastName(profile.lastName)
      if (profile.avatarUrl) setAvatarUrl(profile.avatarUrl)
    } catch {
      // ignore stale cache
    }
  }, [])

  const updateProfileCache = (profile: {
    email?: string
    displayName?: string
    firstName?: string
    lastName?: string
    avatarUrl?: string
  }) => {
    localStorage.setItem("hw-profile-cache", JSON.stringify(profile))
    window.dispatchEvent(new CustomEvent("hw-profile-updated", { detail: profile }))
  }

  const updateProfile = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const token = await firebaseClientAuth.currentUser?.getIdToken()
      if (!token) throw new Error(copy.loginAgain)

      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          displayName: `${firstName} ${lastName}`.trim() || displayName,
          firstName,
          lastName,
          avatarUrl,
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error || "Could not update profile.")

      const profile = {
        email: data?.user?.email || email,
        displayName: data?.user?.display_name || displayName,
        firstName: data?.user?.first_name || firstName,
        lastName: data?.user?.last_name || lastName,
        avatarUrl: data?.user?.avatar_url || avatarUrl,
      }
      updateProfileCache(profile)
      setMessage(copy.profileUpdated)
    } catch (error) {
      setMessage((error as Error).message || copy.profileUpdateFailed)
    } finally {
      setSaving(false)
    }
  }

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setMessage(copy.imageFile)
      return
    }
    if (file.size > 1_000_000) {
      setMessage(copy.imageSize)
      return
    }

    setUploading(true)
    setMessage(null)
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarUrl(typeof reader.result === "string" ? reader.result : "")
      setUploading(false)
    }
    reader.onerror = () => {
      setUploading(false)
      setMessage(copy.imageRead)
    }
    reader.readAsDataURL(file)
  }

  const triggerAvatarUpload = () => {
    avatarInputRef.current?.click()
  }

  const clearAvatar = () => {
    setAvatarUrl("")
    setMessage(extraCopy.imageRemoved)
  }

  const startPasswordSetup = async () => {
    if (!email.trim()) {
      setMessage(copy.loginAgain)
      return
    }

    setSaving(true)
    setMessage(null)
    try {
      await sendPasswordResetEmail(firebaseClientAuth, email.trim())
      setMessage(extraCopy.setPasswordSent)
    } catch (error) {
      setMessage((error as Error).message || extraCopy.passwordSetupFailed)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div>
          <h1 className="section-title text-[#0F172A]">{copy.title}</h1>
          <p className="text-sm text-[#475569]">{copy.subtitle}</p>
        </div>
      </ScrollReveal>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScrollReveal delay={0.06}>
          <Card className="border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#0F172A]">{copy.account}</h2>
            <p className="mt-2 text-sm text-[#475569]">{copy.accountText}</p>
            <p className="mt-4 text-sm text-[#0F172A]">{copy.currentPlan}</p>
            <p className="mt-1 text-sm text-[#475569]">{copy.usage}</p>
            <a className="mt-4 inline-block rounded-lg border border-[#28B04D] px-3 py-1.5 text-[#28B04D] hover:bg-[#28B04D]/5 transition-colors" href="/api/billing/portal">
              {copy.manageBilling}
            </a>
            <div className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-sm font-semibold text-[#0F172A]">{extraCopy.setPassword}</p>
              <p className="mt-1 text-sm text-[#475569]">{extraCopy.setPasswordText}</p>
              <Button type="button" variant="ghost" className="mt-3" onClick={startPasswordSetup} disabled={saving}>
                {extraCopy.setPassword}
              </Button>
            </div>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <Card className="border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#0F172A]">{copy.profileInfo}</h2>
            <form onSubmit={updateProfile} className="mt-3 space-y-3">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-[#E2E8F0] bg-[#F8FAFC]">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl font-semibold text-[#0F4C81]">
                      {(displayName || email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#475569]">{copy.profilePicture}</label>
                  <input ref={avatarInputRef} type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="outline" onClick={triggerAvatarUpload} disabled={uploading}>
                      {extraCopy.uploadAction}
                    </Button>
                    {avatarUrl ? (
                      <Button type="button" variant="ghost" onClick={clearAvatar}>
                        {extraCopy.removeAction}
                      </Button>
                    ) : null}
                  </div>
                  <p className="text-xs text-[#64748B]">{uploading ? copy.loadingImage : copy.uploadImage}</p>
                </div>
              </div>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={extraCopy.firstName}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-[#0F172A]"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={extraCopy.lastName}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-[#0F172A]"
              />
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={copy.displayName}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-[#0F172A]"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.updateEmail}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2 text-[#0F172A]"
              />
              <Button type="submit" disabled={saving} className="bg-[#0F4C81] hover:bg-[#0a3d66]">
                {saving ? copy.saving : copy.saveChanges}
              </Button>
            </form>
            {message ? <p className="mt-3 text-sm text-[#28B04D]">{message}</p> : null}
          </Card>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.085}>
        <Card className="border-[#E2E8F0]">
          <h2 className="text-lg font-semibold text-[#0F172A]">{copy.appearance}</h2>
          <p className="mt-2 text-sm text-[#475569]">{copy.appearanceText}</p>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.09}>
        <Card className="border-[#E2E8F0]">
          <h2 className="text-lg font-semibold text-[#0F172A]">{copy.workspace}</h2>
          <p className="mt-2 text-sm text-[#475569]">{copy.workspaceText}</p>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <a className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-[#475569] hover:border-[#0F4C81] hover:text-[#0F4C81] transition-colors" href="/history">
              {copy.history}
            </a>
            <a
              className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-[#475569] hover:border-[#0F4C81] hover:text-[#0F4C81] transition-colors"
              href="/voice-profile"
            >
              {copy.voiceProfile}
            </a>
            <a className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-[#475569] hover:border-[#0F4C81] hover:text-[#0F4C81] transition-colors" href="/pricing">
              {copy.pricing}
            </a>
          </div>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Card className="border border-red-200 bg-red-50">
          <h2 className="text-lg font-semibold text-red-700">{copy.dataControls}</h2>
          <p className="mt-2 text-sm text-red-600">{copy.dataControlsText}</p>
        </Card>
      </ScrollReveal>
    </div>
  )
}
