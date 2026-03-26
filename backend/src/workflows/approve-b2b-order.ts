import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { IOrderModuleService, IInventoryService } from "@medusajs/types"
import { Modules } from "@medusajs/framework/utils"

interface ApproveB2BOrderInput {
  order_id: string
}

// Step to update order status and metadata
const updateB2BOrderStatusStep = createStep(
  "update-b2b-order-status",
  async ({ order_id }: ApproveB2BOrderInput, { container }) => {
    const orderModule: IOrderModuleService = container.resolve(Modules.ORDER)
    
    // In Medusa v2, we update the status metadata for tracking
    const order = await orderModule.updateOrders(order_id, {
      metadata: {
        b2b_status: "confirmed",
        approval_date: new Date().toISOString()
      }
    })

    return new StepResponse(order, order_id)
  }
)

// Step to reserve/deduct inventory for B2B items
const processB2BInventoryStep = createStep(
  "process-b2b-inventory",
  async ({ order_id }: ApproveB2BOrderInput, { container }) => {
    const orderModule: IOrderModuleService = container.resolve(Modules.ORDER)
    const inventoryModule: IInventoryService = container.resolve(Modules.INVENTORY)
    
    const order = await orderModule.retrieveOrder(order_id, {
      relations: ["items"]
    })

    const items = order.items
    if (!items || items.length === 0) {
      return new StepResponse({ success: true, message: "No items to process" })
    }

    // Sydney Cluster Inventory Reservation
    for (const item of items) {
      if (item.variant_id) {
        // Find inventory items for the variant
        const inventoryQueryResult = await inventoryModule.listInventoryItems({
          sku: (item.metadata?.sku as string) || undefined
        })

        const inventoryItems = Array.isArray(inventoryQueryResult) ? inventoryQueryResult : inventoryQueryResult[0]

        if (inventoryItems && inventoryItems.length > 0) {
          // Adjust inventory (Deduct)
          await inventoryModule.adjustInventory(
            inventoryItems[0].id,
            "Syd_Warehouse_01", // Specialized Sydney B2B Location
            -item.quantity
          )
        }
      }
    }

    return new StepResponse({ success: true })
  }
)

export const approveB2BOrderWorkflow = createWorkflow(
  "approve-b2b-order",
  (input: ApproveB2BOrderInput) => {
    const order = updateB2BOrderStatusStep(input)
    processB2BInventoryStep(input)
    
    return new WorkflowResponse(order)
  }
)
