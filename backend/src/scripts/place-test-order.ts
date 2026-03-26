import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { 
  createCartWorkflow, 
  addToCartWorkflow, 
  completeCartWorkflow,
  updateCartWorkflow
} from "@medusajs/medusa/core-flows"

export default async function placeTestOrder({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const orderModule = container.resolve(Modules.ORDER)

  logger.info("Starting RBSL Test Procurement Flow...")

  // 1. Get the new Scientific Series product
  const { data: [product] } = await query.graph({
    entity: "product",
    fields: ["id", "title", "variants.id", "variants.title"],
    filters: { handle: "lions-mane-scientific" }
  })

  if (!product) {
    throw new Error("RBSL Scientific Series Product not found. Run add-clinical-product.ts first.")
  }

  const variant = product.variants[0]
  logger.info(`Targeting Clinical Asset: ${product.title} (${variant.title})`)

  // 2. Get region
  const { data: [region] } = await query.graph({
    entity: "region",
    fields: ["id", "currency_code"]
  })

  // 3. Create Cart
  const { result: cart } = await createCartWorkflow(container).run({
    input: {
      region_id: region.id,
      currency_code: region.currency_code,
      items: [
        {
          variant_id: variant.id,
          quantity: 2
        }
      ]
    }
  })
  logger.info(`Cart Created: ${cart.id}`)

  // 4. Update Cart with US Shipping Address (to trigger compliance gate)
  await updateCartWorkflow(container).run({
    input: {
      id: cart.id,
      shipping_address: {
        first_name: "Institutional",
        last_name: "Buyer",
        address_1: "1600 Pennsylvania Avenue NW",
        city: "Washington",
        country_code: "US",
        postal_code: "20500"
      },
      email: "procurement@rbsl-clinical.com"
    }
  })
  logger.info(`Shipping address set to US (Washington DC) - Compliance Gateway ENGAGED.`)

  // 5. Complete Cart -> Logic will trigger "order.placed"
  const { result: order } = await completeCartWorkflow(container).run({
    input: {
      id: cart.id
    }
  })

  logger.info(`Order Completed: PO#${order.id}`)

  // 6. Verification: Check Metadata injection in order-confirmed.ts (give it a few seconds)
  logger.info("Waiting for Sovereign Verification subscriber...")
  await new Promise(resolve => setTimeout(resolve, 5000))

  const verifiedOrder = await orderModule.retrieveOrder(order.id)
  
  logger.info("=== SOVEREIGN AUDIT RESULTS ===")
  logger.info(`Order ID: ${verifiedOrder.id}`)
  logger.info(`Shipping Country: ${verifiedOrder.shipping_address?.country_code}`)
  logger.info(`Customs Declaration: ${verifiedOrder.metadata?.customs_declaration || "FAILED"}`)
  logger.info(`Export Protocol: ${verifiedOrder.metadata?.export_protocol || "FAILED"}`)
  
  if (verifiedOrder.metadata?.customs_declaration === "RBSL-BIO-EXP-AUTHORIZED") {
    logger.info("RESULT: PASS - Physical Sovereignty Tier Verified.")
  } else {
    logger.info("RESULT: FAIL - Compliance metadata not detected.")
  }
}
