"use client"

import { useState } from "react"
import { FileText, Loader2 } from "lucide-react"

type ExportDocumentButtonProps = {
  label: string
  orderId: string
  type: "invoice" | "packing_list" | "manifest"
}

export default function ExportDocumentButton({ label, orderId, type }: ExportDocumentButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    // Artificial delay for sovereign manifest generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real system, this would fetch from a PDF generation endpoint
    // For now, we simulate success with a tactical placeholder download
    const content = `RBSL SOVEREIGN EXPORT DOCUMENT\nType: ${type.toUpperCase()}\nOrder: ${orderId}\nStatus: AUTHORIZED BY SYDNEY HUB\nDate: ${new Date().toISOString()}`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `rbsl_${type}_${orderId.slice(-6)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
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
