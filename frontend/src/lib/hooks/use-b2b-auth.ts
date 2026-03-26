import { retrieveCustomer } from "@lib/data/customer"
import { redirect } from "next/navigation"

export async function useB2BAuth() {
  const customer = await retrieveCustomer()

  if (!customer) {
    return { isB2B: false, customer: null }
  }

  // Medusa v2 stores custom attributes in metadata
  const companyId = customer.metadata?.company_id

  return {
    isB2B: !!companyId,
    companyId,
    customer
  }
}

export async function validateB2BRoute() {
  const { isB2B } = await useB2BAuth()
  
  if (!isB2B) {
    redirect("/retail")
  }
}
