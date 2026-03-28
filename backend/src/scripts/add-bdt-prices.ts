import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function seedBDTPrices({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const productModuleService = container.resolve(Modules.PRODUCT);
  const pricingModuleService = container.resolve(Modules.PRICING);
  const regionModuleService = container.resolve(Modules.REGION);

  logger.info("Getting Bangladesh region...");
  const regions = await regionModuleService.listRegions({ name: "Bangladesh" });
  
  if (!regions.length) {
    logger.error("Bangladesh region not found.");
    return;
  }

  const bangladeshRegion = regions[0];
  logger.info(`Found Bangladesh region: ${bangladeshRegion.id}`);

  logger.info("Getting products...");
  const products = await productModuleService.listProducts({}, { 
    relations: ["variants"] 
  });
  
  logger.info(`Found ${products.length} products`);

  // BDT prices in paisa (1 BDT = 100 paisa)
  const priceMapping: Record<string, Record<string, number>> = {
    "sweatpants": { default: 9990 }, // 99.90 BDT
    "sweatshirt": { default: 9990 },
    "hoodie": { default: 9990 },
    "t-shirt": { default: 4990 }, // 49.90 BDT
    "long-sleeve": { default: 5990 },
    "shorts": { default: 4990 },
    "premium-dried-shiitake-s01": { "500g": 85000, "1kg": 150000 }, // 850 BDT, 1500 BDT
    "lions-mane-extract-n02": { "Standard 50ml": 250000 }, // 2500 BDT
    "reishi-spore-powder-v03": { "100g Jar": 350000 }, // 3500 BDT
  };

  for (const product of products) {
    const handle = product.handle || "";
    const priceMap = priceMapping[handle] || { default: 9990 };
    
    logger.info(`Processing product: ${product.title} (${handle})`);

    for (const variant of product.variants || []) {
      const price = priceMap[variant.title!] || priceMap.default || 9990;
      
      logger.info(`  Adding BDT price for ${variant.title}: ${price} paisa (${price / 100} BDT)`);

      try {
        // Create price set with BDT price
        const priceSet = await pricingModuleService.createPriceSets({
          prices: [
            {
              amount: price,
              currency_code: "bdt",
            },
          ],
        });

        logger.info(`    Created price set: ${priceSet.id}`);
      } catch (err: any) {
        logger.error(`    Error creating price set: ${err.message}`);
      }
    }
  }

  logger.info("✅ BDT prices setup complete!");
}
