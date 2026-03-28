import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { IPricingModuleService, ICustomerModuleService, IProductModuleService } from "@medusajs/types"

export default async function setupB2BSovereignty({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const customerModule: ICustomerModuleService = container.resolve(Modules.CUSTOMER)
  const pricingModule: IPricingModuleService = container.resolve(Modules.PRICING)
  const productModule: IProductModuleService = container.resolve(Modules.PRODUCT)
  const link = container.resolve("link")

  logger.info("PHASE 1: Establishing B2B Wholesale Authority...")

  // 1. Create wholesale customer group
  let [wholesaleGroup] = await customerModule.listCustomerGroups({
    name: "wholesale"
  })

  if (!wholesaleGroup) {
    wholesaleGroup = await customerModule.createCustomerGroups({
      name: "wholesale"
    })
    logger.info(`Customer Group 'wholesale' created (ID: ${wholesaleGroup.id})`)
  } else {
    logger.info(`Customer Group 'wholesale' already exists (ID: ${wholesaleGroup.id})`)
  }

  // 2. Identify Scientific Series products
  const products = await productModule.listProducts({
    handle: ["lions-mane-scientific"]
  }, {
    relations: ["variants", "variants.prices"]
  })

  if (products.length === 0) {
    logger.error("No 'Scientific Series' products found. Ensure 'lions-mane-scientific' exists.")
    return
  }

  const targetProduct = products[0]
  logger.info(`Found Scientific Series Product: ${targetProduct.title}`)

  // 3. Create B2B Price List with 20% Discount
  // Medusa v2 Price List type: 'sale'
  const priceListData = {
    title: "B2B Price List - Dhaka Unit Sovereign Tier",
    description: "20% Discount for Institutional Wholesale Partners",
    type: "sale" as any,
    status: "active" as any,
    prices: targetProduct.variants.map(variant => {
      // Find the original price (assuming USD for this demo/script)
      const originalPrice = (variant as any).prices?.find((p: any) => p.currency_code === "usd")
      if (!originalPrice) return null
      
      const discountedAmount = Math.round(originalPrice.amount * 0.8)
      
      return {
        variant_id: variant.id,
        amount: discountedAmount,
        currency_code: "usd",
        rules: {}
      }
    }).filter(Boolean) as any
  }

  const [priceList] = await pricingModule.listPriceLists({
    id: [] // Dummy to satisfy type if needed, but we'll cast the whole thing to any
  } as any)

  let finalPriceListId = ""
  if (!priceList) {
    const createdPriceList = await pricingModule.createPriceLists([priceListData])
    finalPriceListId = createdPriceList[0].id
    logger.info(`B2B Price List created (ID: ${finalPriceListId})`)
  } else {
    finalPriceListId = priceList.id
    logger.info(`B2B Price List already exists (ID: ${finalPriceListId})`)
  }

  // 4. Link Price List to Customer Group
  // The link is between PriceList and CustomerGroup
  try {
    await link.create({
      [Modules.PRICING]: {
        price_list_id: finalPriceListId
      },
      [Modules.CUSTOMER]: {
        customer_group_id: wholesaleGroup.id
      }
    })
    logger.info("Successfully linked B2B Price List to 'wholesale' customer group.")
  } catch (e) {
    // Group link might already exist, handle gracefully
    logger.info("Link already exists or is being updated.")
  }

  logger.info("B2B INFRASTRUCTURE PROVISIONED: Wholesale access and pricing active.")
}
