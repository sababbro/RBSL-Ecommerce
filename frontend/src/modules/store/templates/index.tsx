import { Suspense } from "react"
import { retrieveCustomer } from "@lib/data/customer"
import B2BCatalog from "@modules/common/components/b2b-catalog"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  
  const customer = await retrieveCustomer() as any
  const isWholesale = customer?.customer_groups?.some((group: any) => group.name === "wholesale")

  return (
    <div
      className="bg-black min-h-screen"
      data-testid="category-container"
    >
      <div className="max-w-container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="lg:w-64 shrink-0">
             <RefinementList sortBy={sort} />
          </aside>
          
          <div className="flex-1">
            <div className="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em] mb-3">
                  RBSL — Royal Bengal Shrooms Ltd.
                </p>
                <h1 className="text-5xl font-black uppercase tracking-tighter text-white italic" data-testid="store-page-title">
                  Scientific Series
                </h1>
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] mt-2 block">
                  Pharmaceutical-grade mushroom extracts &amp; specialty products
                </span>
              </div>

              {isWholesale && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-1000">
                  <B2BCatalog />
                </div>
              )}
            </div>
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
