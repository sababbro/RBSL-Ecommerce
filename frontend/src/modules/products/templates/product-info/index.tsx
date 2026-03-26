import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-y-6">

      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em] hover:text-white/60 transition-colors"
          data-testid="product-collection"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}

      <h1
        className="text-4xl small:text-5xl font-black uppercase tracking-tighter text-white italic leading-none"
        data-testid="product-title"
      >
        {product.title}
      </h1>

      {product.subtitle && (
        <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest">
          {product.subtitle}
        </p>
      )}

      {product.description && (
        <p
          className="text-sm text-white/60 leading-relaxed whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </p>
      )}
    </div>
  )
}

export default ProductInfo
