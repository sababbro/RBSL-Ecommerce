import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ICustomerModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Handles B2B wholesale applications.
 * In a real-world scenario, this might create a custom entity or notify admins.
 * For this implementation, we update the customer metadata and log the attempt.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { 
    company_name, 
    tax_id, 
    document_url, 
    customer_id,
    business_type
  } = req.body as {
    company_name: string
    tax_id: string
    document_url: string
    customer_id: string
    business_type: string
  }

  if (!customer_id || !document_url) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  const customerModuleService: ICustomerModuleService = req.scope.resolve(Modules.CUSTOMER)

  try {
    // Update customer metadata with application details
    await customerModuleService.updateCustomers({
      id: customer_id,
      metadata: {
        b2b_application: {
          company_name,
          tax_id,
          document_url,
          business_type,
          status: "pending",
          applied_at: new Date().toISOString()
        }
      }
    })

    return res.status(200).json({ 
      success: true, 
      message: "Application submitted successfully. Our team will review your 'Dhaka Unit' credentials." 
    })
  } catch (error) {
    return res.status(500).json({ error: "Failed to process B2B application" })
  }
}
