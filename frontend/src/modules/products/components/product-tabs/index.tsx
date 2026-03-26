"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const tabs = (product: HttpTypes.StoreProduct) => [
  {
    id: "info",
    label: "Product Information",
    component: <ProductInfoTab product={product} />,
  },
  {
    id: "shipping",
    label: "Shipping & Compliance",
    component: <ShippingInfoTab />,
  },
]

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [openTab, setOpenTab] = useState<string | null>(null)

  const tabList = tabs(product)

  return (
    <div className="w-full flex flex-col border-t border-white/5">
      {tabList.map((tab) => {
        const isOpen = openTab === tab.id
        return (
          <div key={tab.id} className="border-b border-white/5">
            <button
              onClick={() => setOpenTab(isOpen ? null : tab.id)}
              className="w-full flex items-center justify-between py-4 text-left group"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors">
                {tab.label}
              </span>
              <span
                className={`text-white/30 transition-transform duration-200 text-lg leading-none ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                ↓
              </span>
            </button>
            {isOpen && (
              <div className="pb-6">
                {tab.component}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {[
        { label: "Material", value: product.material },
        { label: "Origin", value: product.origin_country },
        { label: "Type", value: product.type?.value },
        { label: "Weight", value: product.weight ? `${product.weight} g` : null },
        {
          label: "Dimensions",
          value:
            product.length && product.width && product.height
              ? `${product.length}L × ${product.width}W × ${product.height}H`
              : null,
        },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-1">
          <span className="text-[9px] text-white/25 font-black uppercase tracking-[0.3em]">{label}</span>
          <span className="text-[11px] text-white/70 font-medium">{value ?? "—"}</span>
        </div>
      ))}
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/30">
          <FastDelivery />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-1">Express Dispatch</p>
          <p className="text-[11px] text-white/40 leading-relaxed">
            Orders ship within 2 business days. Estimated delivery 5–10 days internationally.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/30">
          <Refresh />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-1">Quality Guarantee</p>
          <p className="text-[11px] text-white/40 leading-relaxed">
            Product quality guaranteed. Exchange or full refund on verified lab-grade discrepancies.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/30">
          <Back />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-1">B2B Return Policy</p>
          <p className="text-[11px] text-white/40 leading-relaxed">
            Verified B2B partners receive 30-day return windows. Certificate of compliance provided on all shipments.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
