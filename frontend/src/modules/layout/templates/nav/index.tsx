import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

import MeximcoNav from "./meximco-nav"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <MeximcoNav 
      regions={regions} 
      locales={locales} 
      currentLocale={currentLocale} 
      cartButton={<CartButton />}
      sideMenu={<SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />}
    />
  )
}
