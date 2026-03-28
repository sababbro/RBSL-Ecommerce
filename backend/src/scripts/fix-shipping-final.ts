import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function fixShippingFinal({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  logger.info("Getting shipping options...");
  
  // List all shipping options
  const allOptions = await fulfillmentModuleService.listShippingOptions({});
  logger.info(`Found ${allOptions.length} total shipping options`);

  // Delete Dhaka options
  const dhakaOptions = allOptions.filter(o => o.name.includes("Dhaka"));
  for (const option of dhakaOptions) {
    logger.info(`Deleting: ${option.name} (${option.id})`);
    try {
      await fulfillmentModuleService.deleteShippingOptions([option.id]);
    } catch (err: any) {
      logger.error(`  Error deleting: ${err.message}`);
    }
  }

  // Get service zone
  const serviceZones = await fulfillmentModuleService.listServiceZones({
    name: "Bangladesh Domestic"
  });
  
  if (!serviceZones || serviceZones.length === 0) {
    logger.error("No service zone found");
    return;
  }
  
  const serviceZone = serviceZones[0];
  logger.info(`Using service zone: ${serviceZone.id}`);

  // Get shipping profile
  const profiles = await fulfillmentModuleService.listShippingProfiles({});
  const profile = profiles.find(p => p.type === "default");
  
  if (!profile) {
    logger.error("No shipping profile found");
    return;
  }
  logger.info(`Using profile: ${profile.id}`);

  // Create shipping options with prices
  logger.info("Creating shipping options with prices...");
  
  const options = [
    {
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
      prices: [
        { currency_code: "bdt", amount: 15000 }
      ],
    },
    {
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
      prices: [
        { currency_code: "bdt", amount: 30000 }
      ],
    },
  ];

  for (const optionData of options) {
    try {
      const created = await fulfillmentModuleService.createShippingOptions(optionData);
      logger.info(`Created: ${created.name} (${created.id})`);
    } catch (err: any) {
      logger.error(`Error creating ${optionData.name}: ${err.message}`);
    }
  }

  logger.info("✅ Done!");
}
