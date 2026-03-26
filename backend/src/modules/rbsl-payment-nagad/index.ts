import NagadPaymentService from "./service"
import { Module } from "@medusajs/framework/utils"

export default Module("rbsl-payment-nagad", {
  service: NagadPaymentService,
})
