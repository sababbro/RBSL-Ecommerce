import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createShippingOptionsWorkflow } from "@medusajs/medusa/core-flows";

export default async function createShippingWithPrices({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const pricingModuleService = container.resolve(Modules.PRICING);

  logger.info("Getting service zone and profile...");
  
  const serviceZones = await fulfillmentModuleService.listServiceZones({
    name: "Bangladesh Domestic"
  });
  
  if (!serviceZones || serviceZones.length === 0) {
    logger.error("No service zone found");
    return;
  }
  
  const serviceZone = serviceZones[0];

  const profiles = await fulfillmentModuleService.listShippingProfiles({});
  const profile = profiles.find(p => p.type === "default");
  
  if (!profile) {
    logger.error("No shipping profile found");
    return;
  }

  // Delete existing Dhaka options
  const allOptions = await fulfillmentModuleService.listShippingOptions({});
  const dhakaOptions = allOptions.filter(o => o.name.includes("Dhaka"));
  
  for (const option of dhakaOptions) {
    logger.info(`Deleting: ${option.name}`);
    try {
      await fulfillmentModuleService.deleteShippingOptions([option.id]);
    } catch (err: any) {
      logger.error(`  Error: ${err.message}`);
    }
  }

  // Create price sets first
  logger.info("Creating price sets...");
  
  const standardPriceSet = await pricingModuleService.createPriceSets({
    prices: [{ amount: 15000, currency_code: "bdt" }]
  });
  logger.info(`Created standard price set: ${standardPriceSet.id}`);

  const expressPriceSet = await pricingModuleService.createPriceSets({
    prices: [{ amount: 30000, currency_code: "bdt" }]
  });
  logger.info(`Created express price set: ${expressPriceSet.id}`);

  // Create shipping options with price_set_id
  logger.info("Creating shipping options...");
  
  try {
    const standardOption = await fulfillmentModuleService.createShippingOptions({
      name: "Dhaka Unit Standard Delivery",
      price_type: "flat",
      provider_id: "manual_manual",
      service_zone_id: serviceZone.id,
      shipping_profile_id: profile.id,
      price_set_id: standardPriceSet.id,
      type: {
        label: "Standard",
        description: "3-5 business days within Bangladesh",
        code: "dhaka-standard",
      },
      rules: [
        { attribute: "enabled_in_store", operator: "eq", value: "true" },
        { attribute: "is_return", operator: "eq", value: "false" },
      ],
    });
    logger.info(`Created standard: ${standardOption.id}`);
  } catch (err: any) {
    logger.error(`Error creating standard: ${err.message}`);
  }

  try {
    const expressOption = await fulfillmentModuleService.createShippingOptions({
      name: "Dhaka Unit Express Delivery",
      price_type: "flat",
      provider_id: "manual_manual",
      service_zone_id: serviceZone.id,
      shipping_profile_id: profile.id,
      price_set_id: expressPriceSet.id,
      type: {
        label: "Express",
        description: "1-2 business days within Dhaka",
        code: "dhaka-express",
      },
      rules: [
        { attribute: "enabled_in_store", operator: "eq", value: "true" },
        { attribute: "is_return", operator: "eq", value: "false" },
      ],
    });
    logger.info(`Created express: ${expressOption.id}`);
  } catch (err: any) {
    logger.error(`Error creating express: ${err.message}`);
  }

  logger.info("✅ Done!");
}
