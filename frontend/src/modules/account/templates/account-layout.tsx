import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 bg-black min-h-screen py-12" data-testid="account-page">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 py-12">
          <aside>
            {customer && <AccountNav customer={customer} />}
          </aside>
          <div className="flex-1">
            {children}
          </div>
        </div>
        
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="max-w-sm">
            <h3 className="text-white text-xl font-black uppercase tracking-tighter italic mb-4">
              Procurement Support
            </h3>
            <span className="text-silver/50 text-sm leading-relaxed block">
              Direct assistance for bulk orders, quality certifications, and logistics coordination.
            </span>
          </div>
          <div className="shrink-0 group">
            <UnderlineLink href="/customer-service">
               <span className="text-white group-hover:text-meximco-accent transition-colors font-bold uppercase tracking-widest text-[10px]">
                Contact Procurement Desk
               </span>
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
