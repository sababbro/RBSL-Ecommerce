"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Building2, Lock, Mail, Loader2, AlertCircle } from "lucide-react"
import { sdk } from "@lib/config"
import Link from "next/link"

export default function B2BLoginPage() {
  const router = useRouter()
  const { countryCode } = useParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Call Medusa authentication API
      const token = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      })

      // Store the auth token
      document.cookie = `_medusa_jwt=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      
      // Redirect to B2B dashboard
      router.push(`/${countryCode}/b2b`)
      router.refresh()
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err?.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-white/[0.02] border-r border-white/5 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-black text-xs">R</span>
            </div>
            <span className="text-sm font-black uppercase tracking-[0.3em]">RBSL</span>
          </div>
          
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">
            DHAKA UNIT <br />
            <span className="text-white/20 italic">PARTNER PORTAL</span>
          </h1>
          
          <p className="text-white/30 text-xs uppercase tracking-widest leading-relaxed max-w-md">
            Secure institutional access to the Dhaka Unit extraction facility.
            Direct procurement channels for verified B2B partners.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">256-bit Encryption Active</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Sovereign Authentication Protocol</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-black text-xs">R</span>
            </div>
            <span className="text-sm font-black uppercase tracking-[0.3em]">RBSL</span>
          </div>

          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Partner Login</h2>
            <p className="text-white/30 text-xs uppercase tracking-widest">
              Access your institutional procurement dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-500">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                placeholder="partner@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Remember Session</span>
              </label>
              <span className="text-[10px] text-white/40 uppercase tracking-widest cursor-pointer hover:text-white/60 transition-colors">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Secure Login"
              )}
            </button>
          </form>

          <div className="border-t border-white/5 pt-8">
            <p className="text-center text-[10px] text-white/20 uppercase tracking-widest mb-4">
              Not yet registered as a partner?
            </p>
            <Link
              href={`/${countryCode}/account/b2b/apply`}
              className="block w-full py-4 border border-white/10 text-white text-center font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
            >
              Apply for Partnership
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
