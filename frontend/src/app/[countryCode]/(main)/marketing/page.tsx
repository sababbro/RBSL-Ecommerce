import Link from "next/link"
import { ShieldCheck, Database, Globe, ArrowRight, Layers, Cpu, Fingerprint } from "lucide-react"

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden font-sans">
      <style jsx global>{`
        @keyframes liquid {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .liquid-bg {
          background: linear-gradient(-45deg, #050505, #0a0a0a, #111, #050505);
          background-size: 400% 400%;
          animation: liquid 15s ease infinite;
        }
        .glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .text-gradient {
          background: linear-gradient(to bottom, #fff 0%, #666 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-10 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity grayscale"
          style={{ 
            backgroundImage: "url('/assets/marketing/hero-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/0 via-[#050505]/20 to-[#050505] z-10" />
        
        <div className="relative z-20 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/10 bg-white/5 mb-8 animate-fade-in">
            <ShieldCheck className="w-3 h-3 text-white/40" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-black">Institutional Authority Live</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] text-gradient">
            SOVEREIGN <br /> INTELLIGENCE.
          </h1>
          <p className="text-sm md:text-lg text-white/40 max-w-2xl mx-auto uppercase tracking-widest font-light leading-relaxed mb-12 italic">
            Hardened biological extraction protocols. Institutional capital settlement. <br /> 
            The Dhaka Unit is online.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
              href="/bd/b2b/login" 
              className="px-10 py-5 bg-white text-black text-[12px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white/90 transition-all transform hover:scale-105"
            >
              Initialize Procurement
            </Link>
            <button className="px-10 py-5 border border-white/10 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-all">
              Download Credentials
            </button>
          </div>
        </div>
      </section>

      {/* Dhaka Unit Showcase */}
      <section className="py-32 px-10 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 block">Central Ops</span>
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
              DHAKA UNIT <br /> <span className="text-white/20 italic">FACILITY ALPHA.</span>
            </h2>
            <div className="space-y-8">
              {[
                { title: "MICRO-FILTRATION", desc: "Proprietary Dhaka-based bio-refining at PH-9.2 levels.", icon: Cpu },
                { title: "QUANTUM INVENTORY", desc: "Real-time stock reservation for global B2B partners.", icon: Database },
                { title: "SOVEREIGN LOGISTICS", desc: "Direct export manifests authorized by the Dhaka Core.", icon: Globe }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                    <item.icon className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2">{item.title}</h3>
                    <p className="text-[11px] text-white/40 uppercase tracking-wide leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-1000" />
            <div className="relative glass aspect-square rounded-2xl overflow-hidden grayscale border border-white/10 shadow-2xl">
              <img 
                src="/assets/marketing/dhaka-unit.png" 
                alt="Dhaka Unit Facility" 
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
              />
            </div>
            <div className="absolute top-8 right-8 glass px-4 py-2 rounded-full border border-white/10">
               <span className="text-[9px] font-mono text-white/40 tracking-[0.2em] uppercase">STATUS: ACTIVE // 100% UPTIME</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Authority */}
      <section className="py-32 px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/[0.01] skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 block">Institutional Trust</span>
          <h2 className="text-6xl font-black uppercase tracking-tighter">THE SOVEREIGN SEAL.</h2>
          <p className="text-sm text-white/40 uppercase tracking-[0.2em] mt-6 max-w-2xl mx-auto italic">
            Automated legal authority. Timestamped transparency.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-12 rounded-3xl group hover:border-white/20 transition-all">
            <Fingerprint className="w-10 h-10 text-white/20 mb-8" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-4">Verification</h3>
            <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">
              Every MFS transaction is validated against the Dhaka Central Bank rail within 180 seconds.
            </p>
          </div>
          <div className="glass p-12 rounded-3xl bg-white/[0.04] border-white/10 group hover:border-white/20 transition-all scale-105 z-10">
            <Layers className="w-10 h-10 text-white/40 mb-8" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-4">Chain of Custody</h3>
            <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">
              An immutable audit trail tracks every gram of extract from allocation to digital seal application.
            </p>
            <div className="mt-8 pt-8 border-t border-white/5">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="text-[9px] font-mono text-white/40 uppercase">Allocation Confirmed</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 animate-pulse" />
                  <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest italics">Pending Sovereign Seal...</span>
               </div>
            </div>
          </div>
          <div className="glass p-12 rounded-3xl group hover:border-white/20 transition-all">
            <Globe className="w-10 h-10 text-white/20 mb-8" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-4">Global Reach</h3>
            <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">
              Wholesale manifests are pre-authorized for international gateway clearance.
            </p>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-32 px-10 bg-white text-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 mb-4 block">Product Tier</span>
            <h2 className="text-7xl font-black tracking-tighter leading-none m-0">SCIENTIFIC <br /> SERIES.</h2>
          </div>
          <p className="text-[12px] text-black/40 uppercase tracking-widest max-w-sm font-semibold italic">
             Biological integrity through micro-filtration. The gold standard for institutional researchers.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "S-01", name: "SHIITAKE", purity: "99.2%", target: "Cardiovascular" },
            { id: "N-02", name: "LION'S MANE", purity: "99.8%", target: "Neuro-Cognitive" },
            { id: "V-03", name: "REISHI", purity: "98.9%", target: "Immuno-Response" }
          ].map((item, i) => (
            <div key={i} className="group border border-black/5 p-12 hover:bg-black hover:text-white transition-all duration-500 cursor-pointer overflow-hidden relative">
              <span className="text-[40px] font-black text-black/5 group-hover:text-white/5 absolute -right-4 -top-4 tracking-tighter transition-colors">{item.id}</span>
              <div className="relative z-10">
                <h4 className="text-2xl font-black tracking-[0.2em] mb-12">{item.name}</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-black/10 group-hover:border-white/10 pb-2 transition-colors">
                    <span>Purity Score</span>
                    <span className="text-emerald-500">{item.purity}</span>
                  </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-black/10 group-hover:border-white/10 pb-2 transition-colors">
                    <span>Target Hub</span>
                    <span className="opacity-40">{item.target}</span>
                  </div>
                </div>
                <div className="mt-12 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">View Technical Specs <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-20 px-10 border-t border-white/5 text-center">
        <h3 className="text-4xl font-black uppercase tracking-tighter mb-12">THE TRANSITION BEGINS.</h3>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] mb-12 font-black leading-loose">
          RBSL INSTITUTIONAL × DHAKA EXTRACTION FACILITY <br />
          OPERATED BY MEXIMCO GROUP.
        </p>
        <Link 
          href="/bd/b2b/login" 
          className="text-white border-b-2 border-white/10 pb-2 text-xs font-black uppercase tracking-[0.4em] hover:border-white transition-all inline-flex items-center gap-4"
        >
          Secure Partner Access <ArrowRight className="w-4 h-4" />
        </Link>
      </footer>
    </div>
  )
}
