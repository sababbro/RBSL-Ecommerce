import BKashPaymentService from "./service"
import { Module } from "@medusajs/framework/utils"

export default Module("rbsl-payment-bkash", {
  service: BKashPaymentService,
})
