import { Module } from "@medusajs/framework/utils"
import RBSLPaymentService from "./service"

export default Module("rbsl-payment-manual", {
  service: RBSLPaymentService,
})
