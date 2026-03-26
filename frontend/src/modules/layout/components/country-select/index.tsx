"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  const [current, setCurrent] = useState<CountryOption | undefined>(undefined)

  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  const { state, close } = toggleState

  const options = useMemo(() => {
    return (
      regions
        ?.map((r) => {
          return r.countries?.map((c) => ({
            country: c.iso_2 || "",
            region: r.id || "",
            label: c.display_name || "",
          }))
        })
        .flat()
        .filter((o): o is CountryOption => !!o)
        .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? "")) || []
    )
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options.find((o) => o.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
    close()
  }

  return (
    <div className="w-full">
      <Listbox
        as="div"
        onChange={handleChange}
        defaultValue={
          countryCode
            ? options.find((o) => o.country === countryCode)
            : undefined
        }
      >
        <ListboxButton className="w-full focus:outline-none">
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-silver/60">Region</span>
            {current && (
              <div className="flex items-center gap-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                {/* @ts-ignore */}
                <ReactCountryFlag
                  svg
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "2px",
                  }}
                  countryCode={current.country ?? ""}
                />
                <span className="text-[10px] font-bold text-white uppercase">{current.label}</span>
              </div>
            )}
          </div>
        </ListboxButton>
        <div className="relative">
          <Transition
            show={state}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <ListboxOptions
              className="absolute bottom-full left-0 mb-4 w-full max-h-[300px] overflow-y-auto z-[100] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 no-scrollbar"
              static
            >
              {options?.map((o, index) => {
                return (
                  <ListboxOption
                    key={index}
                    value={o}
                    className="group py-3 px-4 hover:bg-white/5 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-x-3">
                        {/* @ts-ignore */}
                        <ReactCountryFlag
                          svg
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "2px",
                          }}
                          countryCode={o?.country ?? ""}
                          className="grayscale group-hover:grayscale-0 transition-all"
                        />
                        <span className="text-[10px] font-bold text-silver/60 group-hover:text-white uppercase tracking-widest transition-colors">{o?.label}</span>
                    </div>
                    {current?.country === o?.country && (
                        <div className="w-1.5 h-1.5 bg-meximco-accent rounded-full" />
                    )}
                  </ListboxOption>
                )
              })}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CountrySelect
