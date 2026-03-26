import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import { Instagram, Linkedin, Mail, Phone, MapPin, FlaskConical } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })

  return (
    <footer className="bg-black text-silver border-t border-white/5 w-full pt-32 pb-12 transition-all duration-base">
      <div className="max-w-container mx-auto px-6 flex flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Section - Pure Corporate RBSL */}
          <div className="flex flex-col gap-8">
            <LocalizedClientLink href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
                <FlaskConical size={18} className="text-white/40 group-hover:text-white transition-all" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-lg font-black uppercase tracking-[0.4em] leading-none mb-1">RBSL</span>
                <span className="text-[7px] text-white/20 font-black uppercase tracking-[0.2em] leading-none">
                  Royal Bengal Shrooms Ltd.
                </span>
              </div>
            </LocalizedClientLink>
            <p className="text-[13px] leading-relaxed max-w-xs text-silver/50 font-medium">
              Bangladesh&apos;s premier mushroom processing and value-addition company. The mother company behind the Meximco brand.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-8">
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] pb-4 border-b border-white/5">Company</h4>
            <ul className="flex flex-col gap-4 text-[12px] font-bold uppercase tracking-widest text-silver/60">
               <li><LocalizedClientLink href="/store" className="hover:text-white transition-colors">All Products</LocalizedClientLink></li>
               <li><LocalizedClientLink href="/b2b" className="hover:text-white transition-colors">B2B Portal</LocalizedClientLink></li>
               <li><LocalizedClientLink href="/b2b/wholesale" className="hover:text-white transition-colors">Price Matrix</LocalizedClientLink></li>
               <li><LocalizedClientLink href="/#about" className="hover:text-white transition-colors">About RBSL</LocalizedClientLink></li>
            </ul>
          </div>

          {/* Scientific Series */}
          <div className="flex flex-col gap-8">
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] pb-4 border-b border-white/5">Scientific Series</h4>
            <ul className="flex flex-col gap-4 text-[12px] font-bold uppercase tracking-widest text-silver/60">
              <li><LocalizedClientLink href="/store" className="hover:text-white transition-colors">Polysaccharide Extract</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/store" className="hover:text-white transition-colors">Mycelium Blocks</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/store" className="hover:text-white transition-colors">Dried Shiitake</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/store" className="hover:text-white transition-colors">Lion&apos;s Mane Extract</LocalizedClientLink></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-8">
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.3em] pb-4 border-b border-white/5">Connect</h4>
            <ul className="flex flex-col gap-5 text-[12px] font-medium text-silver/60">
              <li className="flex gap-4 items-start">
                <MapPin size={18} className="text-white shrink-0" />
                <span className="leading-relaxed">JK Tower 31, Shegunbagicha,<br/>Ramna, Dhaka - 1000</span>
              </li>
              <li className="flex gap-4 items-center group">
                <Phone size={18} className="text-white shrink-0" />
                <a href="tel:+8801321147011" className="hover:text-white transition-colors font-bold">+880 1321 147 011</a>
              </li>
              <li className="flex gap-4 items-center group">
                <Mail size={18} className="text-white shrink-0" />
                <a href="mailto:contact@meximcoltd.com" className="hover:text-white transition-colors font-bold uppercase tracking-widest">contact@meximcoltd.com</a>
              </li>
            </ul>
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                <Instagram size={18} className="text-silver/60 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                <Linkedin size={18} className="text-silver/60 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-bold uppercase tracking-[0.3em] text-silver/30">
          <p>© {new Date().getFullYear()} Royal Bengal Shrooms Limited (RBSL). Meximco™ Brand.</p>
          <div className="flex gap-12">
            <LocalizedClientLink href="/privacy" className="hover:text-white transition-colors">Privacy Policy</LocalizedClientLink>
            <LocalizedClientLink href="/terms" className="hover:text-white transition-colors">Terms of Service</LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
