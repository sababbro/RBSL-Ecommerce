import { Module } from "@medusajs/framework/utils"
import B2bModuleService from "./service"

export const B2B_MODULE = "b2b"

export default Module(B2B_MODULE, {
  service: B2bModuleService,
})
