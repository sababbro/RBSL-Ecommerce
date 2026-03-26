import { MedusaService } from "@medusajs/framework/utils"
import { Company } from "./models/company"
import { B2BAdmin } from "./models/b2b-admin"

class B2bModuleService extends MedusaService({
  Company,
  B2BAdmin,
}) {}

export default B2bModuleService
