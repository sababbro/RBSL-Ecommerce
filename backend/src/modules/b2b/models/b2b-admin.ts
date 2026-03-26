import { model } from "@medusajs/framework/utils"
import { Company } from "./company"

export const B2BAdmin = model.define("b2b_admin", {
  id: model.id().primaryKey(),
  email: model.text().unique(),
  company: model.belongsTo(() => Company, {
    mappedBy: "admins"
  })
})
