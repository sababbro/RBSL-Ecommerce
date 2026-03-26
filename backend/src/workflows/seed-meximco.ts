import { 
  createStep, 
  createWorkflow, 
  WorkflowResponse,
  StepResponse
} from "@medusajs/framework/workflows-sdk"
import { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/framework/utils"

const seedProductsStep = createStep(
  "seed-products-step",
  async (_, { container }) => {
    const productModuleService: IProductModuleService = container.resolve(
      Modules.PRODUCT
    )

    const products = [
      {
        title: "Premium Dried Shiitake (Series S-01)",
        subtitle: "Lentinula edodes",
        description: "A meticulously cured specimen of Lentinula edodes, optimized for maximum polysaccharide concentration. Sourced from high-altitude oak logs and processed at the Dhaka Extraction Facility to ensure structural integrity and a profound umami profile. Essential for professional culinary rehydration protocols.",
        handle: "premium-dried-shiitake-s01",
        status: "published",
        shipping_profile_id: "sp_all",
        options: [{ title: "Weight", values: ["500g", "1kg"] }],
        variants: [
          { title: "500g", sku: "MEX-SHI-500", prices: [{ amount: 4500, currency_code: "usd" }], options: { Weight: "500g" } },
          { title: "1kg", sku: "MEX-SHI-1000", prices: [{ amount: 8500, currency_code: "usd" }], options: { Weight: "1kg" } }
        ]
      },
      {
        title: "Lion’s Mane Extract (Nootropic Series N-02)",
        subtitle: "Hericium erinaceus",
        description: "A potent aqueous-alcoholic dual extraction of Hericium erinaceus. Standardized to contain high concentrations of hericenones and erinacines. Designed to support neurological synthetic pathways and cognitive resilience. Precision micro-filtered at the Dhaka Extraction Facility for rapid absorption.",
        handle: "lions-mane-extract-n02",
        status: "published",
        shipping_profile_id: "sp_all",
        options: [{ title: "Concentration", values: ["Dual Extract"] }],
        variants: [
          { title: "Standard 50ml", sku: "MEX-LM-50", prices: [{ amount: 3200, currency_code: "usd" }], options: { Concentration: "Dual Extract" } }
        ]
      },
      {
        title: "Reishi Spore Powder (Vitality Series V-03)",
        subtitle: "Ganoderma lucidum",
        description: "Cell-wall broken Ganoderma lucidum spore powder. Harvested via physical cold-press vibration at the Dhaka Extraction Facility to preserve the volatile triterpene profile. A foundational bio-active agent for systemic equilibrium and immune modulation. Sourced from organic Duanwood-grown Reishi.",
        handle: "reishi-spore-powder-v03",
        status: "published",
        shipping_profile_id: "sp_all",
        options: [{ title: "Grade", values: ["Pharma-Grade"] }],
        variants: [
          { title: "100g Jar", sku: "MEX-REI-100", prices: [{ amount: 5500, currency_code: "usd" }], options: { Grade: "Pharma-Grade" } }
        ]
      }
    ]

    console.log("Seeding products to Dhaka core units...")
    try {
        const result = await productModuleService.createProducts(products as any)
        console.log("Seeding successful:", result.map(p => p.title))
        return new StepResponse(result)
    } catch (e) {
        console.error("Seeding failed:", e)
        throw e
    }
  }
)

export const seedMeximcoWorkflow = createWorkflow(
  "seed-meximco",
  () => {
    const products = seedProductsStep()
    return new WorkflowResponse(products)
  }
)
