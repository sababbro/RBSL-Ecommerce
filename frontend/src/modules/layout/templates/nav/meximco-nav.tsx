"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Menu, X, FlaskConical } from "lucide-react"
import { clx } from "@medusajs/ui"

const NavLinks = [
  { name: "Products", href: "/store" },
  { name: "Sovereign Intelligence", href: "/marketing" },
  { name: "Become a Partner", href: "/become-a-partner" },
  { name: "About", href: "/#about" },
]

export default function MeximcoNav({ 
  regions, 
  locales, 
  currentLocale,
  cartButton,
  sideMenu 
}: { 
  regions: any, 
  locales: any, 
  currentLocale: string | null,
  cartButton: React.ReactNode,
  sideMenu: React.ReactNode
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { countryCode } = useParams()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav 
      className={clx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled ? "h-16 bg-black/95 backdrop-blur-xl border-b border-white/8" : "h-20 bg-black/80 backdrop-blur-lg"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo - Corporate RBSL Identity */}
        <LocalizedClientLink href="/" className="flex items-center gap-3 z-[51] shrink-0 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
            <FlaskConical size={16} className="text-white/40 group-hover:text-white transition-all" />
          </div>
          <div className="flex flex-col justify-center leading-none">
            <span className="text-white text-base font-black tracking-[0.3em] uppercase leading-none">RBSL</span>
            <span className="text-[7px] text-white/20 font-black uppercase tracking-[0.2em] mt-0.5 leading-none">
              Royal Bengal Shrooms Ltd.
            </span>
          </div>
        </LocalizedClientLink>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-1">
          {NavLinks.map((link) => (
            <li key={link.name}>
              <LocalizedClientLink
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                {link.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>

        {/* Right Actions - Institutional Focus */}
        <div className="hidden lg:flex items-center gap-3">
          <LocalizedClientLink
            href="/b2b"
            className="px-4 py-2 border border-white/5 bg-white/[0.03] text-white/40 text-[10px] font-black uppercase tracking-[0.25em] rounded-lg hover:bg-white/5 hover:text-white hover:border-white/20 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            Institutional Portal
          </LocalizedClientLink>
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            {sideMenu}
            {cartButton}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-3">
          {cartButton}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white/70 p-2 z-[51] hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center gap-6 lg:hidden">
          {NavLinks.map((link) => (
            <LocalizedClientLink
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-xl font-black text-white uppercase tracking-[0.2em]"
            >
              {link.name}
            </LocalizedClientLink>
          ))}
          <LocalizedClientLink
            href="/b2b"
            onClick={() => setIsMenuOpen(false)}
            className="mt-4 px-8 py-3 border border-white/20 text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all"
          >
            B2B Portal
          </LocalizedClientLink>
          <div className="mt-6 pt-6 border-t border-white/10 w-48 flex justify-center">
            {sideMenu}
          </div>
        </div>
      )}
    </nav>
  )
}
