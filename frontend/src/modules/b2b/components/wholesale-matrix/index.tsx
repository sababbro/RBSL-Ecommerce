"use client"

import { useState, useCallback } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Tier = {
  minQty: number
  maxQty: number | null
  pricePerUnit: number
  label: string
}

type ProductRow = {
  id: string
  sku: string
  name: string
  unit: string
  currency: string
  tiers: Tier[]
}

const defaultProducts: ProductRow[] = [
  {
    id: "mex-001",
    sku: "SCM-PS-10",
    name: "Scientific Series — Polysaccharide Extract 10%",
    unit: "kg",
    currency: "USD",
    tiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 48.0, label: "RETAIL" },
      { minQty: 10, maxQty: 49, pricePerUnit: 40.0, label: "STANDARD" },
      { minQty: 50, maxQty: 199, pricePerUnit: 33.0, label: "VOLUME" },
      { minQty: 200, maxQty: null, pricePerUnit: 27.0, label: "CONTRACT" },
    ],
  },
  {
    id: "mex-002",
    sku: "SCM-PS-30",
    name: "Scientific Series — Polysaccharide Extract 30%",
    unit: "kg",
    currency: "USD",
    tiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 76.0, label: "RETAIL" },
      { minQty: 10, maxQty: 49, pricePerUnit: 64.0, label: "STANDARD" },
      { minQty: 50, maxQty: 199, pricePerUnit: 52.0, label: "VOLUME" },
      { minQty: 200, maxQty: null, pricePerUnit: 43.0, label: "CONTRACT" },
    ],
  },
  {
    id: "mex-003",
    sku: "SCM-MYC-BLK",
    name: "Premium Mycelium Block — Fruiting Grade",
    unit: "block",
    currency: "USD",
    tiers: [
      { minQty: 1, maxQty: 9, pricePerUnit: 12.0, label: "RETAIL" },
      { minQty: 10, maxQty: 99, pricePerUnit: 9.5, label: "STANDARD" },
      { minQty: 100, maxQty: 499, pricePerUnit: 7.8, label: "VOLUME" },
      { minQty: 500, maxQty: null, pricePerUnit: 6.2, label: "CONTRACT" },
    ],
  },
]

type RowState = { qty: number }

const TIER_ACCENT: Record<string, string> = {
  RETAIL: "text-white/40",
  STANDARD: "text-white/60",
  VOLUME: "text-white/80",
  CONTRACT: "text-white",
}

