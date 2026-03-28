import { 
  SubscriberArgs, 
  SubscriberConfig 
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import logger, { maskPII } from "../lib/index"

export default async function observabilitySubscriber({
  event,
  container,
}: SubscriberArgs<any>) {
  const orderModule = container.resolve(Modules.ORDER)
  const paymentModule = container.resolve(Modules.PAYMENT)

  const eventName = event.name
  const entityId = event.data.id

  try {
    if (eventName === "order.placed") {
      const order = await orderModule.retrieveOrder(entityId, {
        relations: ["customer", "shipping_address"]
      })

      logger.info({
        event: "order.placed",
        order_id: entityId,
        display_id: order.display_id,
        customer_id: order.customer_id,
        customer_email: order.email, // Standard email masking in pino if needed, but I'll use helper
        customer_phone_masked: maskPII(order.shipping_address?.phone),
        currency_code: order.currency_code,
        total_amount: order.total,
        status: order.status,
        logistics_unit: "Dhaka Unit",
      }, "RBSL PROCURMENT: New Order Placed")
    }

    if (eventName === "payment.captured") {
      const payment = await paymentModule.retrievePayment(entityId)
      
      logger.info({
        event: "payment.captured",
        payment_id: entityId,
        amount: payment.amount,
        currency_code: payment.currency_code,
        provider_id: payment.payment_session?.provider_id,
        status: (payment as any).status,
        logistics_unit: "Dhaka Unit",
      }, "RBSL SETTLEMENT: Payment Captured")
    }
  } catch (err) {
    logger.error({
      event: eventName,
      entity_id: entityId,
      error: err instanceof Error ? err.message : String(err),
    }, "Observability subscriber failure")
  }
}

export const config: SubscriberConfig = {
  event: ["order.placed", "payment.captured"],
}
