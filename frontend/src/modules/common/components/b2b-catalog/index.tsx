"use client"

import React, { useState, useEffect } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { sdk } from "@lib/config"
import B2BCatalogPDF from "./pdf-document"
import { Button } from "@medusajs/ui"
import { Download, FileText, Loader2 } from "lucide-react"

const B2BCatalog = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchB2BProducts = async () => {
    setLoading(true)
    try {
      // Fetch 'Scientific Series' products via handle or tag
      // For this implementation, we target the specific high-impact handle
      const { products: fetched } = await sdk.store.product.list({
         handle: ["lions-mane-scientific"],
         fields: "*variants,*variants.prices"
      })
      setProducts(fetched)
    } catch (err) {
      console.error("Failed to fetch B2B products:", err)
      setError("Institutional catalog unavailable.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchB2BProducts()
  }, [])

  if (loading) {
    return (
      <Button variant="secondary" className="bg-white/5 border-white/10 text-white/50 cursor-wait">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Preparing Catalog...
      </Button>
    )
  }

  if (error || products.length === 0) {
    return null; // Don't show if no products found or error
  }

  return (
    <div className="flex items-center gap-4">
      <PDFDownloadLink
        document={<B2BCatalogPDF products={products} />}
        fileName="RBSL-DHAKA-B2B-CATALOG.pdf"
      >
        {({ loading: pdfLoading }) => (
          <Button 
            className="bg-white text-black hover:bg-neutral-200 font-bold transition-all"
            disabled={pdfLoading}
          >
            {pdfLoading ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
               <Download className="mr-2 h-4 w-4" />
            )}
            Download B2B Catalog
          </Button>
        )}
      </PDFDownloadLink>
      
      <div className="hidden lg:flex flex-col">
        <span className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em]">Institutional Access</span>
        <span className="text-[7px] text-white/20 font-bold uppercase tracking-[0.1em]">Dhaka Unit — Authorized</span>
      </div>
    </div>
  )
}

export default B2BCatalog
