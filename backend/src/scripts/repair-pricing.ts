import { repairPricingWorkflow } from "../workflows/repair-pricing"

export default async function repairPricing({ container }: { container: any }) {
  console.log("Starting pricing repair surgery...")
  const { result } = await repairPricingWorkflow(container).run()
  console.log("Repair finished.", result)
}
