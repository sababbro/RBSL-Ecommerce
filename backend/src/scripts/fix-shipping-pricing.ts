import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function fixShippingPricing({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const pricingModuleService = container.resolve(Modules.PRICING);

  logger.info("Getting shipping options...");
  
  const allOptions = await fulfillmentModuleService.listShippingOptions({});
  const dhakaOptions = allOptions.filter(o => o.name.includes("Dhaka Unit"));
  
  logger.info(`Found ${dhakaOptions.length} Dhaka Unit options`);

  for (const option of dhakaOptions) {
    logger.info(`Processing: ${option.name} (${option.id})`);
    
    // Check if option already has a price set
    if (option.price_set_id) {
      logger.info(`  Has price set: ${option.price_set_id}`);
      
      // Add BDT price to existing price set
      try {
        await pricingModuleService.addPrices({
          priceSetId: option.price_set_id,
          prices: [
            {
              amount: option.name.includes("Standard") ? 15000 : 30000,
              currency_code: "bdt",
            },
          ],
        });
        logger.info(`  Added BDT price to existing price set`);
      } catch (err: any) {
        logger.error(`  Error adding price: ${err.message}`);
      }
    } else {
      logger.info(`  No price set, creating one...`);
      
      // Create a new price set
      try {
        const priceSet = await pricingModuleService.createPriceSets({
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
        
        logger.info(`  Linked price set to shipping option`);
      } catch (err: any) {
        logger.error(`  Error: ${err.message}`);
      }
    }
  }

  logger.info("✅ Done!");
}
