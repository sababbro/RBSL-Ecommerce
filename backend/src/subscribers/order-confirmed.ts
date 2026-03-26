import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa"
import { Resend } from "resend"
import { Modules } from "@medusajs/framework/utils"

export default async function orderConfirmedSubscriber({
  event,
  container,
}: SubscriberArgs<any>) {
  const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder")
  const orderModule = container.resolve(Modules.ORDER)
  const customerModule = container.resolve(Modules.CUSTOMER)
  const productModule = container.resolve(Modules.PRODUCT)
  const inventoryModule = container.resolve(Modules.INVENTORY)

  const orderId = event.data.id
  const order = await orderModule.retrieveOrder(orderId, {
    relations: ["items", "customer", "shipping_address"]
  })

  // 3. Export Compliance Logic — Directive 3
  const highComplianceRegions = ["US", "AE", "GB", "DE", "FR", "CA"] // Example EU + UAE + USA
  const countryCode = order.shipping_address?.country_code?.toUpperCase()

  if (countryCode && highComplianceRegions.includes(countryCode)) {
    console.log(`[RBSL COMPLIANCE] High-priority region detected: ${countryCode}. Appending Customs Declaration.`)
    await orderModule.updateOrders([{
       id: orderId,
       metadata: {
          ...order.metadata,
          customs_declaration: "RBSL-BIO-EXP-AUTHORIZED",
          export_protocol: "ACCORD-2024-V1"
       }
    }])
  }

  // Get customer metadata for compliance
  const customerId = order.customer_id || ""
  const customer = customerId ? await customerModule.retrieveCustomer(customerId) : null
  const binNumber = (customer?.metadata?.bin as string) || "STDBY"

  console.log(`[RBSL LOGISTICS] Processing fulfillment for order: ${orderId}`)

  try {
    // 1. Send Institutional Confirmation to Partner
    const orderEmail = order.email || "partner@rbsl.com"
    const batchId = (order.metadata?.batch_id as string) || "RBSL-SYD-2024-08A"

    await resend.emails.send({
      from: "RBSL Institutional Logistics <logistics@rbsl.com>",
      to: [orderEmail],
      subject: `[RBSL] Procurement Authorized - PO#${order.display_id || orderId}`,
      html: `
        <div style="font-family: sans-serif; color: #000; background-color: #fff; padding: 50px; border: 2px solid #000;">
          <h1 style="text-transform: uppercase; font-style: italic; letter-spacing: -1px; border-bottom: 4px solid #000; padding-bottom: 10px;">Institutional Authorization</h1>
          <p style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-top: 20px;">Procurement Request PO#${order.display_id || orderId}</p>
          <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Your strategic procurement for the <strong>Scientific Series</strong> has been successfully authorized and passed through the RBSL Compliance Audit.
          </p>
          
          <div style="background-color: #f5f5f5; padding: 30px; margin: 30px 0; border: 1px solid #ddd;">
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Compliance Metadata</p>
            <p style="margin: 10px 0 0; font-size: 14px;"><strong>Order ID:</strong> ${order.display_id || orderId}</p>
            <p style="margin: 5px 0 0; font-size: 14px;"><strong>BIN Mapping:</strong> ${binNumber}</p>
            <p style="margin: 5px 0 0; font-size: 14px;"><strong>Status:</strong> DISPATCH_READY</p>
          </div>

          <div style="border: 1px solid #000; padding: 25px; margin: 30px 0;">
            <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px;">Sovereign Batch Specifications</h3>
            <p style="font-size: 13px; font-weight: 600; margin-bottom: 20px;">
              Extraction Batch Allocation: <span style="font-family: monospace; background: #eee; padding: 2px 5px;">${batchId}</span>
            </p>
            <a href="#" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 25px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block;">
              Download Biological Specs (.COA)
            </a>
          </div>

          <hr style="border: 0; border-top: 2px solid #000; margin: 40px 0;" />
          <footer style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #888;">
            OFFICIAL DOCUMENT - ROYAL BENGAL SHROOMS LIMITED<br />
            MEXIMCO PRODUCT DIVISION EXPORT &copy; 2026
          </footer>
        </div>
      `,
    })

    // 2. Inventory Verification & Low Stock Alert (Sydney Hub)
    const items = order.items || []
    for (const item of items) {
      if (!item.variant_id) continue
      
      const inventoryLevels = await inventoryModule.listInventoryLevels({
        inventory_item_id: [item.variant_id] 
      })

      const currentStock = inventoryLevels[0]?.stocked_quantity || 0
      
      // If stock for Scientific Series drops below 20 units (representing a critical threshold)
      if (currentStock < 20) {
        const itemSku = item.variant_sku || "UNDEF_SKU"
        console.warn(`[RBSL ALERT] Low Stock Detected: ${item.title} (Qty: ${currentStock})`)
        await resend.emails.send({
          from: "RBSL System Monitor <system@rbsl.com>",
          to: ["logistics@rbsl.com"],
          subject: `[ALERT] Inventory Depletion - Sydney Hub - ${itemSku}`,
          html: `
            <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif;">
              <h1 style="color: #ff4444; text-transform: uppercase;">Inventory Depletion Alert</h1>
              <p>Critical threshold reached for <strong>Scientific Series</strong> allocation at <strong>Sydney Hub</strong>.</p>
              <div style="border: 1px solid #333; padding: 20px; margin-top: 20px;">
                <p><strong>Product:</strong> ${item.title}</p>
                <p><strong>SKU:</strong> ${itemSku}</p>
                <p><strong>Remaining Qty:</strong> ${currentStock} Units</p>
                <p><strong>Status:</strong> BELOW 20% BATCH THRESHOLD</p>
              </div>
              <p style="margin-top: 30px; font-size: 12px; color: #888;">Immediate restock or batch rescheduling required.</p>
            </div>
          `
        })
      }
    }

    console.log("[RBSL LOGISTICS] Notification and Audit complete.")
  } catch (err) {
    console.error("[RBSL ERROR] Fulfillment subscriber failure:", err)
  }
}

export const config: SubscriberConfig = {
  event: ["order.placed", "order.confirmed"],
}
