"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, Trash2, CheckCircle, AlertCircle, Loader2, UserCircle } from "lucide-react"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

export default function KundeEinstellungenPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setName(user.user_metadata?.name || "")
        setPhone(user.user_metadata?.phone || "")
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const saveProfile = async () => {
    setProfileSaving(true)
    setProfileMessage(null)
    const { error } = await supabase.auth.updateUser({ data: { name, phone } })
    if (error) {
      setProfileMessage({ type: "error", text: "Fehler beim Speichern: " + error.message })
    } else {
      setProfileMessage({ type: "success", text: "Profil erfolgreich aktualisiert." })
    }
    setProfileSaving(false)
  }

  const changePassword = async () => {
    setPasswordSaving(true)
    setPasswordMessage(null)
    if (newPassword.length < 8) { setPasswordMessage({ type: "error", text: "Das Passwort muss mindestens 8 Zeichen lang sein." }); setPasswordSaving(false); return }
    if (newPassword !== confirmPassword) { setPasswordMessage({ type: "error", text: "Die Passwörter stimmen nicht überein." }); setPasswordSaving(false); return }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordMessage({ type: "error", text: "Fehler: " + error.message })
    } else {
      setPasswordMessage({ type: "success", text: "Passwort erfolgreich geändert." })
      setNewPassword("")
      setConfirmPassword("")
    }
    setPasswordSaving(false)
  }

  const deleteAccount = async () => {
    if (deleteConfirm !== "LÖSCHEN") return
    setDeleting(true)
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) return null

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Einstellungen</h1>
        <p className="text-muted-foreground mt-1">Verwalten Sie Ihr Kundenkonto</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><User className="h-5 w-5 text-primary" /></div>
            <div>
              <CardTitle>Persönliche Daten</CardTitle>
              <CardDescription>Aktualisieren Sie Ihren Namen und Kontaktdaten</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Die E-Mail-Adresse kann nicht geändert werden.</p>
          </div>
          <div className="space-y-2">
            <Label>Kontotyp</Label>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <UserCircle className="h-3 w-3" />
                Kundenkonto
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ihr vollständiger Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49 123 456789" type="tel" />
          </div>
          {profileMessage && (
            <Alert variant={profileMessage.type === "error" ? "destructive" : "default"}>
              {profileMessage.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{profileMessage.text}</AlertDescription>
            </Alert>
          )}
          <Button onClick={saveProfile} disabled={profileSaving}>
            {profileSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Speichern
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg"><Lock className="h-5 w-5 text-amber-500" /></div>
            <div>
              <CardTitle>Passwort ändern</CardTitle>
              <CardDescription>Aktualisieren Sie Ihr Anmeldepasswort</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Neues Passwort</Label>
            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mindestens 8 Zeichen" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Passwort bestätigen</Label>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Passwort wiederholen" />
          </div>
          {passwordMessage && (
            <Alert variant={passwordMessage.type === "error" ? "destructive" : "default"}>
              {passwordMessage.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{passwordMessage.text}</AlertDescription>
            </Alert>
          )}
          <Button onClick={changePassword} disabled={passwordSaving || !newPassword || !confirmPassword}>
            {passwordSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Passwort ändern
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg"><Trash2 className="h-5 w-5 text-red-500" /></div>
            <div>
              <CardTitle className="text-red-600">Konto löschen</CardTitle>
              <CardDescription>Diese Aktion kann nicht rückgängig gemacht werden.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent">
                <Trash2 className="h-4 w-4 mr-2" />Konto löschen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Konto wirklich löschen?</DialogTitle>
                <DialogDescription>Alle Ihre persönlichen Daten und Anfragen werden dauerhaft gelöscht.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{"Geben Sie LÖSCHEN ein, um zu bestätigen"}</Label>
                  <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="LÖSCHEN" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="bg-transparent" onClick={() => setDeleteDialogOpen(false)}>Abbrechen</Button>
                  <Button variant="destructive" disabled={deleteConfirm !== "LÖSCHEN" || deleting} onClick={deleteAccount}>
                    {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Konto endgültig löschen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
