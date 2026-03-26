import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function addClinicalProduct({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  logger.info("Adding RBSL Scientific Series Product...")
  
  const [salesChannel] = await salesChannelModuleService.listSalesChannels()
  const [shippingProfile] = await fulfillmentModuleService.listShippingProfiles()

  const { result } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Lion's Mane Extract - Scientific Series",
          description: "Premium extraction for cognitive enhancement. Purity: 98%. Polysaccharide Content: 45%.",
          handle: "lions-mane-scientific",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png" }
          ],
          options: [
            { title: "Volume", values: ["500ml", "1000ml"] }
          ],
          variants: [
            {
              title: "500ml",
              sku: "LM-SS-500",
              options: { Volume: "500ml" },
              prices: [{ amount: 150, currency_code: "usd" }]
            },
            {
              title: "1000ml",
              sku: "LM-SS-1000",
              options: { Volume: "1000ml" },
              prices: [{ amount: 280, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: salesChannel.id }]
        }
      ]
    }
  })

  logger.info(`Product created: ${result[0].title} (ID: ${result[0].id})`)
}
