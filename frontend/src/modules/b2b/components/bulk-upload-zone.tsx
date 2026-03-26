"use client"

import React, { useCallback, useState } from "react"
import Papa from "papaparse"
import { Upload, FileWarning, CheckCircle2 } from "lucide-react"

interface BulkUploadResult {
  sku: string
  quantity: number
}

interface BulkUploadZoneProps {
  onUpload: (data: BulkUploadResult[]) => void
}

export default function BulkUploadZone({ onUpload }: BulkUploadZoneProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lastFile, setLastFile] = useState<string | null>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a .csv biological requisition file.")
      return
    }

    setLastFile(file.name)
    setError(null)

    Papa.parse<any>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData: BulkUploadResult[] = results.data.map((row) => ({
          sku: String(row.SKU || row.sku || "").trim(),
          quantity: parseInt(row.Quantity || row.quantity || "0")
        })).filter((item: BulkUploadResult) => item.sku && item.quantity > 0)

        if (parsedData.length === 0) {
          setError("No valid SKU/Quantity pairs found in CSV.")
        } else {
          onUpload(parsedData)
        }
      },
      error: (err: Error) => {
        setError(`Parsing error: ${err.message}`)
      }
    })
  }, [onUpload])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`relative group cursor-pointer border-2 border-dashed rounded-rounded p-10 transition-all text-center
        ${isDragging ? "border-meximco-primary bg-meximco-accent/50 scale-[1.01]" : "border-meximco-primary/20 bg-meximco-accent/20"}
        hover:border-meximco-primary/40 hover:bg-meximco-accent/30`}
    >
      <input 
        type="file" 
        accept=".csv"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      
      <div className="flex flex-col items-center">
        <Upload className={`w-12 h-12 mb-4 transition-colors ${isDragging ? "text-meximco-primary" : "text-meximco-primary/40"}`} />
        
        <h3 className="text-lg font-bold text-meximco-primary mb-1">Bulk Scientific Requisition</h3>
        <p className="text-sm text-meximco-primary/60 max-w-sm mx-auto">
          Drop your procurement CSV here. Columns must include <span className="font-mono text-meximco-primary">SKU</span> and <span className="font-mono text-meximco-primary">Quantity</span>.
        </p>

        {error && (
          <div className="mt-4 flex items-center text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-base border border-red-100 animate-pulse">
            <FileWarning className="w-4 h-4 mr-2" /> {error}
          </div>
        )}

        {lastFile && !error && (
          <div className="mt-4 flex items-center text-green-700 text-sm font-medium bg-green-50 px-4 py-2 rounded-base border border-green-100">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Loaded: {lastFile}
          </div>
        )}
      </div>
    </div>
  )
}
