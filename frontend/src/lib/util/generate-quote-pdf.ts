import jsPDF from "jspdf"
import "jspdf-autotable"

interface QuoteItem {
  title: string
  sku: string
  price: number
  quantity: number
}

interface QuoteData {
  items: QuoteItem[]
  subtotal: number
  vat: number
  total: number
  companyName: string
  bin?: string
  tradeLicense?: string
}

export const generateQuotePDF = (data: QuoteData) => {
  const doc = new jsPDF()
  const rbslBlack = [0, 0, 0] // Pure Black for Institutional feel
  
  // 0. Security Watermark Implementation
  const watermarkText = "RBSL STRATEGIC EXTRACTION DIVISION"
  doc.setTextColor(245, 245, 245) // Extremely faint gray
  doc.setFontSize(40)
  doc.setFont("helvetica", "bold")
  // Diagonal watermark across the page
  for (let i = 0; i < 3; i++) {
    doc.text(watermarkText, 30, 80 + (i * 80), { angle: 45 })
  }

  // Header
  doc.setFillColor(0, 0, 0)
  doc.rect(0, 0, 210, 45, "F")
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text("RBSL", 20, 22)
  doc.setFontSize(10)
  doc.text("ROYAL BENGAL SHROOMS LIMITED", 20, 30)
  doc.setFont("helvetica", "italic")
  doc.setFontSize(9)
  doc.text("Strategic Extraction Division", 20, 36)
  
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text("PROCUREMENT QUOTATION", 130, 25)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("Ref: RBSL-EXPORT-2024-SYS", 130, 32)
  
  // Document Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  const date = new Date().toLocaleDateString()
  doc.text(`Issuance Date: ${date}`, 20, 55)
  doc.text(`Tracking ID: RBSL-QX-${Math.floor(100000 + Math.random() * 900000)}`, 20, 60)
  
  // Institutional Compliance Info (with Fallbacks)
  const institutionalPartner = data.companyName?.trim() || "Pending Institutional Verification"
  const partnerBin = data.bin?.trim() || "Awaiting Account Audit"
  const partnerTL = data.tradeLicense?.trim() || "Compliance Required"

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Institutional Procurement Partner:", 20, 75)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(institutionalPartner.toUpperCase(), 20, 81)
  
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("Compliance Information:", 130, 75)
  doc.setFont("helvetica", "normal")
  doc.text(`BIN: ${partnerBin}`, 130, 81)
  doc.text(`TL: ${partnerTL}`, 130, 86)
  
  // Line Items Table
  const tableRows = data.items
    .filter(item => item.quantity > 0)
    .map(item => [
      item.title,
      item.sku,
      `$${(item.price / 100).toLocaleString()}`,
      item.quantity,
      `$${((item.price * item.quantity) / 100).toLocaleString()}`
    ])
    
  // @ts-ignore
  doc.autoTable({
    startY: 95,
    head: [["Technical Specification", "SKU", "Unit Price", "Quantity", "Total Allocation"]],
    body: tableRows,
    headStyles: { fillColor: rbslBlack, textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    styles: { fontSize: 9 },
    margin: { top: 95 }
  })
  
  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY || 150
  
  // Summary
  const summaryX = 140
  doc.setFont("helvetica", "normal")
  doc.text(`Subtotal Allocation:`, summaryX, finalY + 12)
  doc.text(`$${(data.subtotal / 100).toLocaleString()}`, 190, finalY + 12, { align: "right" })
  
  doc.text(`Regulatory VAT (15%):`, summaryX, finalY + 19)
  doc.text(`$${(data.vat / 100).toLocaleString()}`, 190, finalY + 19, { align: "right" })
  
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text(`Institutional Total:`, summaryX, finalY + 29)
  doc.text(`$${(data.total / 100).toLocaleString()}`, 190, finalY + 29, { align: "right" })
  
  // Official Infrastructure Placeholder
  const sigY = Math.max(finalY + 50, 180)
  doc.setFontSize(9)
  doc.line(20, sigY, 80, sigY)
  doc.text("RBSL Authorized Official Seal", 20, sigY + 5)
  
  doc.line(130, sigY, 190, sigY)
  doc.text("Partner Authorization & Stamp", 130, sigY + 5)

  // Institutional Footer
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.setTextColor(100, 100, 100)
  const footerY = 275
  doc.text("A MEXIMCO PRODUCT DIVISION EXPORT", 20, footerY - 10)
  
  doc.setFont("helvetica", "normal")
  doc.text("Terms & Institutional Conditions:", 20, footerY - 3)
  doc.text("1. All extractions are standardized to EU/USP clinical benchmarks.", 20, footerY + 2)
  doc.text("2. Logistical fulfillment is routed via the Sydney Strategic Hub cluster.", 20, footerY + 7)
  doc.text("3. High-purity extracts (Scientific Series) are subject to global export audit.", 20, footerY + 12)
  
  doc.save(`RBSL_INSTITUTIONAL_QUOTE_${date.replace(/\//g, "-")}.pdf`)
}
