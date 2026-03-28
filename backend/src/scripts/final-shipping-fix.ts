import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function finalShippingFix({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

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

  // Delete existing Dhaka Unit options
  const allOptions = await fulfillmentModuleService.listShippingOptions({});
  const dhakaOptions = allOptions.filter(o => o.name.includes("Dhaka Unit"));
  
  for (const option of dhakaOptions) {
    logger.info(`Deleting: ${option.name}`);
    try {
      await fulfillmentModuleService.deleteShippingOptions([option.id]);
    } catch (err: any) {
      logger.error(`  Error: ${err.message}`);
    }
  }

  // Create shipping options WITHOUT prices first, then add prices separately
  logger.info("Creating shipping options...");
  
  const standardOption = await fulfillmentModuleService.createShippingOptions({
    name: "Dhaka Unit Standard Delivery",
    price_type: "flat",
    provider_id: "manual_manual",
    service_zone_id: serviceZone.id,
    shipping_profile_id: profile.id,
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

  const expressOption = await fulfillmentModuleService.createShippingOptions({
    name: "Dhaka Unit Express Delivery",
    price_type: "flat",
    provider_id: "manual_manual",
    service_zone_id: serviceZone.id,
    shipping_profile_id: profile.id,
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

  // Now set prices using setShippingOptionsPrice
  logger.info("Setting prices...");
  
  try {
    await fulfillmentModuleService.setShippingOptionsPrices([
      { id: standardOption.id, prices: [{ currency_code: "bdt", amount: 15000 }] },
    ]);
    logger.info("Set standard price");
  } catch (err: any) {
    logger.error(`Error setting standard price: ${err.message}`);
  }

  try {
    await fulfillmentModuleService.setShippingOptionsPrices([
      { id: expressOption.id, prices: [{ currency_code: "bdt", amount: 30000 }] },
    ]);
    logger.info("Set express price");
  } catch (err: any) {
    logger.error(`Error setting express price: ${err.message}`);
  }

  logger.info("✅ Done!");
}
