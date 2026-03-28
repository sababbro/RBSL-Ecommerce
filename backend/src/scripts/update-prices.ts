import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function addBDTPrices({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  const productModuleService = container.resolve(Modules.PRODUCT);
  const regionModuleService = container.resolve(Modules.REGION);

  logger.info("Getting Bangladesh region...");
  const regions = await regionModuleService.listRegions({ name: "Bangladesh" });
  
  if (!regions || regions.length === 0) {
    logger.error("Bangladesh region not found.");
    return;
  }

  const bangladeshRegion = regions[0];
  logger.info(`Found Bangladesh region: ${bangladeshRegion.id}`);

  logger.info("Getting products...");
  const products = await productModuleService.listProducts({}, {
    relations: ["variants"],
  });
  
  logger.info(`Found ${products.length} products`);

  // BDT prices in paisa (1 BDT = 100 paisa)
  const priceMapping: Record<string, Record<string, number>> = {
    "sweatpants": { default: 9990 },
    "sweatshirt": { default: 9990 },
    "hoodie": { default: 9990 },
    "t-shirt": { default: 4990 },
    "long-sleeve": { default: 5990 },
    "shorts": { default: 4990 },
    "premium-dried-shiitake-s01": { "500g": 85000, "1kg": 150000 },
    "lions-mane-extract-n02": { "Standard 50ml": 250000 },
    "reishi-spore-powder-v03": { "100g Jar": 350000 },
    "lions-mane-scientific": { default: 250000 },
    "shitake": { default: 85000 },
  };

  for (const product of products) {
    const handle = product.handle || "";
    const priceMap = priceMapping[handle] || { default: 9990 };
    
    logger.info(`Processing: ${product.title} (${handle})`);

    for (const variant of product.variants || []) {
      const price = priceMap[variant.title!] || priceMap.default || 9990;
      
      logger.info(`  ${variant.title}: ${price} paisa (${price / 100} BDT)`);

      try {
        // Update variant with prices using direct service call
        await productModuleService.upsertProductVariants([
          {
            id: variant.id,
            prices: [
              {
                amount: price,
                currency_code: "bdt",
              },
            ],
          },
        ]);
        
        logger.info(`    ✓ Updated`);
      } catch (err: any) {
        logger.error(`    Error: ${err.message}`);
      }
    }
  }

  logger.info("✅ Done!");
}
