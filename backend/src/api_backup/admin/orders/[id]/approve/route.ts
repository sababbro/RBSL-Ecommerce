import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { approveB2BOrderWorkflow } from "../../../../../workflows/approve-b2b-order"

/**
 * Custom Admin Endpoint to Approve B2B Orders.
 * POST /admin/orders/[id]/approve
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    const { result } = await approveB2BOrderWorkflow(req.scope).run({
      input: {
        order_id: id
      }
    });

    res.status(200).json({ 
      message: "Order approved successfully", 
      order: result 
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message || "An error occurred during B2B approval Workflow" 
    });
  }
}
