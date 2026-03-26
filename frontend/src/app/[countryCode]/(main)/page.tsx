import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FlaskConical, ShieldCheck, Truck, Factory, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Royal Bengal Shrooms Limited (RBSL) | Institutional Fungi Processing",
  description:
    "RBSL is Bangladesh's industrial leader in standardized medicinal fungi extraction. Parent company of the Meximco Scientific Series.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  return (
    <main className="bg-black">
      <Hero />

      {/* Corporate Capabilities Section */}
      <section className="bg-black py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl">
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] mb-6">
                Institutional Capabilities
              </p>
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-[0.9]">
                Advanced Standardized<br />
                <span className="text-white/20 not-italic">Extraction Infrastructure.</span>
              </h2>
            </div>
            <LocalizedClientLink 
              href="/b2b" 
              className="group flex items-center gap-3 text-white/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest pb-2 border-b border-white/5 hover:border-white/20"
            >
              Institutional Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </LocalizedClientLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            <div className="bg-black p-10 group hover:bg-white/[0.02] transition-all">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Factory size={20} className="text-white/40" />
              </div>
              <h3 className="text-white text-lg font-black uppercase tracking-wider mb-4">Processing</h3>
              <p className="text-white/30 text-sm leading-relaxed font-medium">
                Our facilities operate under strictly controlled environmental parameters to ensure maximum metabolite retention during dehydration and extraction.
              </p>
            </div>
            <div className="bg-black p-10 group hover:bg-white/[0.02] transition-all border-x border-white/5">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} className="text-white/40" />
              </div>
              <h3 className="text-white text-lg font-black uppercase tracking-wider mb-4">Compliance</h3>
              <p className="text-white/30 text-sm leading-relaxed font-medium">
                Full-spectrum heavy metal and microbial screening performed on every batch. Adherence to EU and USP quality standards for bioactive compounds.
              </p>
            </div>
            <div className="bg-black p-10 group hover:bg-white/[0.02] transition-all">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Truck size={20} className="text-white/40" />
              </div>
              <h3 className="text-white text-lg font-black uppercase tracking-wider mb-4">Export Logistics</h3>
              <p className="text-white/30 text-sm leading-relaxed font-medium">
                Integrated cold-chain and standardized packaging systems designed for institutional procurement across Southeast Asia and the EU.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Alignment - Meximco Section */}
      <section className="bg-[#050505] py-32 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] mb-6">
              Featured Product Division
            </p>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 italic">
              Meximco<br />
              <span className="text-white/20 not-italic">Scientific Series.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-10 font-medium max-w-lg">
              RBSL's consumer-facing brand focusing on high-purity polysaccharide extracts and specialty gourmet mushrooms for medicinal use.
            </p>
            <div className="flex gap-4">
              <LocalizedClientLink
                href="/store"
                className="px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-white/90 transition-all"
              >
                View Catalog
              </LocalizedClientLink>
            </div>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] flex items-center justify-center">
             <FlaskConical size={80} className="text-white/5 opacity-20" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">Facility ID: RBSL-DH-01</span>
                <span className="text-white text-sm font-bold opacity-60 italic uppercase tracking-tighter">Dhaka Extraction & Processing Hub</span>
             </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 italic">
            Institutional Partnerships
          </h2>
          <p className="text-white/30 text-sm mb-10 leading-relaxed max-w-xl mx-auto font-medium">
            Contact RBSL's strategic division for bulk ingredient supply, 
            contract processing, and laboratory verification services.
          </p>
          <LocalizedClientLink
            href="/b2b"
            className="inline-flex px-10 py-4 border border-white/10 text-white/40 text-[11px] font-black uppercase tracking-[0.3em] rounded-lg hover:bg-white/5 hover:text-white hover:border-white/20 transition-all"
          >
            Contact Strategic Office
          </LocalizedClientLink>
        </div>
      </section>
    </main>
  )
}
