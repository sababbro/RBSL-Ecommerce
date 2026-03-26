import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-white/5 animate-pulse rounded-lg" />
  }

  return (
    <div className="flex flex-col gap-1 py-4 border-t border-b border-white/5">
      <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em]">
        {variant ? "Retail Price" : "Starting From"}
      </span>
      <div className="flex items-baseline gap-3">
        <span
          className={clx("text-3xl font-black italic text-white tabular-nums", {
            "text-white": selectedPrice.price_type !== "sale",
          })}
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
        {selectedPrice.price_type === "sale" && (
          <span
            className="text-white/30 line-through text-base font-bold"
            data-testid="original-product-price"
          >
            {selectedPrice.original_price}
          </span>
        )}
      </div>
      {selectedPrice.price_type === "sale" && (
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-green-400">
          Save {selectedPrice.percentage_diff}%
        </span>
      )}
    </div>
  )
}
