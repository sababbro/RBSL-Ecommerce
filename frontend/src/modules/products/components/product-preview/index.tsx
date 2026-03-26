import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { clx } from "@medusajs/ui"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block h-full">
      <div 
        data-testid="product-wrapper"
        className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[0.75rem] overflow-hidden transition-all duration-base hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl flex flex-col"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="transition-transform duration-slow group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-base" />
        </div>
        
        <div className="p-6 flex flex-col flex-grow justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-meximco-accent transition-colors" data-testid="product-title">
              {product.title}
            </h3>
            <span className="text-[10px] text-silver/40 font-bold uppercase tracking-widest">
              Premium Collection
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-x-2 text-white font-semibold">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
            <span className="text-[10px] font-bold text-white bg-white/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all">
              Details →
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
