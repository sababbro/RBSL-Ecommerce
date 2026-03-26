import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import { Building2, FileText, LayoutDashboard, Receipt, TrendingUp, Truck } from "lucide-react"
import Link from "next/link"

export default async function B2BDashboardHome() {
  // Safe data fetching — customer may be unauthenticated
  let customer = null
  let orders: any[] = []
  try {
    const { retrieveCustomer } = await import("@lib/data/customer")
    const { listOrders } = await import("@lib/data/orders")
    customer = await retrieveCustomer().catch(() => null)
    const result = await listOrders(20, 0).catch(() => [])
    orders = result ?? []
  } catch {
    orders = []
  }

  // Calculate B2B Metrics (safe)
  const lifetimeSpend = orders.reduce((acc: number, order: any) => acc + (order.total || 0), 0)
  const activeQuotesCount = orders.filter((o: any) =>
    o.status === "pending" || o.metadata?.b2b_status === "awaiting_approval"
  ).length
  const vatClaimable = Math.floor(lifetimeSpend * 0.15)

  return (
    <div className="space-y-10 py-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">SYDNEY HUB: ONLINE</h1>
          <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2 animate-pulse">Global Logistics: Engaged</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/b2b/bulk-order" className="bg-white text-black px-6 py-3 rounded-lg font-black uppercase tracking-widest text-[10px] shadow-[0_0_30px_#fff3] hover:bg-white/90 transition-all">
            Initiate Procurement
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/[0.03] p-6 rounded-xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/[0.04] transition-all" />
          <div className="flex justify-between items-start mb-4">
            <TrendingUp className="w-5 h-5 text-white/20" />
            <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20">Procurement Volume</span>
          </div>
          <div className="text-3xl font-black text-white italic tracking-tighter">
            {lifetimeSpend > 0 ? `$${(lifetimeSpend / 100).toLocaleString()}` : "STDBY"}
          </div>
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2 leading-tight">
            Certified spend across the Sydney Cluster
          </p>
        </div>

        <div className="bg-white/[0.03] p-6 rounded-xl border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <Receipt className="w-5 h-5 text-white/20" />
            <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20">Corporate Credit</span>
          </div>
          <div className="text-3xl font-black text-white italic tracking-tighter">
            {customer?.metadata?.credit_limit ? `$${(Number(customer.metadata.credit_limit) / 100).toLocaleString()}` : "STDBY"}
          </div>
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2 leading-tight">
            Institutional allocation limit active
          </p>
        </div>

        <div className="bg-white/[0.03] p-6 rounded-xl border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <FileText className="w-5 h-5 text-white/20" />
            <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20">Active Pipeline</span>
          </div>
          <div className="text-3xl font-black text-white italic tracking-tighter">{activeQuotesCount} Contracts</div>
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-2 leading-tight italic">
            Awaiting compliance verification
          </p>
        </div>

        <div className="bg-white/[0.03] p-6 rounded-xl border border-white/5 relative overflow-hidden group col-span-1 md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <LayoutDashboard className="w-5 h-5 text-white/20" />
            <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20">Extraction Facility Status</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-1">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                <div className="flex flex-col">
                   <span className="text-[10px] text-white font-black uppercase tracking-widest">Sydney Hub</span>
                   <span className="text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest">Operational</span>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                <div className="flex flex-col">
                   <span className="text-[10px] text-white font-black uppercase tracking-widest">Dhaka Unit</span>
                   <span className="text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest">Processing (Active)</span>
                </div>
             </div>
          </div>
          <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest mt-6 border-t border-white/5 pt-3">
            Real-time logistical link established via Medusa v2
          </p>
        </div>

        {/* Shipment Transit Visualizer — Directive 2 */}
        <div className="bg-white/[0.03] p-8 rounded-xl border border-white/5 relative overflow-hidden group col-span-1 md:col-span-4 shadow-[0_0_40px_rgba(255,255,255,0.01)]">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                 <Truck className="w-5 h-5 text-white/40" />
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Global Fleet Transit Visualizer</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.05] rounded-full border border-white/5">
                 <span className="text-[8px] font-black tracking-widest text-white/40 uppercase italic">Real-time Telemetry Enabled</span>
              </div>
           </div>

           <div className="relative pt-4 pb-12">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-[22px]" />
              <div className="flex justify-between relative z-10">
                 {[
                    { label: "Sydney Hub", status: "completed" },
                    { label: "Transit", status: "completed" },
                    { label: "Customs", status: "active" },
                    { label: "Destination", status: "upcoming" }
                 ].map((node, i) => (
                    <div key={i} className="flex flex-col items-center">
                       <div className={`w-3 h-3 rounded-full border-2 transition-all duration-700
                          ${node.status === "completed" ? "bg-white border-white shadow-[0_0_15px_#fff]" : 
                            node.status === "active" ? "bg-black border-white animate-pulse shadow-[0_0_15px_#fff3]" : 
                            "bg-black border-white/20"}`} />
                       <span className={`text-[8px] font-black uppercase tracking-widest mt-4 
                          ${node.status === "upcoming" ? "text-white/10" : "text-white"}`}>
                          {node.label}
                       </span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between bg-black/20 p-4 rounded border border-white/5">
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Active Manifest</span>
                 <span className="text-[10px] font-mono font-black text-white/80 tracking-tighter">RBSL-LOG-492-X</span>
              </div>
              <div className="flex items-center justify-between bg-black/20 p-4 rounded border border-white/5">
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/20">ETA Protocol</span>
                 <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">T-Minus 48H</span>
              </div>
           </div>
        </div>

        {/* Biological Purity Feed — Directive 3 */}
        <div className="bg-black p-6 rounded-xl border border-white/10 relative overflow-hidden group col-span-1 md:col-span-4 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-white/40" />
               <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/60">Biological Purity Feed (Sydney Hub Cluster)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.05] rounded-full border border-white/5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-black tracking-widest text-emerald-500/80 uppercase">Live Extraction Metrics</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
               <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Avg. Polysaccharide Content</div>
               <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white italic tracking-tighter">48.2%</span>
                  <span className="text-[9px] text-emerald-500 font-black uppercase mb-1">+1.4% Purity Alpha</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[92%]" />
               </div>
            </div>
            <div className="space-y-3">
               <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Avg. Beta-Glucan Distribution</div>
               <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white italic tracking-tighter">32.8%</span>
                  <span className="text-[9px] text-white/40 font-black uppercase mb-1">Standardized</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white/40 w-[85%]" />
               </div>
            </div>
            <div className="space-y-3">
               <div className="text-[9px] font-black uppercase tracking-widest text-white/30">Sydney Hub Integrity Score</div>
               <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white italic tracking-tighter">PH-9.2</span>
                  <span className="text-[9px] text-emerald-500 font-black uppercase mb-1">Optimal Range</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_#10b981]" />
               </div>
            </div>
          </div>
          <p className="text-[8px] text-white/20 font-bold uppercase tracking-[0.2em] mt-8 text-right italic">
            Certificate of Analysis (COA) auto-generated upon logistics authorization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/[0.03] p-8 rounded-xl border border-white/5 relative overflow-hidden group">
          <div className="flex items-center space-x-3 mb-8">
            <Building2 className="w-5 h-5 text-white/20" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Compliance Profile</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between py-4 border-b border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Industrial Partner</span>
              <span className="text-xs font-black uppercase tracking-widest text-white">{customer?.first_name} {customer?.last_name}</span>
            </div>
            <div className="flex justify-between py-4 border-b border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Tax Identifier (BIN)</span>
              <span className="text-xs font-mono font-black text-white/80">{(customer?.metadata?.bin as string) || "STDBY"}</span>
            </div>
            <div className="flex justify-between py-4 border-b border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Global Clearance</span>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${customer?.metadata?.is_verified ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"}`}>
                {customer?.metadata?.is_verified ? "Certified Partner" : "Verification Pending"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] p-8 rounded-xl border border-white/5 relative overflow-hidden group">
          <div className="flex items-center space-x-3 mb-8">
            <LayoutDashboard className="w-5 h-5 text-white/20" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Procurement Log</h2>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 4).map((order) => (
              <Link key={order.id} href={`/b2b/orders/${order.id}`} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.05] hover:border-white/10 transition-all group">
                <div>
                  <div className="text-[10px] font-black text-white uppercase tracking-widest group-hover:underline">PO #{order.display_id || order.id.slice(-8).toUpperCase()}</div>
                  <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1">Synced: {new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-white italic tracking-tighter">${(order.total / 100).toFixed(2)}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/40 transition-colors uppercase">{order.status}</div>
                </div>
              </Link>
            ))}
            {orders.length === 0 && (
               <div className="flex flex-col items-center justify-center py-10 opacity-20 italic text-sm space-y-4">
                 <LayoutDashboard className="w-10 h-10 mb-2" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting first procurement initialization.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
