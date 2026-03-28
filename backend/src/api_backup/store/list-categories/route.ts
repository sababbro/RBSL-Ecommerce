import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const productModule = req.scope.resolve(Modules.PRODUCT)
  const categories = await productModule.listProductCategories({})
  res.json(categories)
}
