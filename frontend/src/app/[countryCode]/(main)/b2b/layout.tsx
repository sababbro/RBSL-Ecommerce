import { ReactNode } from "react"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function B2BLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-72 bg-white/[0.03] border-r border-white/5 flex flex-col p-8 shrink-0">
        {/* Brand Identity - Institutional Anchor */}
        <div className="mb-12">
          <LocalizedClientLink href="/" className="flex flex-col gap-1 group">
            <span className="text-white text-3xl font-black uppercase tracking-tighter italic leading-none mb-1 group-hover:text-white/90 transition-all">RBSL</span>
            <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] leading-none">
              Institutional
            </span>
            <span className="text-[9px] text-white/10 font-black uppercase tracking-[0.2em] mt-2 border-t border-white/5 pt-2">
              Strategic Extraction Division
            </span>
          </LocalizedClientLink>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          {[
            { label: "Institutional Overview", href: "/b2b" },
            { label: "Wholesale Matrix", href: "/b2b/wholesale" },
            { label: "Bulk Ordering", href: "/b2b/bulk-order" },
            { label: "Corporate Entity", href: "/b2b/company" },
            { label: "Procurement History", href: "/b2b/orders" },
          ].map(({ label, href }) => (
            <LocalizedClientLink
              key={href}
              href={href}
              className="px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.25em] text-white/30 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
            >
              {label}
            </LocalizedClientLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
          <LocalizedClientLink
            href="/store"
            className="text-[9px] text-white/20 font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            ← Exit to Consumer Division
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/account"
            className="text-[9px] text-white/20 font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            Administrative Account
          </LocalizedClientLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 bg-black">
        {children}
      </main>
    </div>
  )
}
