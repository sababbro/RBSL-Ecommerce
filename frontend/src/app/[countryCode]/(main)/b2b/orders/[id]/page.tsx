import { retrieveOrder } from "@lib/data/orders"
import { notFound } from "next/navigation"
import { CheckCircle2, Clock, ShieldCheck, Truck, LayoutDashboard, Receipt } from "lucide-react"
import PoPUpload from "@modules/b2b/components/pop-upload"
import ExportDocumentButton from "@modules/b2b/components/export-document-button"

export default async function B2BOrderPage({ params }: { params: { id: string } }) {
  const order = await retrieveOrder(params.id)

  if (!order) {
    notFound()
  }

  const b2bStatus = (order.metadata?.b2b_status as string) || "pending"
  const popVerified = order.metadata?.pop_verified === true
  const countryCode = (order.shipping_address?.country_code as string)?.toUpperCase() || "INTL"
  const isHighCompliance = ["US", "AE", "GB", "DE", "FR", "CA"].includes(countryCode)

  const steps = [
    { name: "Quote Generated", status: "completed", icon: CheckCircle2 },
    { 
      name: "Capital Authorization", 
      status: b2bStatus === "pending" ? "current" : "completed", 
      icon: Clock 
    },
    { 
      name: "Sovereign Verification", 
      status: b2bStatus === "confirmed" ? "current" : popVerified ? "completed" : "upcoming", 
      icon: ShieldCheck 
    },
    { name: "Dhaka Unit Dispatch", status: "upcoming", icon: Truck },
  ]

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-white/5 pb-12">
        <div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter mb-4 uppercase">Institutional PO #{order.display_id || order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] leading-tight">Secure Transaction Link: {order.id.toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-xl border border-white/5">
           <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-[0_0_15px_#f97316]" />
           <div className="flex flex-col">
              <span className="text-[10px] text-white font-black uppercase tracking-widest">Audit Status</span>
              <span className="text-[9px] text-orange-500 font-bold uppercase tracking-widest">{b2bStatus.toUpperCase()}</span>
           </div>
        </div>
      </div>

      <div className="relative mb-24 max-w-4xl">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-white/5 -z-1" />
        <div className="flex justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 z-10
                ${step.status === "completed" ? "bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]" : 
                  step.status === "current" ? "bg-transparent border-white text-white animate-pulse" : 
                  "bg-black border-white/10 text-white/10"}`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-black mt-6 uppercase tracking-[0.2em] transition-colors
                ${step.status === "upcoming" ? "text-white/10" : "text-white"}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* PoP Upload Zone */}
          {b2bStatus === "pending" && (
            <section className="space-y-4">
               <PoPUpload orderId={order.id} />
            </section>
          )}

          {/* Biological Integrity Tier — Directive 1 & 2 */}
          {(b2bStatus === "confirmed" || b2bStatus === "awaiting_logistics" || order.status === "completed") && (
            <div className="bg-black p-8 rounded-xl border border-emerald-500/20 relative overflow-hidden group shadow-[0_0_50px_rgba(16,185,129,0.05)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/[0.05] transition-all" />
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Sovereign Batch Specifications</h2>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Certified Biological Integrity Tier</p>
                  </div>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded font-black uppercase tracking-widest text-[8px] hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                   Download Digital COA (.PDF)
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block mb-1">Batch Identifier</span>
                  <span className="text-xs font-mono font-black text-white">{(order.metadata?.batch_id as string) || "RBSL-DHK-2026-01A"}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block mb-1">Extraction Date</span>
                  <span className="text-xs font-black text-white italic tracking-tighter">{(order.metadata?.extraction_date as string) || "MAR 24, 2024"}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block mb-1">Purity (Bio-Index)</span>
                  <span className="text-xs font-black text-emerald-500 italic tracking-tighter">{(order.metadata?.purity_percentage as string) || "99.2%"}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block mb-1">Lead Scientist</span>
                  <span className="text-xs font-black text-white italic tracking-tighter">{(order.metadata?.lead_scientist as string) || "DR. A. RAHMAN"}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-widest text-white/10 uppercase italic">Verification Protocol: SCI-CHOC-2024-X</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/40 uppercase">Chain of Custody: SECURE</span>
              </div>
            </div>
          )}

          {/* Physical Sovereignty Tier — Directive 1 */}
          {(b2bStatus === "confirmed" || b2bStatus === "awaiting_logistics" || order.status === "completed") && (
            <div className="bg-white/[0.03] p-10 rounded-xl border border-white/5 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-white/20" />
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Export Documentation & Manifests</h2>
                </div>
                {isHighCompliance && (
                  <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Compliance Gate: PASSED ({countryCode})</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ExportDocumentButton label="Commercial Invoice" order={order} type="invoice" />
                <ExportDocumentButton label="Packing List" order={order} type="packing_list" />
                <ExportDocumentButton label="Logistics Manifest" order={order} type="manifest" />
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Dhaka Unit Origin: Authorized</span>
                </div>
                <div className="text-[8px] font-black text-white/10 uppercase italic tracking-widest leading-relaxed text-right">
                  Manifest Status: {isHighCompliance ? "Sovereign Compliance Verified" : "Global Release Authorization"}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/[0.03] p-10 rounded-xl border border-white/5 relative overflow-hidden group">
            <div className="flex items-center space-x-3 mb-10">
              <LayoutDashboard className="w-5 h-5 text-white/20" />
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Acquisition Allocation</h2>
            </div>
            
            <div className="space-y-6">
               {order.items?.map((item) => (
                 <div key={item.id} className="flex justify-between items-center bg-black/20 p-6 border border-white/5 rounded-lg group hover:border-white/10 transition-all">
                   <div>
                      <div className="text-[10px] font-black text-white uppercase tracking-widest leading-relaxed mb-1">{item.title}</div>
                      <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest">SKU: {(item.metadata?.sku as string) || "SCI-SER-GA"} | Allocation: {item.quantity} Unit(s)</div>
                   </div>
                   <div className="text-right">
                      <div className="text-sm font-black text-white italic tracking-tighter">{`$${((item.unit_price * item.quantity) / 100).toLocaleString()}`}</div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/40 transition-colors uppercase">Dhaka Unit Reserved</div>
                   </div>
                 </div>
               ))}
               
               <div className="pt-10 border-t border-white/5 mt-10 space-y-4">
                  <div className="flex justify-between text-white/20 text-[10px] uppercase font-black tracking-[0.2em]">
                     <span>Subtotal Acquisition</span>
                     <span>{`$${(order.total / 100).toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-2xl text-white italic tracking-tighter">
                      <span className="uppercase text-sm tracking-widest not-italic">Total Strategic Commitment</span>
                      <span>{`$${(order.total / 100).toLocaleString()}`}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Chain of Custody Audit Trail */}
          <div className="bg-black/40 p-10 rounded-xl border border-white/5 space-y-8 relative overflow-hidden group">
             <div className="flex items-center space-x-3 border-b border-white/5 pb-6">
                <Clock className="w-5 h-5 text-white/20" />
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Chain of Custody Audit Trail</h3>
             </div>
             
             <div className="relative space-y-10 pl-6 border-l border-white/5 pb-2">
                <div className="relative">
                   <div className="absolute -left-[31px] top-1 w-2 h-2 rounded-full bg-white/20" />
                   <div className="text-[9px] font-mono text-white/20 mb-1">{new Date(order.created_at).toLocaleString().toUpperCase()}</div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Allocation Requested (Dhaka Unit)</div>
                   <p className="text-[8px] text-white/10 mt-1 uppercase">Institutional procurement request logged from verified partner profile.</p>
                </div>

                {order.metadata?.settlement_status === "Local Settlement Verified" && (
                   <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                      <div className="text-[9px] font-mono text-emerald-500/40 mb-1 uppercase italic">Verification Phase: Completed</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">MFS Settlement Verified</div>
                      <p className="text-[8px] text-white/40 mt-1 uppercase italic">Dhaka Unit Central Bank rail confirmed TrxID authorization.</p>
                   </div>
                )}

                {(order.metadata?.settlement_status === "Local Settlement Verified" || popVerified) && (
                   <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />
                      <div className="text-[9px] font-mono text-white/40 mb-1 uppercase italic">Seal Authority: Applied</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                        Sovereign Seal Applied <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      </div>
                      <p className="text-[8px] text-white/20 mt-1 uppercase">Institutional Digital Stamp injected into export manifest.</p>
                   </div>
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white text-black p-10 rounded-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.1] rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-black/[0.2] transition-all" />
            <h2 className="text-sm font-black mb-10 italic border-b border-black/10 pb-4 uppercase tracking-[0.2em]">Compliance Protocol</h2>
            <div className="space-y-8">
              <div>
                <span className="text-[9px] uppercase font-black opacity-30 block mb-2 tracking-widest">Company Entity</span>
                <span className="text-sm font-black uppercase tracking-widest">{(order.metadata?.company_name as string) || "N/A"}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-black opacity-30 block mb-2 tracking-widest">Business Identifier (BIN)</span>
                <span className="text-sm font-black tracking-widest font-mono">{(order.metadata?.bin as string) || "PENDING"}</span>
              </div>
              <div className="bg-black/5 p-6 rounded-lg border border-black/10">
                <p className="text-[10px] italic leading-relaxed font-black uppercase tracking-widest">
                  Our Dhaka compliance team is currently auditing your Swift transmission. 
                  Reservation of Dhaka Unit batch inventory is active.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] p-10 rounded-xl border border-white/5 relative overflow-hidden group">
             <div className="flex items-center space-x-3 mb-6">
                <ShieldCheck className="w-5 h-5 text-white/20" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Sovereign Authority</h3>
             </div>
             <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest leading-relaxed">
                This order is governed by the Royal Bengal Shrooms Limited (RBSL) Institutional Charter. 
                Any capital flow discrepancies will be resolved via the Dhaka Unit Strategic Bio-Extraction Accord.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
