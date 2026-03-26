import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ShowcaseItems = [
  {
    label: "Scientific Extraction",
    stat: "β-Glucan Standardized",
    detail: "Pharmaceutical-grade processing",
  },
  {
    label: "Farm-to-Shelf Traceability",
    stat: "100% Chain of Custody",
    detail: "Certified origin documentation",
  },
  {
    label: "Export-Ready Compliance",
    stat: "Global Standards",
    detail: "EU, USP & Bangladesh BSTI certified",
  },
]

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-[80px] bg-black text-white overflow-hidden">
      {/* Subtle radial gradient bg */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full py-20">
        {/* Corporate Identifier */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] bg-white/[0.02] backdrop-blur-md mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          <span className="text-white/40 italic">RBSL Strategic Extraction Division</span>
        </div>

        {/* Corporate Headline */}
        <h1 className="text-[clamp(2.5rem,7vw,6.5rem)] font-black leading-[0.9] tracking-tighter mb-8 uppercase italic">
          Royal Bengal<br/>
          <span className="text-white/20 not-italic">Shrooms Limited.</span>
        </h1>

        {/* Mission Statement */}
        <p className="text-base text-white/30 max-w-lg leading-relaxed mb-12 font-medium">
          Bangladesh's premier biotechnology firm specializing in standardizing,
          stabilizing, and processing medicinal fungi for global pharmaceutical
          and nutraceutical markets.
        </p>

        {/* Global CTAs */}
        <div className="flex flex-wrap gap-4">
          <LocalizedClientLink
            href="/b2b"
            className="px-7 py-3.5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-white/90 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
          >
            Institutional Portal
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/store"
            className="px-7 py-3.5 border border-white/10 text-white/40 text-[11px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-white/5 hover:text-white hover:border-white/20 transition-all"
          >
            Product Portfolio
          </LocalizedClientLink>
        </div>
      </div>

      {/* Showcase Cards */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ShowcaseItems.map((item) => (
            <div
              key={item.label}
              className="border border-white/5 rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all"
            >
              <p className="text-xs text-white/20 font-bold uppercase tracking-widest mb-3">{item.label}</p>
              <p className="text-white font-black text-lg leading-tight">{item.stat}</p>
              <p className="text-white/30 text-xs mt-2 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
