"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-[10px] font-bold uppercase tracking-widest text-silver/60 py-2"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90" />
              <span>Dashboard</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="text-xl font-black uppercase italic text-white mb-6 px-4">
              Hello {customer?.first_name}
            </div>
            <div className="text-sm">
              <ul className="flex flex-col gap-1">
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between py-4 border-b border-white/5 px-4 text-silver/60 hover:text-white transition-colors"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-3">
                        <User size={18} />
                        <span className="font-bold uppercase tracking-widest text-[11px]">Profile</span>
                      </div>
                      <ChevronDown className="transform -rotate-90 opacity-40" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between py-4 border-b border-white/5 px-4 text-silver/60 hover:text-white transition-colors"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-3">
                        <MapPin size={18} />
                        <span className="font-bold uppercase tracking-widest text-[11px]">Addresses</span>
                      </div>
                      <ChevronDown className="transform -rotate-90 opacity-40" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between py-4 border-b border-white/5 px-4 text-silver/60 hover:text-white transition-colors"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-3">
                      <Package size={18} />
                      <span className="font-bold uppercase tracking-widest text-[11px]">Orders</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 opacity-40" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-white/5 px-4 w-full text-silver/60 hover:text-white transition-colors group"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-3">
                      <ArrowRightOnRectangle className="transform group-hover:translate-x-1 transition-transform" />
                      <span className="font-bold uppercase tracking-widest text-[11px]">Log out</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
        <div className="sticky top-24">
          <div className="pb-8 border-b border-white/5 mb-8">
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Corporate Account</h3>
          </div>
          <div className="text-sm">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-2">
              <li className="w-full">
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                >
                  Dashboard
                </AccountNavLink>
              </li>
              <li className="w-full">
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                >
                  Profile Details
                </AccountNavLink>
              </li>
              <li className="w-full">
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  Shipping Fleet
                </AccountNavLink>
              </li>
              <li className="w-full">
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  Order History
                </AccountNavLink>
              </li>
              <li className="mt-8 pt-8 border-t border-white/5 w-full">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-silver/40 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group"
                  data-testid="logout-button"
                >
                  <ArrowRightOnRectangle className="group-hover:translate-x-1 transition-transform" />
                  Terminal Exit
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "text-[11px] font-bold uppercase tracking-[0.2em] transition-all block w-full py-3 px-4 rounded-xl border border-transparent hover:bg-white/5",
        {
          "text-white bg-white/5 border-white/10": active,
          "text-silver/40": !active,
        }
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
