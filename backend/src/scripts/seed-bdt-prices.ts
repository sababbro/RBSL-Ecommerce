import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

export default async function seedBDTPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const pricingModuleService = container.resolve(Modules.PRICING);
  const regionModuleService = container.resolve(Modules.REGION);

  logger.info("Getting Bangladesh region...");
  const regions = await regionModuleService.listRegions({
    name: "Bangladesh",
  });

  if (!regions.length) {
    logger.error("Bangladesh region not found. Please run seed-bangladesh.ts first.");
    return;
  }

  const bangladeshRegion = regions[0];
  logger.info(`Found Bangladesh region: ${bangladeshRegion.id}`);

  // Get all products
  const products = await productModuleService.listProducts({});
  logger.info(`Found ${products.length} products`);

  // BDT prices for RBSL products (in paisa - smallest unit)
  const bdtPriceMap: Record<string, number> = {
    "premium-dried-shiitake-s01": {
      "500g": 85000,   // 850 BDT
      "1kg": 150000,   // 1500 BDT
    },
    "lions-mane-extract-n02": {
      "Standard 50ml": 250000, // 2500 BDT
    },
    "reishi-spore-powder-v03": {
      "100g Jar": 350000, // 3500 BDT
    },
    // Default Medusa products - convert EUR to BDT (1 EUR ≈ 120 BDT)
    "sweatpants": {
      "S": 108000, // 900 EUR * 120 = 108,000 paisa
      "M": 108000,
      "L": 108000,
      "XL": 108000,
    },
    "sweatshirt": {
      "S": 96000, // 800 EUR * 120 = 96,000 paisa
      "M": 96000,
      "L": 96000,
      "XL": 96000,
    },
  };

  for (const product of products) {
    logger.info(`Processing product: ${product.title} (${product.handle})`);

    const variants = await productModuleService.listProductVariants({
      product_id: product.id,
    });

    for (const variant of variants) {
      const priceKey = bdtPriceMap[product.handle!]?.[variant.title!];
      
      if (priceKey) {
        logger.info(`  Adding BDT price for variant ${variant.title}: ${priceKey} paisa (${priceKey / 100} BDT)`);
        
        // Create price set for the variant
        const priceSet = await pricingModuleService.createPriceSets({
          prices: [
            {
              amount: priceKey,
              currency_code: "bdt",
              min_quantity: 1,
              max_quantity: null,
            },
          ],
        });

        // Link price set to variant
        await productModuleService.upsertProductVariants([
          {
            id: variant.id,
            prices: [
              {
                amount: priceKey,
                currency_code: "bdt",
              },
            ],
          },
        ]);
      } else {
        logger.info(`  No BDT price configured for variant ${variant.title}`);
      }
    }
  }

  logger.info("✅ BDT prices added successfully!");
}
