import { notFound } from "next/navigation"
import { Suspense, Fragment } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="bg-black min-h-screen"
      data-testid="category-container"
    >
      <div className="max-w-container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="lg:w-64 shrink-0">
             <RefinementList sortBy={sort} data-testid="sort-by-container" />
          </aside>
          
          <div className="flex-1">
            <div className="flex flex-col gap-8 mb-16">
              <nav className="flex items-center gap-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-silver/40">
                <LocalizedClientLink href="/store" className="hover:text-white transition-colors">Store</LocalizedClientLink>
                <span>/</span>
                {parents &&
                  parents.reverse().map((parent) => (
                    <Fragment key={parent.id}>
                      <LocalizedClientLink
                        className="hover:text-white transition-colors"
                        href={`/categories/${parent.handle}`}
                      >
                        {parent.name}
                      </LocalizedClientLink>
                      <span>/</span>
                    </Fragment>
                  ))}
                <span className="text-white">{category.name}</span>
              </nav>

              <div className="flex flex-col gap-4">
                <h1 className="text-5xl font-black uppercase tracking-tighter text-white italic" data-testid="category-page-title">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-silver/60 max-w-2xl leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>

              {category.category_children && category.category_children.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {category.category_children?.map((c) => (
                    <LocalizedClientLink
                      key={c.id}
                      href={`/categories/${c.handle}`}
                      className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  ))}
                </div>
              )}
            </div>

            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={category.products?.length ?? 8}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
