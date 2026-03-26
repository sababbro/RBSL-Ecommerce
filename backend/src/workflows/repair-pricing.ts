import { 
  createStep, 
  createWorkflow, 
  WorkflowResponse,
  StepResponse
} from "@medusajs/framework/workflows-sdk"
import { 
  IProductModuleService, 
  IPricingModuleService,
  ILinkModuleService
} from "@medusajs/types"
import { Modules } from "@medusajs/framework/utils"

const repairPricingStep = createStep(
  "repair-pricing-step",
  async (_, { container }) => {
    const productModule: IProductModuleService = container.resolve(Modules.PRODUCT)
    const pricingModule: IPricingModuleService = container.resolve(Modules.PRICING)
    const remoteLink = container.resolve("remoteLink")

    console.log("Starting pricing repair for Sydney region...")

    // 1. Get all products and variants
    const products = await productModule.listProducts({}, { relations: ["variants"] })
    
    // 2. We need a fallback price map if they were seeded without one
    const priceMap: Record<string, number> = {
      "MEX-SHI-500": 4500,
      "MEX-SHI-1000": 8500,
      "MEX-LM-50": 3200,
      "MEX-REI-100": 5500
    }

    const linkedCount = 0
    
    for (const product of products) {
      for (const variant of product.variants) {
        if (!variant.sku || !priceMap[variant.sku]) continue

        console.log(`Processing variant: ${variant.sku}`)

        // Create a PriceSet for this variant if it doesn't have one linked
        const priceSet = await pricingModule.createPriceSets({
          prices: [
            {
              amount: priceMap[variant.sku],
              currency_code: "usd",
              min_quantity: 0
            }
          ]
        })

        // Link the variant to the price set
        await remoteLink.create({
          [Modules.PRODUCT]: {
            variant_id: variant.id
          },
          [Modules.PRICING]: {
            price_set_id: priceSet.id
          }
        })
        
        console.log(`Linked ${variant.sku} to price set ${priceSet.id}`)
      }
    }

    return new StepResponse({ success: true, count: products.length })
  }
)

export const repairPricingWorkflow = createWorkflow(
  "repair-pricing",
  () => {
    const result = repairPricingStep()
    return new WorkflowResponse(result)
  }
)
