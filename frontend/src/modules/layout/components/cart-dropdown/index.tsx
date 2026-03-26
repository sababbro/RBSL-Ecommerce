"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { ShoppingBag } from "lucide-react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    itemRef.current = totalItems
  }, [totalItems, pathname])

  return (
    <div
      className="h-full z-50 flex items-center"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full flex items-center">
        <PopoverButton className="h-full focus:outline-none">
          <LocalizedClientLink
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-white font-medium text-xs group"
            href="/cart"
            data-testid="nav-cart-link"
          >
            <ShoppingBag size={16} className="text-meximco-accent group-hover:scale-110 transition-transform" />
            <span>Bag</span>
            <span className="w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-[10px] font-bold">
              {totalItems}
            </span>
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+12px)] right-0 bg-black/90 backdrop-blur-xl border border-white/10 w-[420px] text-white rounded-2xl shadow-2xl overflow-hidden"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-6 border-b border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-silver/60">Your Procurement Bag</h3>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-auto max-h-[400px] px-6 py-4 grid grid-cols-1 gap-y-6 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[80px_1fr] gap-x-4 group/item"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-20 aspect-square rounded-xl overflow-hidden border border-white/5"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                            className="grayscale contrast-125 group-hover/item:grayscale-0 transition-all duration-base"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-1">
                              <h3 className="text-sm font-bold text-white line-clamp-1">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  data-testid="product-link"
                                >
                                  {item.title}
                                </LocalizedClientLink>
                              </h3>
                              <LineItemOptions
                                variant={item.variant}
                                className="text-[10px] text-silver/40 uppercase font-medium"
                              />
                            </div>
                            <div className="text-sm font-bold">
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                             <span className="text-[10px] font-bold text-silver/60">QTY: {item.quantity}</span>
                             <DeleteButton
                               id={item.id}
                               className="text-[10px] font-bold uppercase tracking-tighter text-red-400/60 hover:text-red-400 transition-colors"
                             >
                               Remove
                             </DeleteButton>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-6 bg-white/5 flex flex-col gap-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-silver/60">Subtotal</span>
                    <span className="text-lg font-black text-white">
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart">
                    <button className="w-full py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-silver transition-colors">
                      Review & Checkout
                    </button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="py-20 px-10 flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-silver/20">
                   <ShoppingBag size={32} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold">Your bag is empty</span>
                  <span className="text-xs text-silver/40">Ready for your first scientific procurement?</span>
                </div>
                <LocalizedClientLink href="/store">
                  <button onClick={close} className="px-8 py-2.5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                    Explore Store
                  </button>
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
