"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut, Home, Building2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const { user, signOut, isLoading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-card shadow-md" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl md:text-2xl text-foreground">
          Gerüstbauer<span className="text-primary">24</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/geruestbau" className="text-foreground hover:text-primary transition-colors">
            Firmen
          </Link>
          <Link href="/ueber-uns" className="text-foreground hover:text-primary transition-colors">
            Über uns
          </Link>
          <Link href="/faq" className="text-foreground hover:text-primary transition-colors">
            FAQ
          </Link>
          <Link href="/kontakt" className="text-foreground hover:text-primary transition-colors">
            Kontakt
          </Link>

          <div className="flex items-center gap-2 min-w-[200px] justify-end">
            {isLoading ? (
              <div className="h-9 w-[200px]" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <User size={16} />
                    {user.name || "Konto"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={user.role === "owner" ? "/firma/dashboard" : "/kunde/dashboard"} className="cursor-pointer w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "owner" && (
                    <DropdownMenuItem asChild>
                      <Link href="/firma/dashboard/erstellen" className="cursor-pointer w-full">
                        Firma eintragen
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href={user.role === "owner" ? "/firma/dashboard/anfragen" : "/kunde/dashboard/anfragen"} className="cursor-pointer w-full">
                      Meine Anfragen
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={user.role === "owner" ? "/firma/dashboard/einstellungen" : "/kunde/dashboard/einstellungen"} className="cursor-pointer w-full">
                      Einstellungen
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/anmelden">
                  <Button variant="outline" className="bg-transparent">Anmelden</Button>
                </Link>
                <Link href="/auth/registrieren">
                  <Button>Registrieren</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden bg-transparent">
              <Menu />
              <span className="sr-only">Menü öffnen</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <Link href="/" className="flex items-center gap-2 py-2">
                <Home size={18} />
                Startseite
              </Link>
              <Link href="/geruestbau" className="flex items-center gap-2 py-2">
                <Building2 size={18} />
                Firmen
              </Link>
              <Link href="/ueber-uns" className="flex items-center gap-2 py-2">
                Über uns
              </Link>
              <Link href="/faq" className="flex items-center gap-2 py-2">
                FAQ
              </Link>
              <Link href="/kontakt" className="flex items-center gap-2 py-2">
                Kontakt
              </Link>

              {isLoading ? null : user ? (
                <>
                  <Link href={user.role === "owner" ? "/firma/dashboard" : "/kunde/dashboard"} className="flex items-center gap-2 py-2">
                    Dashboard
                  </Link>
                  {user.role === "owner" && (
                    <Link href="/firma/dashboard/erstellen" className="flex items-center gap-2 py-2">
                      <Building2 size={18} />
                      Firma eintragen
                    </Link>
                  )}
                  <Link href={user.role === "owner" ? "/firma/dashboard/anfragen" : "/kunde/dashboard/anfragen"} className="flex items-center gap-2 py-2">
                    Meine Anfragen
                  </Link>
                  <Link href={user.role === "owner" ? "/firma/dashboard/einstellungen" : "/kunde/dashboard/einstellungen"} className="flex items-center gap-2 py-2">
                    <User size={18} />
                    Einstellungen
                  </Link>
                  <Button variant="outline" className="flex items-center gap-2 mt-4 bg-transparent" onClick={signOut}>
                    <LogOut size={18} />
                    Abmelden
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-4">
                  <Link href="/auth/anmelden">
                    <Button variant="outline" className="w-full bg-transparent">
                      Anmelden
                    </Button>
                  </Link>
                  <Link href="/auth/registrieren">
                    <Button className="w-full">Registrieren</Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
