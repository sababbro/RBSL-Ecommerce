"use client"

import React, { useState, useEffect } from "react"
import { sdk } from "@lib/config"
import toast from "react-hot-toast"
import { ShieldCheck, AlertCircle, LogIn } from "lucide-react"
import Link from "next/link"

export default function CompanyProfileForm() {
  const [bin, setBin] = useState("")
  const [license, setLicense] = useState("")
  const [status, setStatus] = useState<"idle" | "verifying" | "verified">("idle")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const binRegex = /^\d{13}$/
  const isBinValid = binRegex.test(bin)
  const isFormValid = isBinValid && license.length > 3
  
  // Load existing metadata on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res: any = await sdk.client.fetch("/store/customers/me", { method: "GET" })
        setIsAuthenticated(true)
        if (res.customer?.metadata?.bin) setBin(res.customer.metadata.bin)
        if (res.customer?.metadata?.trade_license) setLicense(res.customer.metadata.trade_license)
        if (res.customer?.metadata?.is_verified) setStatus("verified")
      } catch (err) {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setStatus("verifying")

    try {
      await sdk.client.fetch("/store/customers/me", {
        method: "POST",
        body: {
          metadata: {
            bin,
            trade_license: license,
            is_verified: true,
            verification_date: new Date().toISOString()
          }
        }
      })
      
      setTimeout(() => {
        setStatus("verified")
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
      }, 1500)
    } catch (err) {
      console.error(err)
      setStatus("idle")
      toast.error("Synchronization Failed")
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl bg-black border border-white/5 p-12 rounded-2xl shadow-2xl backdrop-blur-3xl">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl bg-black border border-white/5 p-12 rounded-2xl shadow-2xl backdrop-blur-3xl">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <LogIn className="w-8 h-8 text-white/30" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Authentication Required</h2>
          <p className="text-sm text-white/40 mb-8">
            Please login to access the Enterprise Compliance portal and register your corporate identity.
          </p>
          <div className="flex flex-col gap-4">
            <Link 
              href="/account/login"
              className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all text-center rounded-xl"
            >
              Login to Continue
            </Link>
            <Link 
              href="/account/register"
              className="w-full py-4 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all text-center rounded-xl"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl bg-black border border-white/5 p-12 rounded-2xl shadow-2xl backdrop-blur-3xl">
      <div className="flex items-start justify-between mb-12">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Institutional Identity</h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em]">Compliance Protocol: BIN & Trade License</p>
        </div>
        {status === "verified" ? (
            <div className="flex items-center bg-white text-black text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <ShieldCheck className="w-3 h-3 mr-2" /> Verified
            </div>
        ) : (
            <div className="text-[9px] text-white/20 font-black uppercase tracking-widest">Awaiting Audit</div>
        )}
      </div>

      <form onSubmit={handleVerify} className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-white/40 mb-3 uppercase tracking-widest">Business Identification Number (BIN)</label>
          <input 
            type="text" 
            value={bin}
            onChange={(e) => setBin(e.target.value)}
            disabled={status === "verified"}
            placeholder="13-digit numeric code"
            className={`w-full p-4 bg-zinc-900 border ${!isBinValid && bin.length > 0 ? "border-red-500/50 text-red-500" : "border-white/10 text-white"} rounded-xl focus:ring-1 focus:ring-white outline-none transition-all font-mono text-sm tracking-widest`}
          />
          {!isBinValid && bin.length > 0 && (
              <p className="mt-3 flex items-center text-[9px] text-red-500 font-bold uppercase tracking-widest leading-none">
                  <AlertCircle className="w-3 h-3 mr-2" /> Institutional Requirement: Please provide a valid 13-digit BIN.
              </p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black text-white/40 mb-3 uppercase tracking-widest">Trade License Identifier</label>
          <input 
            type="text" 
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            disabled={status === "verified"}
            placeholder="Official Document ID"
            className="w-full p-4 bg-zinc-900 border border-white/10 text-white rounded-xl focus:ring-1 focus:ring-white outline-none transition-all font-mono text-sm tracking-widest"
          />
        </div>

        <button 
          type="submit"
          disabled={status !== "idle" || !isFormValid}
          className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] transition-all shadow-xl ${
            status === "verified" 
              ? "bg-zinc-800 text-white/20 cursor-not-allowed" 
              : !isFormValid && bin.length > 0
                ? "bg-zinc-900 text-white/10 cursor-not-allowed border border-white/5"
                : "bg-white text-black hover:scale-[1.01] active:scale-95"
          }`}
        >
          {status === "verifying" ? "Authenticating Certificates..." : status === "verified" ? "Compliance Active" : "Verify Corporate Status"}
        </button>
      </form>
    </div>
  )
}
