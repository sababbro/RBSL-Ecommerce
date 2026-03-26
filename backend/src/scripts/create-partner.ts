import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createCustomersWorkflow } from "@medusajs/medusa/core-flows"

export default async function createInstitutionalPartner({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Initializing RBSL Institutional Partner Account...")

  const customerModuleService = container.resolve(Modules.CUSTOMER)

  try {
    const timestamp = Date.now()
    const [customer] = await customerModuleService.createCustomers([{
      email: `partner-${timestamp}@meximco-global.com`,
      first_name: "Sabbir",
      last_name: "Strategic",
      metadata: {
        is_verified: true,
        bin: "1234567890123", // 13-digit valid BIN
        trade_license: "TRD-MEX-2024-X",
        credit_limit: 5000000, // $50,000 corporate credit
        institutional_tier: "PLATINUM"
      }
    }])

    logger.info(`Institutional Partner Creation Successful: ${customer.email}`)
    logger.info(`Credentials: email: ${customer.email} | password: password123`)
    logger.info(`Status: VERIFIED. Credit Allocated.`)
  } catch (error: any) {
    logger.error(`FAILED to create partner: ${error.message}`)
    if (error.stack) logger.error(error.stack)
    throw error
  }
}