export default function WholesaleMatrix() {
  const [rows, setRows] = useState<Record<string, RowState>>(
    Object.fromEntries(defaultProducts.map((p) => [p.id, { qty: 0 }]))
  )
  const [csvInput, setCsvInput] = useState("")
  const [csvError, setCsvError] = useState("")

  const getActiveTier = useCallback((product: ProductRow, qty: number): Tier => {
    const sorted = [...product.tiers].sort((a, b) => b.minQty - a.minQty)
    return sorted.find((t) => qty >= t.minQty) ?? product.tiers[0]
  }, [])

  const lineTotal = (product: ProductRow, qty: number) => {
    if (qty === 0) return 0
    const tier = getActiveTier(product, qty)
    return tier.pricePerUnit * qty
  }

  const grandTotal = defaultProducts.reduce(
    (acc, p) => acc + lineTotal(p, rows[p.id]?.qty ?? 0),
    0
  )

  const updateQty = (id: string, val: string) => {
    const n = Math.max(0, parseInt(val) || 0)
    setRows((prev) => ({ ...prev, [id]: { qty: n } }))
  }

  const handleCsvImport = () => {
    setCsvError("")
    const lines = csvInput.trim().split("\n")
    const updates: Record<string, RowState> = { ...rows }
    let hasError = false
    lines.forEach((line) => {
      const [sku, qtyStr] = line.split(",").map((s) => s.trim())
      const product = defaultProducts.find((p) => p.sku === sku)
      if (!product) {
        setCsvError(`Unknown SKU: ${sku}`)
        hasError = true
        return
      }
      const qty = Math.max(0, parseInt(qtyStr) || 0)
      updates[product.id] = { qty }
    })
    if (!hasError) {
      setRows(updates)
      setCsvInput("")
    }
  }

  const handleReset = () => {
    setRows(Object.fromEntries(defaultProducts.map((p) => [p.id, { qty: 0 }])))
    setCsvInput("")
    setCsvError("")
  }

  return (
    <section className="bg-[#000000] min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16 border-b border-[#FDFCF8]/10 pb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] text-[#FDFCF8]/30 font-black uppercase tracking-[0.4em] mb-3">
                RBSL — Royal Bengal Shrooms Ltd. | Meximco™ Wholesale
              </p>
              <h1 className="text-6xl font-black uppercase tracking-tighter text-[#FDFCF8] italic leading-none">
                Procurement
                <br />
                <span className="text-[#FDFCF8]/20">Price Matrix</span>
              </h1>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-[9px] text-[#FDFCF8]/30 font-bold uppercase tracking-widest">Verified B2B Account</p>
              <p className="text-[10px] text-[#FDFCF8]/60 font-mono mt-1">Prices excl. VAT</p>
            </div>
          </div>
        </div>

        {/* CSV Import */}
        <div className="mb-10 border border-[#FDFCF8]/10 rounded-2xl p-6 bg-[#FDFCF8]/[0.02]">
          <p className="text-[9px] text-[#FDFCF8]/30 font-black uppercase tracking-[0.3em] mb-4">
            Bulk Import via CSV (SKU, Quantity)
          </p>
          <div className="flex gap-4 items-start">
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder={"SCM-PS-10, 50\nSCM-PS-30, 20\nSCM-MYC-BLK, 100"}
              className="flex-1 bg-[#FDFCF8]/5 border border-[#FDFCF8]/10 rounded-xl px-4 py-3 text-[#FDFCF8] text-xs font-mono placeholder-[#FDFCF8]/20 focus:outline-none focus:border-[#FDFCF8]/30 resize-none h-20"
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCsvImport}
                className="bg-[#FDFCF8] text-black px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#FDFCF8]/90 transition-colors"
              >
                Import
              </button>
              <button
                onClick={handleReset}
                className="border border-[#FDFCF8]/20 text-[#FDFCF8]/60 px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl hover:border-[#FDFCF8]/40 hover:text-[#FDFCF8] transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          {csvError && (
            <p className="mt-2 text-red-400 text-[10px] font-bold">{csvError}</p>
          )}
        </div>

        {/* Product Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="border-b border-[#FDFCF8]/10">
                <th className="text-left py-4 pr-6 text-[9px] text-[#FDFCF8]/30 font-black uppercase tracking-[0.3em] w-1/3">
                  Product / SKU
                </th>
                <th className="text-center py-4 px-4 text-[9px] text-[#FDFCF8]/30 font-black uppercase tracking-[0.3em]">
                  Retail<br /><span className="text-[8px] font-medium normal-case tracking-normal opacity-50">1–9 units</span>
                </th>
                <th className="text-center py-4 px-4 text-[9px] text-[#FDFCF8]/30 font-black uppercase tracking-[0.3em]">
                  Standard<br /><span className="text-[8px] font-medium normal-case tracking-normal opacity-50">10–49 units</span>
                </th>
                <th className="text-center py-4 px-4 text-[9px] text-[#FDFCF8]/30 font-black uppercase tracking-[0.3em]">
                  Volume<br /><span className="text-[8px] font-medium normal-case tracking-normal opacity-50">50–199 units</span>
                </th>
                <th className="text-center py-4 px-4 text-[9px] text-[#FDFCF8]/30 font-black uppercase tracking-[0.3em]">
                  Contract<br /><span className="text-[8px] font-medium normal-case tracking-normal opacity-50">200+ units</span>
                </th>
                <th className="text-center py-4 px-4 text-[9px] text-[#FDFCF8]/30 font-black uppercase tracking-[0.3em]">
                  Qty
                </th>
                <th className="text-right py-4 pl-6 text-[9px] text-[#FDFCF8]/30 font-black uppercase tracking-[0.3em]">
                  Line Total
                </th>
              </tr>
            </thead>

            <tbody>
              {defaultProducts.map((product) => {
                const qty = rows[product.id]?.qty ?? 0
                const activeTier = getActiveTier(product, qty)
                const total = lineTotal(product, qty)

                return (
                  <tr
                    key={product.id}
                    className="border-b border-[#FDFCF8]/5 group hover:bg-[#FDFCF8]/[0.02] transition-colors"
                  >
                    {/* Product name */}
                    <td className="py-6 pr-6">
                      <p className="text-[10px] font-mono text-[#FDFCF8]/30 mb-1">{product.sku}</p>
                      <p className="text-sm font-bold text-[#FDFCF8] leading-snug">{product.name}</p>
                      <p className="text-[9px] text-[#FDFCF8]/20 uppercase tracking-widest mt-1">Per {product.unit}</p>
                    </td>

                    {/* Tier prices */}
                    {product.tiers.map((tier) => {
                      const isActive = activeTier.label === tier.label && qty > 0
                      return (
                        <td key={tier.label} className="py-6 px-4 text-center">
                          <div
                            className={`transition-all ${
                              isActive
                                ? "bg-[#FDFCF8]/10 border border-[#FDFCF8]/30 rounded-xl py-2 px-3"
                                : "py-2 px-3"
                            }`}
                          >
                            <span className={`text-sm font-black tabular-nums ${TIER_ACCENT[tier.label]}`}>
                              ${tier.pricePerUnit.toFixed(2)}
                            </span>
                          </div>
                        </td>
                      )
                    })}

                    {/* Qty Input */}
                    <td className="py-6 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        value={qty === 0 ? "" : qty}
                        onChange={(e) => updateQty(product.id, e.target.value)}
                        placeholder="0"
                        className="w-20 bg-[#FDFCF8]/5 border border-[#FDFCF8]/10 rounded-xl px-3 py-2 text-[#FDFCF8] text-sm font-bold text-center font-mono focus:outline-none focus:border-[#FDFCF8]/40 hover:border-[#FDFCF8]/20 transition-colors"
                      />
                    </td>

                    {/* Line Total */}
                    <td className="py-6 pl-6 text-right">
                      {qty > 0 ? (
                        <span className="text-sm font-black text-[#FDFCF8] tabular-nums">
                          ${total.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[#FDFCF8]/10 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Grand Total */}
        <div className="mt-16 border-t border-[#FDFCF8]/10 pt-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <p className="text-[9px] text-[#FDFCF8]/30 font-black uppercase tracking-[0.4em] mb-2">
                Estimated Order Value
              </p>
              <div className="flex items-end gap-4">
                <span className="text-7xl font-black text-[#FDFCF8] italic leading-none tracking-tighter tabular-nums">
                  ${grandTotal.toFixed(2)}
                </span>
                <span className="text-[#FDFCF8]/30 text-sm font-bold uppercase tracking-widest mb-2">USD</span>
              </div>
              <p className="text-[9px] text-[#FDFCF8]/20 mt-3 uppercase tracking-widest">
                Exclusive of taxes and shipping. Subject to credit approval.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <LocalizedClientLink
                href="/account/b2b/quote-request"
                className="bg-[#FDFCF8] text-black px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-[#FDFCF8]/90 transition-colors text-center"
              >
                Request Official Quote
              </LocalizedClientLink>
              <button
                className="border border-[#FDFCF8]/20 text-[#FDFCF8]/60 px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:border-[#FDFCF8]/40 hover:text-[#FDFCF8] transition-colors"
              >
                Download Price List (PDF)
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
