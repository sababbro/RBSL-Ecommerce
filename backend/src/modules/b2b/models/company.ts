import { model } from "@medusajs/framework/utils"
import { B2BAdmin } from "./b2b-admin"

export const Company = model.define("company", {
  id: model.id().primaryKey(),
  name: model.text(),
  trade_license: model.text().nullable(),
  vat_id: model.text().nullable(),
  admins: model.hasMany(() => B2BAdmin),
})
