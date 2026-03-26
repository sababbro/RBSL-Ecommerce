"use client"

import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import { Menu, Globe, ChevronRight } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  "B2B Procurement": "/b2b",
  Account: "/account",
  Cart: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex items-center">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full items-center">
                <PopoverButton
                  data-testid="nav-menu-button"
                  className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-[10px] bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all focus:outline-none"
                >
                  <Menu size={14} className="text-meximco-accent" />
                  <span>Explore</span>
                </PopoverButton>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm pointer-events-auto transition-all"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="translate-x-[-100%]"
                enterTo="translate-x-0"
                leave="transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-[-100%]"
              >
                <PopoverPanel className="flex flex-col fixed left-0 top-0 w-full sm:w-[450px] h-full z-[51] bg-black/95 backdrop-blur-2xl border-r border-white/5 shadow-2xl overflow-hidden">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full justify-between p-8"
                  >
                    <div className="flex justify-between items-center mb-12">
                      <div className="flex items-center gap-3">
                         <img src="/logo.png" alt="Logo" className="h-8 w-auto grayscale brightness-200" />
                         <span className="text-white font-black tracking-widest text-sm italic">MENU</span>
                      </div>
                      <button 
                        data-testid="close-menu-button" 
                        onClick={close}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-white"
                      >
                        <XMark />
                      </button>
                    </div>

                    <ul className="flex flex-col gap-4 items-start justify-start flex-grow">
                      {Object.entries(SideMenuItems).map(([name, href]) => {
                        return (
                          <li key={name} className="w-full group">
                            <LocalizedClientLink
                              href={href}
                              className="text-4xl font-black text-white uppercase tracking-tighter hover:text-meximco-accent transition-all flex items-center justify-between"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              <span>{name}</span>
                              <ChevronRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-meximco-accent" size={32} />
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="flex flex-col gap-y-8 mt-auto pt-8 border-t border-white/5">
                      <div className="flex items-center gap-3 text-silver/60">
                        <Globe size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Preferences</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {!!locales?.length && (
                          <div
                            className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"
                            onMouseEnter={languageToggleState.open}
                            onMouseLeave={languageToggleState.close}
                          >
                            <LanguageSelect
                              toggleState={languageToggleState}
                              locales={locales}
                              currentLocale={currentLocale}
                            />
                            <ChevronRight size={16} className={clx("transition-transform duration-200 text-silver/40", languageToggleState.state ? "rotate-90" : "")} />
                          </div>
                        )}
                        <div
                          className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5"
                          onMouseEnter={countryToggleState.open}
                          onMouseLeave={countryToggleState.close}
                        >
                          {regions && (
                            <CountrySelect
                              toggleState={countryToggleState}
                              regions={regions}
                            />
                          )}
                          <ChevronRight size={16} className={clx("transition-transform duration-200 text-silver/40", countryToggleState.state ? "rotate-90" : "")} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Text className="text-[10px] font-bold text-silver/20 uppercase tracking-[0.2em]">
                          © {new Date().getFullYear()} RBSL — Royal Bengal Shrooms Ltd.
                        </Text>
                        <Text className="text-[9px] text-silver/10 italic">
                          Meximco™ Brand — Since 2024
                        </Text>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
