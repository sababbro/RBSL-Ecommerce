import { Container } from "@medusajs/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper" className="animate-in fade-in slide-in-from-bottom-4 duration-slow">
      <div className="hidden small:block">
        <div className="mb-12 border-b border-white/5 pb-8">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white italic" data-testid="welcome-message">
            Welcome, {customer?.first_name}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] text-silver/40 font-bold uppercase tracking-[0.3em]">
              Executive Procurement Dashboard
            </span>
            <div className="h-px w-8 bg-white/20" />
            <span className="text-[10px] text-white/60 font-medium uppercase tracking-widest" data-testid="customer-email">
              {customer?.email}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 transition-all hover:bg-white/[0.07]">
            <h3 className="text-silver/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Security Profile</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white italic leading-none" data-testid="customer-profile-completion">
                {getProfileCompletion(customer)}%
              </span>
              <span className="text-[10px] text-silver/60 font-bold uppercase tracking-widest mb-1">Authenticated</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 transition-all hover:bg-white/[0.07]">
            <h3 className="text-silver/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Logistics Points</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white italic leading-none" data-testid="addresses-count">
                {customer?.addresses?.length || 0}
              </span>
              <span className="text-[10px] text-silver/60 font-bold uppercase tracking-widest mb-1">Destinations Saved</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-8">
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-white text-[12px] font-black uppercase tracking-[0.2em]">Procurement History</h3>
              <LocalizedClientLink href="/account/orders" className="text-[9px] text-silver/40 hover:text-white transition-colors font-bold uppercase tracking-widest">
                View All Transactions
              </LocalizedClientLink>
           </div>
           
           <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
              {orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <li key={order.id} data-testid="order-wrapper">
                    <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-center group hover:bg-white/[0.07] hover:border-white/20 transition-all">
                        <div className="grid grid-cols-3 gap-x-12 flex-1">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-silver/30 font-bold uppercase tracking-widest">Date</span>
                            <span className="text-white text-xs font-bold uppercase tracking-widest">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-silver/30 font-bold uppercase tracking-widest">Ref ID</span>
                            <span className="text-white text-xs font-bold font-mono">
                              #{order.display_id}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-silver/30 font-bold uppercase tracking-widest">Value</span>
                            <span className="text-white text-xs font-bold">
                              {convertToLocale({
                                amount: order.total,
                                currency_code: order.currency_code,
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                           <ChevronDown className="-rotate-90 text-white" size={16} />
                        </div>
                      </div>
                    </LocalizedClientLink>
                  </li>
                ))
              ) : (
                <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl py-16 flex flex-col items-center justify-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-silver/20 group-hover:text-white transition-colors">
                    <Package size={24} />
                  </div>
                  <span className="text-[10px] text-silver/40 font-bold uppercase tracking-[0.3em] italic" data-testid="no-orders-message">
                     Ready for your first scientific procurement?
                  </span>
                  <LocalizedClientLink href="/store" className="mt-2 text-white border-b border-white hover:border-meximco-accent transition-all text-[9px] font-black uppercase tracking-widest">
                    Enter Procurement Hall
                  </LocalizedClientLink>
                </div>
              )}
           </ul>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
