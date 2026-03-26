"use client"

import { useState } from "react"
import { FileText, Loader2 } from "lucide-react"

import { generateInvoicePDF } from "@lib/util/generate-invoice-pdf"

type ExportDocumentButtonProps = {
  label: string
  order: any
  type: "invoice" | "packing_list" | "manifest"
}

export default function ExportDocumentButton({ label, order, type }: ExportDocumentButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (type === "invoice") {
      generateInvoicePDF({
        orderId: order.id,
        displayId: order.display_id || order.id.slice(-8).toUpperCase(),
        items: order.items.map((i: any) => ({
          title: i.title,
          sku: i.metadata?.sku || i.variant?.sku || "SCI-REF",
          price: i.unit_price,
          quantity: i.quantity
        })),
        subtotal: order.total,
        total: order.total,
        companyName: order.metadata?.company_name || "Institutional Partner",
        bin: order.metadata?.bin,
        isSettled: order.metadata?.settlement_status === "Local Settlement Verified",
        date: new Date().toLocaleDateString()
      })
    } else {
      // Simulate other types for now
      const content = `RBSL SOVEREIGN EXPORT DOCUMENT\nType: ${type.toUpperCase()}\nOrder: ${order.id}\nStatus: AUTHORIZED BY DHAKA UNIT\nDate: ${new Date().toISOString()}\nSovereign Seal: ENABLED`
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `rbsl_${type}_${order.id.slice(-6)}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
    
    setIsGenerating(false)
  }

  return (
    <button 
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex items-center justify-between p-4 bg-black border border-white/10 rounded-lg group hover:border-white/30 transition-all disabled:opacity-50 w-full"
    >
      <span className="text-[9px] font-black uppercase tracking-widest text-white">
        {isGenerating ? "Authorizing..." : label}
      </span>
      {isGenerating ? (
        <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
      ) : (
        <FileText className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
      )}
    </button>
  )
}
