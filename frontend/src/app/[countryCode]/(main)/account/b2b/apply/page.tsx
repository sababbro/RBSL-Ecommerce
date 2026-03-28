"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Building2, FileText, Globe, Mail, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function B2BApplyPage() {
  const router = useRouter()
  const { countryCode } = useParams()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
    contact_name: "",
    phone: "",
    country: (countryCode as string) || "bd",
    city: "",
    address: "",
    tax_id: "",
    website: "",
    business_type: "",
    annual_volume: "",
    product_interest: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In production, this would call the API
    // For now, show success
    setStep(4)
    setIsSubmitting(false)
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">APPLICATION RECEIVED</h1>
          <p className="text-white/40 text-sm uppercase tracking-widest">
            The Dhaka Unit processing team will review your application within 24-48 hours.
            You will receive confirmation at your registered email.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href={`/${countryCode}`}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all text-center"
            >
              Return to Home
            </Link>
            <Link
              href={`/${countryCode}/account/b2b/login`}
              className="w-full py-4 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all text-center"
            >
              Partner Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-white/20" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Institutional Portal</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">B2B Partner Application</h1>
          <p className="text-white/30 text-xs uppercase tracking-widest mt-2">
            Dhaka Unit Direct Procurement Access Request
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Company Info" },
              { num: 2, label: "Business Details" },
              { num: 3, label: "Submit" }
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-black ${
                  step >= s.num 
                    ? "bg-white text-black border-white" 
                    : "border-white/10 text-white/20"
                }`}>
                  {s.num}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${
                  step >= s.num ? "text-white" : "text-white/20"
                }`}>
                  {s.label}
                </span>
                {i < 2 && <div className={`w-12 h-[1px] ${step > s.num ? "bg-white" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-12">
        {step === 1 && (
          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tight">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <Building2 className="w-3 h-3" /> Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                  placeholder="Royal Bengal Shrooms Ltd."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Company Email *
                </label>
                <input
                  type="email"
                  name="company_email"
                  value={formData.company_email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                  placeholder="procurement@company.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Contact Person *
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                  placeholder="Full Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                  placeholder="+880..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                >
                  <option value="">Select Country</option>
                  <option value="bd">Bangladesh</option>
                  <option value="in">India</option>
                  <option value="us">United States</option>
                  <option value="de">Germany</option>
                  <option value="gb">United Kingdom</option>
                  <option value="ae">UAE</option>
                  <option value="sg">Singapore</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                  placeholder="Dhaka"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Tax/BIN ID</label>
                <input
                  type="text"
                  name="tax_id"
                  value={formData.tax_id}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                  placeholder="Tax Identification Number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Business Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                placeholder="Full Address"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tight">Business Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                  placeholder="https://company.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Business Type *</label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                >
                  <option value="">Select Type</option>
                  <option value="manufacturer">Manufacturer</option>
                  <option value="distributor">Distributor</option>
                  <option value="retailer">Retailer</option>
                  <option value="research">Research Institution</option>
                  <option value="healthcare">Healthcare Provider</option>
                  <option value="hospitality">Hospitality/F&B</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Expected Annual Volume</label>
                <select
                  name="annual_volume"
                  value={formData.annual_volume}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                >
                  <option value="">Select Range</option>
                  <option value="10L-50L">৳10,00,000 - ৳50,00,000</option>
                  <option value="50L-1Cr">৳50,00,000 - ৳1,00,00,000</option>
                  <option value="1Cr-5Cr">৳1,00,00,000 - ৳5,00,00,000</option>
                  <option value="5Cr+">৳5,00,00,000+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Product Interest</label>
                <select
                  name="product_interest"
                  value={formData.product_interest}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all"
                >
                  <option value="">Select Product Line</option>
                  <option value="shiitake">Shiitake Extracts (S-Series)</option>
                  <option value="lions-mane">Lion's Mane Nootropics (N-Series)</option>
                  <option value="reishi">Reishi Vitality (V-Series)</option>
                  <option value="bulk-dried">Bulk Dried Mushrooms</option>
                  <option value="custom">Custom Extraction Services</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Additional Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 transition-all resize-none"
                placeholder="Tell us about your business needs..."
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-8 py-4 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-xl font-black uppercase tracking-tight">Review & Submit</h2>
            
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Company</span>
                  <p className="text-sm font-bold text-white">{formData.company_name || "-"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Email</span>
                  <p className="text-sm font-bold text-white">{formData.company_email || "-"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Contact</span>
                  <p className="text-sm font-bold text-white">{formData.contact_name || "-"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Phone</span>
                  <p className="text-sm font-bold text-white">{formData.phone || "-"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Country</span>
                  <p className="text-sm font-bold text-white uppercase">{formData.country || "-"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Business Type</span>
                  <p className="text-sm font-bold text-white capitalize">{formData.business_type || "-"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-6">
              <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
                By submitting this application, you agree to the RBSL Institutional Partnership Terms. 
                The Dhaka Unit processing team will verify your credentials and contact you within 24-48 hours.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-4 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
