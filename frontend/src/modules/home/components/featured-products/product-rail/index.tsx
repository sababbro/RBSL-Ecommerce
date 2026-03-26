import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="py-12 first:pt-0">
      <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black uppercase tracking-widest text-white italic">
            {collection.title}
          </h2>
          <span className="text-[10px] text-silver/40 font-bold uppercase tracking-[0.3em]">
            Selected Excellence
          </span>
        </div>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          <span className="text-[10px] font-bold uppercase tracking-widest hover:text-meximco-accent transition-colors">
            View Collection →
          </span>
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
