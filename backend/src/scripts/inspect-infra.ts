import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function inspectInfrastructure({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name", "provider_id", "service_zone_id"]
  })
  logger.info(`Shipping Options: ${JSON.stringify(shippingOptions, null, 2)}`)

  const { data: paymentProviders } = await query.graph({
    entity: "payment_provider",
    fields: ["id"]
  })
  logger.info(`Payment Providers: ${JSON.stringify(paymentProviders, null, 2)}`)
}
