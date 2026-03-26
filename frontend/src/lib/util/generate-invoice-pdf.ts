import jsPDF from "jspdf"
import "jspdf-autotable"

interface InvoiceItem {
  title: string
  sku: string
  price: number
  quantity: number
}

interface InvoiceData {
  orderId: string
  displayId: string
  items: InvoiceItem[]
  subtotal: number
  total: number
  companyName: string
  bin?: string
  isSettled: boolean
  date: string
}

export const generateInvoicePDF = (data: InvoiceData) => {
  const doc = new jsPDF()
  const rbslBlack = [0, 0, 0]
  
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
  doc.text("Strategic Extraction Division | Dhaka Unit", 20, 36)
  
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text("COMMERCIAL INVOICE", 130, 25)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(`Ref: RBSL-INV-${data.displayId}`, 130, 32)
  
  // Document Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.text(`Invoice Date: ${data.date}`, 20, 55)
  doc.text(`Order ID: ${data.orderId.toUpperCase()}`, 20, 60)
  
  // Partner Info
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Billed To:", 20, 75)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(data.companyName.toUpperCase(), 20, 81)
  doc.text(`BIN: ${data.bin || "N/A"}`, 20, 86)
  
  // Table
  const tableRows = data.items.map(item => [
    item.title,
    `$${(item.price / 100).toLocaleString()}`,
    item.quantity,
    `$${((item.price * item.quantity) / 100).toLocaleString()}`
  ])
  
  // @ts-ignore
  doc.autoTable({
    startY: 95,
    head: [["Item Description", "Unit Price", "Quantity", "Total Amount"]],
    body: tableRows,
    headStyles: { fillColor: rbslBlack, textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 9 }
  })
  
  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY || 150
  
  // Summary
  doc.setFont("helvetica", "bold")
  doc.text(`Total Amount Paid:`, 140, finalY + 12)
  doc.text(`$${(data.total / 100).toLocaleString()}`, 190, finalY + 12, { align: "right" })
  
  // Sovereign Seal & Signature - Phase 5 Directive
  if (data.isSettled) {
    const sealY = Math.max(finalY + 30, 180)
    
    // Add Signature Placeholder
    doc.addImage("/assets/branding/signature.png", "PNG", 130, sealY, 60, 25)
    doc.setFontSize(8)
    doc.text("Director, Strategic Extraction Division", 130, sealY + 28)
    
    // Add Sovereign Seal
    doc.addImage("/assets/branding/sovereign-seal.png", "PNG", 20, sealY - 5, 35, 35)
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    doc.text("INSTITUTIONAL DHAKA UNIT SEAL", 21, sealY + 32)
    doc.text("VERIFIED VIA CENTRAL BANK RAIL", 21, sealY + 35)
  }

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text("This document is electronically verified by the Dhaka Unit Strategic Extraction Division.", 20, 285)
  
  doc.save(`RBSL_INVOICE_${data.displayId}.pdf`)
}
