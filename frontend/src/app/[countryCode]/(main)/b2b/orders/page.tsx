import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FileText, Clock, CheckCircle, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Procurement Orders | RBSL — Meximco B2B",
}

export default async function B2BOrdersPage() {
  let orders: any[] = []
  try {
    const { listOrders } = await import("@lib/data/orders")
    const result = await listOrders(20, 0).catch(() => [])
    orders = result ?? []
  } catch {
    orders = []
  }

  return (
    <div className="space-y-10 py-6">
      <div className="border-b border-white/5 pb-8">
        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em] mb-2">
          RBSL — Royal Bengal Shrooms Ltd.
        </p>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
          Procurement Orders
        </h1>
        <p className="text-white/40 text-sm mt-2">
          All B2B purchase orders and wholesale procurement history.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText className="w-12 h-12 text-white/10 mb-6" />
          <h2 className="text-2xl font-black text-white/20 uppercase italic tracking-tighter">
            No Orders Yet
          </h2>
          <p className="text-white/20 text-sm mt-3 max-w-sm">
            Your wholesale procurement orders will appear here once you submit through the Bulk Ordering system.
          </p>
          <LocalizedClientLink
            href="/b2b/bulk-order"
            className="mt-8 bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors"
          >
            Start Bulk Order
          </LocalizedClientLink>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="border border-white/5 rounded-2xl p-6 bg-white/[0.02] flex items-center justify-between gap-6 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="shrink-0">
                  {order.status === "completed" ? (
                    <CheckCircle className="w-6 h-6 text-white/40" />
                  ) : (
                    <Clock className="w-6 h-6 text-white/20" />
                  )}
                </div>
                <div>
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">
                    {order.display_id ? `#${order.display_id}` : order.id?.slice(0, 8)}
                  </p>
                  <p className="text-sm font-bold text-white">
                    {order.items?.length ?? 0} item(s) — ${((order.total || 0) / 100).toFixed(2)} USD
                  </p>
                  <p className="text-[10px] text-white/30 mt-1 capitalize">
                    {order.status} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <LocalizedClientLink
                href={`/account/orders/details/${order.id}`}
                className="flex items-center gap-2 text-[9px] text-white/30 font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                View <ArrowRight size={12} />
              </LocalizedClientLink>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
