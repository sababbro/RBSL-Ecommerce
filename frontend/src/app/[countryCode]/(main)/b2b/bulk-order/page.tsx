import WholesaleMatrix from "@modules/b2b/components/wholesale-matrix"
import { sdk } from "@lib/config"

async function getScientificSeries() {
  const { products } = await sdk.store.product.list({
    handle: [
      "premium-dried-shiitake-s01",
      "lions-mane-extract-n02",
      "reishi-spore-powder-v03"
    ]
  })

  return products.map(p => {
    const variant = (p.variants?.[0] as any)
    return {
      id: p.id,
      title: p.title || "Unknown Product",
      sku: variant?.sku || "No SKU",
      price: variant?.prices?.[0]?.amount || 0,
      quantity: 0,
      inventory: variant?.inventory_quantity ?? null
    }
  })
}

export default async function BulkOrderPage() {
  const items = await getScientificSeries()

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic uppercase">
          Scientific Series Order Matrix
        </h1>
        <p className="text-white/40 text-sm font-medium">
          RBSL — Royal Bengal Shrooms Ltd. | Meximco™ Wholesale Procurement
        </p>
        <p className="text-white/20 text-xs mt-2">
          Select volumes to initialize your B2B acquisition. Optimized for pharmaceutical-grade biological standards.
        </p>
      </div>
      
      <WholesaleMatrix initialItems={items} />
    </div>
  )
}
