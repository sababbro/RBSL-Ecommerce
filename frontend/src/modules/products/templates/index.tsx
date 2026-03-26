import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Extract scientific metadata from product tags or metadata
  const meta = (product as any).metadata as Record<string, string> | undefined
  const polysaccharide = meta?.polysaccharide_content || meta?.polysaccharide || null
  const extractionPurity = meta?.extraction_purity || meta?.purity || null
  const extractionMethod = meta?.extraction_method || null
  const certifications = meta?.certifications || null
  const isScientificSeries =
    product.title?.toLowerCase().includes("scientific") ||
    product.collection?.title?.toLowerCase().includes("scientific") ||
    !!(polysaccharide || extractionPurity)

  return (
    <div className="bg-black min-h-screen" data-testid="product-container">

      {/* Hero PDP area */}
      <div className="max-w-[1440px] mx-auto px-6 pt-12 pb-0">

        {/* Breadcrumb / Collection Label */}
        {product.collection && (
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-6 bg-white/20" />
            <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em]">
              {product.collection.title}
            </span>
          </div>
        )}

        {/* Wholesale Badge for non-authenticated users */}
        <div className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
          <span className="text-[9px] text-white/60 font-bold uppercase tracking-[0.3em]">
            Wholesale Pricing Available — Apply for B2B Account
          </span>
        </div>

        {/* Main 3-col layout */}
        <div className="flex flex-col small:flex-row gap-8 small:gap-16 small:items-start py-8">

          {/* Left: Info + Tabs */}
          <div className="flex flex-col small:sticky small:top-32 small:max-w-[340px] w-full gap-y-10">
            <ProductInfo product={product} />

            {/* Scientific Specs card */}
            {isScientificSeries && (
              <div className="border border-white/10 rounded-2xl overflow-hidden">
                <div className="bg-white/5 px-6 py-4 border-b border-white/5">
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em]">
                    Technical Specification
                  </p>
                </div>
                <div className="px-6 py-5 flex flex-col gap-4">
                  {polysaccharide && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                        Polysaccharide Content
                      </span>
                      <span className="text-white font-black text-sm font-mono">{polysaccharide}</span>
                    </div>
                  )}
                  {extractionPurity && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                        Extraction Purity
                      </span>
                      <span className="text-white font-black text-sm font-mono">{extractionPurity}</span>
                    </div>
                  )}
                  {extractionMethod && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                        Extraction Method
                      </span>
                      <span className="text-white font-black text-sm">{extractionMethod}</span>
                    </div>
                  )}
                  {certifications && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                        Certifications
                      </span>
                      <span className="text-white font-black text-sm">{certifications}</span>
                    </div>
                  )}
                  {!polysaccharide && !extractionPurity && !extractionMethod && (
                    <p className="text-[10px] text-white/20 italic">
                      Full lab report available upon request.
                    </p>
                  )}
                </div>
              </div>
            )}

            <ProductTabs product={product} />
          </div>

          {/* Center: Image Gallery */}
          <div className="block w-full flex-1">
            <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <ImageGallery images={images} />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col small:sticky small:top-32 small:max-w-[300px] w-full gap-y-8">
            <ProductOnboardingCta />
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>

            {/* B2B CTA */}
            <div className="border border-dashed border-white/10 rounded-2xl p-5 text-center">
              <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em] mb-2">
                Buying in bulk?
              </p>
              <p className="text-[10px] text-white/50 mb-4 leading-relaxed">
                Apply for a verified B2B account to unlock wholesale tiers and priority sourcing.
              </p>
              <a
                href="/account/b2b/apply"
                className="inline-block text-[9px] font-black uppercase tracking-[0.3em] text-black bg-white rounded-xl px-6 py-2.5 hover:bg-white/90 transition-colors"
              >
                Apply for B2B Access
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-[1440px] mx-auto px-6 py-24" data-testid="related-products-container">
        <div className="border-t border-white/5 pt-16">
          <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em] mb-4">
            Complete Your Procurement
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic mb-12">
            Related Products
          </h2>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>

    </div>
  )
}

export default ProductTemplate
