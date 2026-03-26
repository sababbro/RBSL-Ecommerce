"use client"

import React, { useState } from "react"
import { Upload, FileCheck, Loader2, AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"

interface PoPUploadProps {
  orderId: string
  onSuccess?: () => void
}

export default function PoPUpload({ orderId, onSuccess }: PoPUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Institutional Limit Error: File size exceeds 10MB.")
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(20)

    try {
      // Mocking the upload process for the "rocksolid" walkthrough
      // In a real scenario, this would call a server action or API
      setTimeout(async () => {
         setUploadProgress(100)
         toast.success("RBSL Capital Audit: PoP Secured", {
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
         setIsUploading(false)
         setFile(null)
         if (onSuccess) onSuccess()
      }, 1500)
    } catch (error) {
      toast.error("RBSL Secure Link Failed: Transmission interrupted.")
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white/[0.03] border border-white/5 p-8 rounded-xl space-y-6 overflow-hidden relative">
      <div className="flex items-center space-x-3 mb-2">
         <Upload className="w-5 h-5 text-white/20" />
         <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Sovereign Proof of Payment</h3>
      </div>

      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
         Upload your Bank Deposit Slip or Swift Message for institutional verification. 
         Accepted formats: PDF, JPG, PNG (Max 10MB).
      </p>

      {!file ? (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl py-12 px-6 hover:border-white/30 hover:bg-white/[0.02] cursor-pointer transition-all group">
          <Upload className="w-8 h-8 text-white/20 group-hover:text-white/40 mb-4 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors">Select PoP Documentation</span>
          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <FileCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[200px]">{file.name}</div>
              <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
          <button 
            onClick={() => setFile(null)}
            className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-white text-black py-4 rounded-lg font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Transmitting...
            </span>
          ) : (
            "Authorize PoP Transmission"
          )}
        </button>
      )}

      {isUploading && (
        <div className="absolute bottom-0 left-0 h-1 bg-white shadow-[0_0_10px_#fff] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
      )}
    </div>
  )
}
