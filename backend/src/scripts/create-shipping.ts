import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function createShipping({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const regionModuleService = container.resolve(Modules.REGION);
  const link = container.resolve("link");

  logger.info("Getting Bangladesh region...");
  const regions = await regionModuleService.listRegions({ name: "Bangladesh" });
  
  if (!regions || regions.length === 0) {
    logger.error("Bangladesh region not found.");
    return;
  }

  const bangladeshRegion = regions[0];
  logger.info(`Found Bangladesh region: ${bangladeshRegion.id}`);

  // List existing fulfillment sets
  logger.info("Listing fulfillment sets...");
  const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({});
  logger.info(`Found ${fulfillmentSets.length} fulfillment sets`);

  let fulfillmentSet;
  
  // Check if Dhaka Unit Delivery already exists
  const existingSet = fulfillmentSets.find(fs => fs.name === "Dhaka Unit Delivery");
  
  if (existingSet) {
    fulfillmentSet = existingSet;
    logger.info(`Using existing fulfillment set: ${fulfillmentSet.id}`);
  } else {
    // Create fulfillment set
    logger.info("Creating fulfillment set...");
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Dhaka Unit Delivery",
      type: "shipping",
    });
    logger.info(`Created fulfillment set: ${fulfillmentSet.id}`);

    // Create service zone
    logger.info("Creating service zone...");
    const serviceZone = await fulfillmentModuleService.createServiceZones({
      name: "Bangladesh",
      fulfillment_set_id: fulfillmentSet.id,
      geo_zones: [{
        type: "country",
        country_code: "bd",
      }],
    });
    logger.info(`Created service zone: ${serviceZone.id}`);
  }

  // Get the service zone
  const serviceZones = await fulfillmentModuleService.listServiceZones({
    fulfillment_set_id: fulfillmentSet.id,
  });
  
  if (!serviceZones || serviceZones.length === 0) {
    logger.error("No service zones found for fulfillment set");
    return;
  }

  const serviceZone = serviceZones[0];
  logger.info(`Using service zone: ${serviceZone.id}`);

  // Get shipping profile
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  
  if (!shippingProfiles || shippingProfiles.length === 0) {
    logger.error("No shipping profiles found");
    return;
  }

  const shippingProfile = shippingProfiles[0];
  logger.info(`Using shipping profile: ${shippingProfile.id}`);

  // List existing shipping options
  const existingOptions = await fulfillmentModuleService.listShippingOptions({
    service_zone_id: serviceZone.id,
  });
  logger.info(`Found ${existingOptions.length} existing shipping options`);

  // Create shipping options if they don't exist
  const optionsToCreate = [
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
      prices: [
        { currency_code: "bdt", amount: 15000 }, // 150 BDT
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
      prices: [
        { currency_code: "bdt", amount: 30000 }, // 300 BDT
      ],
    },
  ];

  for (const option of optionsToCreate) {
    const exists = existingOptions.find(o => o.name === option.name);
    if (exists) {
      logger.info(`Shipping option "${option.name}" already exists: ${exists.id}`);
      continue;
    }

    try {
      logger.info(`Creating shipping option: ${option.name}`);
      const created = await fulfillmentModuleService.createShippingOptions(option);
      logger.info(`Created shipping option: ${created.id}`);
    } catch (err: any) {
      logger.error(`Error creating shipping option: ${err.message}`);
    }
  }

  logger.info("✅ Shipping setup complete!");
}
