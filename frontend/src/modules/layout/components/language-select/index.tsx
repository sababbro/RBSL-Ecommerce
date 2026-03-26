"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { updateLocale } from "@lib/data/locale-actions"
import { Locale } from "@lib/data/locales"

type LanguageOption = {
  code: string
  name: string
  localizedName: string
  countryCode: string
}

const getCountryCodeFromLocale = (localeCode: string): string => {
  try {
    const locale = new Intl.Locale(localeCode)
    if (locale.region) {
      return locale.region.toUpperCase()
    }
    const maximized = locale.maximize()
    return maximized.region?.toUpperCase() ?? localeCode.toUpperCase()
  } catch {
    const parts = localeCode.split(/[-_]/)
    return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase()
  }
}

type LanguageSelectProps = {
  toggleState: StateType
  locales: Locale[]
  currentLocale: string | null
}

const getLocalizedLanguageName = (
  code: string,
  fallbackName: string,
  displayLocale: string = "en-US"
): string => {
  try {
    const displayNames = new Intl.DisplayNames([displayLocale], {
      type: "language",
    })
    return displayNames.of(code) ?? fallbackName
  } catch {
    return fallbackName
  }
}

const DEFAULT_OPTION: LanguageOption = {
  code: "",
  name: "Default",
  localizedName: "Default",
  countryCode: "",
}

const LanguageSelect = ({
  toggleState,
  locales,
  currentLocale,
}: LanguageSelectProps) => {
  const [current, setCurrent] = useState<LanguageOption | undefined>(undefined)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { state, close } = toggleState

  const options = useMemo(() => {
    const localeOptions = locales.map((locale) => ({
      code: locale.code,
      name: locale.name,
      localizedName: getLocalizedLanguageName(
        locale.code,
        locale.name,
        currentLocale ?? "en-US"
      ),
      countryCode: getCountryCodeFromLocale(locale.code),
    }))
    return [DEFAULT_OPTION, ...localeOptions]
  }, [locales, currentLocale])

  useEffect(() => {
    if (currentLocale) {
      const option = options.find(
        (o) => o.code.toLowerCase() === currentLocale.toLowerCase()
      )
      setCurrent(option ?? DEFAULT_OPTION)
    } else {
      setCurrent(DEFAULT_OPTION)
    }
  }, [options, currentLocale])

  const handleChange = (option: LanguageOption) => {
    startTransition(async () => {
      await updateLocale(option.code)
      close()
      router.refresh()
    })
  }

  return (
    <div className="w-full">
      <Listbox
        as="div"
        onChange={handleChange}
        defaultValue={
          currentLocale
            ? options.find(
                (o) => o.code.toLowerCase() === currentLocale.toLowerCase()
              ) ?? DEFAULT_OPTION
            : DEFAULT_OPTION
        }
        disabled={isPending}
      >
        <ListboxButton className="w-full focus:outline-none">
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-silver/60">Language</span>
            {current && (
              <div className="flex items-center gap-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                {current.countryCode && (
                  /* @ts-ignore */
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "2px",
                    }}
                    countryCode={current.countryCode}
                  />
                )}
                <span className="text-[10px] font-bold text-white uppercase">
                  {isPending ? "..." : current.localizedName}
                </span>
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
              {options.map((o) => (
                <ListboxOption
                  key={o.code || "default"}
                  value={o}
                  className="group py-3 px-4 hover:bg-white/5 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-x-3">
                    {o.countryCode ? (
                      /* @ts-ignore */
                      <ReactCountryFlag
                        svg
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "2px",
                        }}
                        countryCode={o.countryCode}
                        className="grayscale group-hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <div className="w-4 h-4 bg-white/10 rounded-[2px]" />
                    )}
                    <span className="text-[10px] font-bold text-silver/60 group-hover:text-white uppercase tracking-widest transition-colors">
                      {o.localizedName}
                    </span>
                  </div>
                  {current?.code === o.code && (
                    <div className="w-1.5 h-1.5 bg-meximco-accent rounded-full" />
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default LanguageSelect
