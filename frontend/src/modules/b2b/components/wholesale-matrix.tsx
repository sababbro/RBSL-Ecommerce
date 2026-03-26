"use client"

import React, { useState, useMemo, useEffect } from "react"
import { generateQuotePDF } from "@lib/util/generate-quote-pdf"
import { sdk } from "@lib/config"
import BulkUploadZone from "./bulk-upload-zone"
import { AlertCircle, AlertTriangle, Loader2 } from "lucide-react"
import { submitB2BPurchaseOrder } from "@lib/data/b2b-orders"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"

interface MatrixItem {
  id: string
  title: string
  sku: string
  price: number
  quantity: number
  inventory?: number | null
}

export default function WholesaleMatrix({ initialItems }: { initialItems: MatrixItem[] }) {
  const [items, setItems] = useState<MatrixItem[]>(initialItems)
  const [isVerified, setIsVerified] = useState(false)
  const [companyName, setCompanyName] = useState("RBSL Institutional Partner")
  const [bin, setBin] = useState<string | undefined>()
  const [tradeLicense, setTradeLicense] = useState<string | undefined>()
  const [warnings, setWarnings] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { countryCode } = useParams()

  useEffect(() => {
    sdk.client.fetch("/store/customers/me", { method: "GET" })
      .then((res: any) => {
        if (res.customer?.metadata?.is_verified) setIsVerified(true)
        if (res.customer?.metadata?.bin) setBin(res.customer.metadata.bin)
        if (res.customer?.metadata?.trade_license) setTradeLicense(res.customer.metadata.trade_license)
        setCompanyName(`${res.customer?.first_name} ${res.customer?.last_name}` || "RBSL Institutional Partner")
      })
      .catch(() => {})
  }, [])

  const handleQuantityChange = (id: string, qty: string) => {
    const val = parseInt(qty) || 0
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: val } : item))
  }

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  }, [items])

  const vat = useMemo(() => {
    return isVerified ? Math.floor(subtotal * 0.15) : 0
  }, [subtotal, isVerified])

  const grandTotal = subtotal + vat

  const handleUpload = (parsedData: { sku: string, quantity: number }[]) => {
    const newWarnings: string[] = []
    
    setItems(prev => {
        return prev.map(item => {
            const foundRow = parsedData.find(pd => pd.sku.toUpperCase() === item.sku.toUpperCase())
            if (foundRow) {
                return { ...item, quantity: foundRow.quantity }
            }
            return item
        })
    })

    const existingSkus = initialItems.map(i => i.sku.toUpperCase())
    parsedData.forEach(pd => {
        if (!existingSkus.includes(pd.sku.toUpperCase())) {
            newWarnings.push(`Institutional Alert: SKU ${pd.sku} not found in the Extraction Catalog.`)
        }
    })

    setWarnings(newWarnings)
  }

  const isStockOut = useMemo(() => {
    return items.some(item => item.inventory !== null && item.inventory !== undefined && item.quantity > item.inventory)
  }, [items])

  const handleGeneratePDF = () => {
    generateQuotePDF({
      items,
      subtotal,
      vat,
      total: grandTotal,
      companyName,
      bin,
      tradeLicense
    })
    toast.success("RBSL Record Synchronized", {
      style: {
        background: "#000",
        color: "#fff",
        borderRadius: "0",
        fontSize: "12px",
        fontWeight: "bold",
        letterSpacing: "1px",
        border: "1px solid rgba(255,255,255,0.2)"
      }
    })
  }

  const handleSubmitPO = async () => {
    if (isStockOut) return

    const orderItems = items
      .filter(i => i.quantity > 0)
      .map(i => ({ variantId: i.id, quantity: i.quantity }))

    if (orderItems.length === 0) {
      toast.error("Please add at least one scientific series item.")
      return
    }

    setIsSubmitting(true)
    try {
      await submitB2BPurchaseOrder(
        countryCode as string,
        orderItems,
        {
          bin,
          trade_license: tradeLicense,
          company_name: companyName,
          submission_subtotal: subtotal,
          submission_vat: vat
        }
      )
      toast.success("RBSL Record Synchronized", {
        style: {
          background: "#000",
          color: "#fff",
          borderRadius: "0",
          fontSize: "12px",
          fontWeight: "bold",
          letterSpacing: "1px",
          border: "1px solid rgba(255,255,255,0.2)"
        }
      })
    } catch (error) {
      console.error(error)
      toast.error("Process aborted. Sydney Hub sync failed.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      <BulkUploadZone onUpload={handleUpload} />

      {warnings.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl space-y-2">
              {warnings.map((w, idx) => (
                  <div key={idx} className="flex items-center text-red-500 text-[10px] font-black uppercase tracking-widest">
                      <AlertCircle className="w-3 h-3 mr-2" /> {w}
                  </div>
              ))}
          </div>
      )}

      {isStockOut && (
          <div className="bg-red-500 text-white p-4 text-center font-black uppercase tracking-[0.4em] text-xs">
              Current Batch Exhausted — Please reduce allocation quantity
          </div>
      )}

      <div className="bg-white/[0.03] rounded-2xl shadow-2xl border border-white/5 overflow-hidden backdrop-blur-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white text-black">
                <th className="p-6 font-black uppercase tracking-widest text-[10px]">Technical Specification</th>
                <th className="p-6 font-black uppercase tracking-widest text-[10px] text-right">Unit Rate (USD)</th>
                <th className="p-6 font-black uppercase tracking-widest text-[10px] text-center">Batch Qty</th>
                <th className="p-6 font-black uppercase tracking-widest text-[10px] text-right">Allocation Sum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
            {items.map((item) => {
              const stockLimitReached = item.inventory !== null && item.inventory !== undefined && item.quantity > item.inventory
              
              return (
                <tr key={item.id} className={`transition-all duration-300 ${stockLimitReached ? "bg-red-500/5" : "hover:bg-white/[0.02]"}`}>
                  <td className="p-6">
                    <div className="font-black uppercase tracking-widest text-white text-[11px] mb-1">{item.title}</div>
                    <div className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">{item.sku}</div>
                    {stockLimitReached && (
                        <div className="flex items-center text-[8px] text-red-500 font-black uppercase tracking-widest mt-2 border-t border-red-500/10 pt-2">
                            <AlertTriangle className="w-2 h-2 mr-1" /> Hub Stock Alert: {item.inventory} available
                        </div>
                    )}
                  </td>
                  <td className="p-6 text-right text-white/60 font-black italic tracking-tighter text-sm">
                    ${(item.price / 100).toFixed(2)}
                  </td>
                  <td className="p-6 text-center">
                    <input
                      type="number"
                      min="0"
                      value={item.quantity || ""}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      placeholder="0"
                      className={`w-24 p-3 text-center border focus:outline-none focus:ring-1 focus:ring-white transition-all font-black uppercase tracking-widest text-[10px] rounded-lg
                        ${stockLimitReached ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-black border-white/10 text-white"}`}
                    />
                  </td>
                  <td className="p-6 text-right font-black text-white italic tracking-tighter text-lg">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

        <div className="p-8 bg-white/[0.02] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-end border-t border-white/5">
          <div>
            <span className="text-[9px] text-white/20 block uppercase tracking-[0.3em] font-black mb-2">Internal Subtotal</span>
            <span className="text-2xl font-black text-white italic tracking-tighter leading-none">${(subtotal / 100).toLocaleString()}</span>
          </div>
          
          <div>
            <span className="text-[9px] text-white/20 block uppercase tracking-[0.3em] font-black mb-2">Compliance VAT (15%) - {isVerified ? "CERTIFIED" : "AUDIT_REQ"}</span>
            <span className="text-2xl font-black text-white italic tracking-tighter leading-none">${(vat / 100).toLocaleString()}</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/20 block uppercase tracking-[0.4em] font-black mb-3">Institutional Allocation Total</span>
            <span className="text-6xl font-black italic tracking-tighter text-white mb-8 border-b-2 border-white/5 pb-2">${(grandTotal / 100).toLocaleString()}</span>
            
            <div className="flex space-x-3 w-full">
                <button 
                  onClick={handleGeneratePDF}
                  disabled={isSubmitting}
                  className="flex-1 bg-transparent border border-white/20 text-white/60 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] hover:text-white hover:border-white transition-all disabled:opacity-50"
                >
                  Download PDF
                </button>
                <button 
                  onClick={handleSubmitPO}
                  disabled={isSubmitting}
                  className="flex-[2] bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center disabled:opacity-50 disabled:scale-100 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-3 animate-spin" />
                      Provisioning Sydney Hub...
                    </>
                  ) : (
                    "Authorize Purchase Order"
                  )}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
