import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { 
  linkSalesChannelsToStockLocationWorkflow,
  createShippingOptionsWorkflow
} from "@medusajs/medusa/core-flows";

export default async function fixShipping({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
  const link = container.resolve("link");
  const query = container.resolve("query");

  logger.info("Getting Dhaka stock location...");
  const stockLocations = await stockLocationModuleService.listStockLocations({
    name: "Dhaka Extraction Facility",
  });
  
  if (!stockLocations || stockLocations.length === 0) {
    logger.error("Dhaka stock location not found.");
    return;
  }

  const dhakaLocation = stockLocations[0];
  logger.info(`Found Dhaka location: ${dhakaLocation.id}`);

  // Get existing fulfillment sets
  const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({});
  const dhakaFulfillmentSet = fulfillmentSets.find(fs => fs.name === "Dhaka Unit Delivery");
  
  if (!dhakaFulfillmentSet) {
    logger.error("Dhaka Unit Delivery fulfillment set not found.");
    return;
  }
  logger.info(`Found fulfillment set: ${dhakaFulfillmentSet.id}`);

  // Get service zones
  const serviceZones = await fulfillmentModuleService.listServiceZones({
    fulfillment_set_id: dhakaFulfillmentSet.id,
  });
  
  if (!serviceZones || serviceZones.length === 0) {
    logger.error("No service zones found.");
    return;
  }
  
  const serviceZone = serviceZones[0];
  logger.info(`Found service zone: ${serviceZone.id}`);

  // Link fulfillment set to stock location
  logger.info("Linking fulfillment set to stock location...");
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: dhakaLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: dhakaFulfillmentSet.id,
      },
    });
    logger.info("Linked fulfillment set to stock location.");
  } catch (err: any) {
    logger.info(`Link might already exist: ${err.message}`);
  }

  // Get shipping profile
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  
  if (!shippingProfiles || shippingProfiles.length === 0) {
    logger.error("No shipping profiles found.");
    return;
  }
  
  const shippingProfile = shippingProfiles[0];
  logger.info(`Using shipping profile: ${shippingProfile.id}`);

  // Delete existing shipping options without rules
  const existingOptions = await fulfillmentModuleService.listShippingOptions({
    service_zone_id: serviceZone.id,
  });
  
  for (const option of existingOptions) {
    logger.info(`Deleting shipping option: ${option.id} (${option.name})`);
    await fulfillmentModuleService.deleteShippingOptions([option.id]);
  }

  // Create new shipping options with rules
  logger.info("Creating shipping options with rules...");
  
  const shippingOptions = await fulfillmentModuleService.createShippingOptions([
    {
      name: "Dhaka Unit Standard Delivery",
      price_type: "flat",
      provider_id: "manual_manual",
      service_zone_id: serviceZone.id,
      shipping_profile_id: shippingProfile.id,
      type: {
        label: "Standard",
        description: "3-5 business days within Bangladesh",
        code: "dhaka-standard",
      },
      rules: [
        { attribute: "enabled_in_store", operator: "eq", value: "true" },
        { attribute: "is_return", operator: "eq", value: "false" },
      ],
    },
    {
      name: "Dhaka Unit Express Delivery",
      price_type: "flat",
      provider_id: "manual_manual",
      service_zone_id: serviceZone.id,
      shipping_profile_id: shippingProfile.id,
      type: {
        label: "Express",
        description: "1-2 business days within Dhaka",
        code: "dhaka-express",
      },
      rules: [
        { attribute: "enabled_in_store", operator: "eq", value: "true" },
        { attribute: "is_return", operator: "eq", value: "false" },
      ],
    },
  ]);

  for (const option of shippingOptions) {
    logger.info(`Created shipping option: ${option.id} (${option.name})`);
    
    // Add BDT prices
    try {
      await fulfillmentModuleService.addShippingOptionPrices(option.id, [
        { currency_code: "bdt", amount: option.name.includes("Standard") ? 15000 : 30000 },
      ]);
      logger.info(`  Added BDT price`);
    } catch (err: any) {
      logger.error(`  Error adding price: ${err.message}`);
    }
  }

  logger.info("✅ Shipping setup complete!");
}
