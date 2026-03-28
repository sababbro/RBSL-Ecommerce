import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ICustomerModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Handle B2B Wholesale Applications
 * Path: POST /store/b2b/apply
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const customerModuleService: ICustomerModuleService = req.scope.resolve(
    Modules.CUSTOMER
  )

  const { customer_id, business_name, trade_license_url, tin_number } = req.body as {
    customer_id: string
    business_name: string
    trade_license_url: string
    tin_number: string
  }

  if (!customer_id || !business_name) {
    return res.status(400).json({ 
      error: "customer_id and business_name are required" 
    })
  }

  try {
    // Update customer metadata with wholesale application details
    // Medusa v2 uses an object-based update pattern
    await customerModuleService.updateCustomers({
      id: customer_id,
      metadata: {
        b2b_application: {
          status: "pending",
          business_name,
          trade_license_url,
          tin_number,
          applied_at: new Date().toISOString()
        }
      }
    })

    return res.json({ 
      success: true, 
      message: "Application submitted for review. Your 'Dhaka Unit' trust status is pending." 
    })
  } catch (error) {
    return res.status(500).json({ 
      error: "Failed to process application",
      details: error instanceof Error ? error.message : "Internal Server Error"
    })
  }
}
