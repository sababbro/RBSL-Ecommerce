import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function addShippingPrices({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  logger.info("Getting shipping options...");
  
  const shippingOptions = await fulfillmentModuleService.listShippingOptions({
    name: { $ilike: "%Dhaka%" }
  });

  logger.info(`Found ${shippingOptions.length} Dhaka shipping options`);

  for (const option of shippingOptions) {
    logger.info(`Processing: ${option.name} (${option.id})`);
    
    try {
      // Create price set with BDT price
      const priceSet = await fulfillmentModuleService.createPriceSets({
        prices: [
          {
            amount: option.name.includes("Standard") ? 15000 : 30000,
            currency_code: "bdt",
          },
        ],
      });

      logger.info(`  Created price set: ${priceSet.id}`);

      // Update shipping option with price set
      await fulfillmentModuleService.updateShippingOptions({
        id: option.id,
        price_set_id: priceSet.id,
      });

      logger.info(`  Updated shipping option with price set`);
    } catch (err: any) {
      logger.error(`  Error: ${err.message}`);
    }
  }

  logger.info("✅ Done!");
}
