"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Heading, Text } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import NativeSelect from "@modules/common/components/native-select"
import { supabase } from "@lib/supabase-client"
import toast from "react-hot-toast"

const B2BApplicationForm = ({ customerId }: { customerId?: string }) => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const companyName = formData.get("company_name") as string
    const taxId = formData.get("tax_id") as string
    const businessType = formData.get("business_type") as string

    try {
      if (!file) {
        throw new Error("Please upload your Trade License or TIN certificate")
      }

      if (!customerId) {
        throw new Error("You must be logged in to apply for wholesale status")
      }

      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${customerId}/${Math.random()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("b2b-documents")
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("b2b-documents")
        .getPublicUrl(fileName)

      // 2. Submit to Medusa Backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/b2b/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName,
          tax_id: taxId,
          business_type: businessType,
          document_url: publicUrl,
          customer_id: customerId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit application to backend")
      }

      toast.success("Application submitted successfully! Dhaka Unit will review your credentials.")
      router.push("/account")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-6 bg-white shadow-sm border rounded-lg">
      <div className="mb-8 text-center">
        <Heading level="h2" className="text-3xl font-bold mb-2">Become a Partner</Heading>
        <Text className="text-ui-fg-subtle">
          Join the Royal Bengal Shrooms institutional network. Apply for wholesale access and secondary unit procurement.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <Input 
          label="Company Name" 
          name="company_name" 
          required 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Tax ID / BIN" 
            name="tax_id" 
            required 
          />
          <div className="flex flex-col gap-y-2">
            <span className="txt-compact-medium-plus">Entity Type <span className="text-rose-500">*</span></span>
            <NativeSelect name="business_type" required>
              <option value="pharmacy">Retail Pharmacy</option>
              <option value="hospital">Medical Hospital</option>
              <option value="research">Research Institution</option>
              <option value="distributor">Regional Distributor</option>
            </NativeSelect>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="txt-compact-medium-plus">Trade License / TIN Certificate</label>
          <input 
            type="file" 
            accept=".pdf,.jpg,.png" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-ui-fg-subtle file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-ui-bg-base file:text-ui-fg-base hover:file:bg-ui-bg-base-hover cursor-pointer border rounded-md p-2"
            required
          />
          <Text className="text-xs text-ui-fg-muted">PDF, JPG, or PNG (Max 5MB). Required for Dhaka Unit verification.</Text>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full h-12 text-lg" 
          isLoading={submitting}
        >
          Submit Institutional Application
        </Button>
      </form>
    </div>
  )
}

export default B2BApplicationForm
