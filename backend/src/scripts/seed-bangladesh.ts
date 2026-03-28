import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
  createStockLocationsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedBangladeshRegion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const storeModuleService = container.resolve(Modules.STORE);
  const regionModuleService = container.resolve(Modules.REGION);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  // Bangladesh country codes
  const bangladeshCountryCode = "bd";

  logger.info("Checking existing regions...");
  
  // Check if Bangladesh region already exists
  const existingRegions = await regionModuleService.listRegions({
    name: "Bangladesh",
  });

  if (existingRegions.length > 0) {
    logger.info("Bangladesh region already exists. Skipping...");
    return;
  }

  // Add BDT to supported currencies
  logger.info("Updating store to support BDT currency...");
  const [store] = await storeModuleService.listStores();
  
  await storeModuleService.updateStores(store.id, {
    supported_currencies: [
      ...(store.supported_currencies || []).map(c => ({
        currency_code: c.currency_code,
        is_default: c.is_default ?? false,
      })),
      {
        currency_code: "bdt",
        is_default: true, // Make BDT the default currency for Bangladesh
      },
    ],
  });

  logger.info("Creating Bangladesh region...");
  
  // Create Bangladesh region
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Bangladesh",
          currency_code: "bdt",
          countries: [bangladeshCountryCode],
          payment_providers: ["pp_system_default"],
          metadata: {
            unit: "Dhaka Unit",
            description: "Dhaka Extraction Facility - Direct Procurement",
          },
        },
      ],
    },
  });
  
  const bangladeshRegion = regionResult[0];
  logger.info(`Created Bangladesh region: ${bangladeshRegion.id}`);

  // Create tax region for Bangladesh
  logger.info("Creating tax region for Bangladesh...");
  await createTaxRegionsWorkflow(container).run({
    input: [
      {
        country_code: bangladeshCountryCode,
        provider_id: "tp_system",
      },
    ],
  });

  // Create stock location for Dhaka
  logger.info("Creating Dhaka stock location...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Dhaka Extraction Facility",
          address: {
            city: "Dhaka",
            country_code: "BD",
            address_1: "Dhaka Unit Central Facility",
            province: "Dhaka Division",
          },
          metadata: {
            unit: "Dhaka Unit",
            facility_type: "extraction",
          },
        },
      ],
    },
  });
  
  const dhakaStockLocation = stockLocationResult[0];
  logger.info(`Created Dhaka stock location: ${dhakaStockLocation.id}`);

  // Link fulfillment provider to stock location
  logger.info("Linking fulfillment provider to Dhaka location...");
  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: dhakaStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  // Get or create shipping profile
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: profileResult } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Default Shipping Profile",
            type: "default",
          },
        ],
      },
    });
    shippingProfile = profileResult[0];
  }

  // Create fulfillment set for Dhaka facility
  logger.info("Creating fulfillment set for Dhaka facility...");
  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Dhaka Unit Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Bangladesh Domestic",
        geo_zones: [
          {
            type: "country",
            country_code: bangladeshCountryCode,
          },
        ],
      },
    ],
  });

  // Create shipping options
  logger.info("Creating shipping options for Bangladesh...");
  await fulfillmentModuleService.createShippingOptions([
    {
      name: "Dhaka Unit Standard Delivery",
      price_type: "flat",
      amount: 15000, // 150 BDT in paisa
      service_zone_id: fulfillmentSet.service_zones[0].id,
      shipping_profile_id: shippingProfile.id,
      provider_id: "manual_manual",
      type: {
        label: "Standard",
        description: "3-5 business days within Bangladesh",
        code: "dhaka-standard",
      },
    },
    {
      name: "Dhaka Unit Express Delivery",
      price_type: "flat",
      amount: 30000, // 300 BDT in paisa
      service_zone_id: fulfillmentSet.service_zones[0].id,
      shipping_profile_id: shippingProfile.id,
      provider_id: "manual_manual",
      type: {
        label: "Express",
        description: "1-2 business days within Dhaka",
        code: "dhaka-express",
      },
    },
  ]);

  // Link stock location to region
  logger.info("Linking Dhaka location to Bangladesh region...");
  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: dhakaStockLocation.id,
    },
    [Modules.REGION]: {
      region_id: bangladeshRegion.id,
    },
  });

  logger.info("✅ Bangladesh region setup complete!");
  logger.info(`   Region ID: ${bangladeshRegion.id}`);
  logger.info(`   Currency: BDT (Bangladeshi Taka)`);
  logger.info(`   Country: Bangladesh (BD)`);
  logger.info(`   Stock Location: Dhaka Extraction Facility`);
  logger.info(`   Shipping: Standard (150 BDT) & Express (300 BDT)`);
}
