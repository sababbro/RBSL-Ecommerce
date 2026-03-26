import { Disclosure } from "@headlessui/react"
import { Badge, Button, clx } from "@medusajs/ui"
import { useEffect } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  'data-testid'?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  'data-testid': dataTestid
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()

  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/[0.07]" data-testid={dataTestid}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-silver/40">{label}</span>
          <div className="flex items-center">
            {typeof currentInfo === "string" ? (
              <span className="text-white font-bold uppercase tracking-widest text-sm" data-testid="current-info">{currentInfo}</span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <div>
          <button
            onClick={handleToggle}
            type={state ? "reset" : "button"}
            className={clx(
              "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              {
                "bg-white/10 text-white hover:bg-white/20": !state,
                "bg-red-500/20 text-red-500 hover:bg-red-500/30": state
              }
            )}
            data-testid="edit-button"
            data-active={state}
          >
            {state ? "Cancel" : "Modify"}
          </button>
        </div>
      </div>

      {/* Success state */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": isSuccess,
              "max-h-0 opacity-0": !isSuccess,
            }
          )}
          data-testid="success-message"
        >
          <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-green-500 text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">
               {label} Protocol Updated
             </span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Error state  */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": isError,
              "max-h-0 opacity-0": !isError,
            }
          )}
          data-testid="error-message"
        >
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <span className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">
               {errorMessage}
             </span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-visible",
            {
              "max-h-[1000px] opacity-100": state,
              "max-h-0 opacity-0": !state,
            }
          )}
        >
          <div className="flex flex-col gap-y-6 pt-8 mt-6 border-t border-white/5">
            <div>{children}</div>
            <div className="flex items-center justify-end">
              <button
                disabled={pending}
                className={clx(
                  "w-full lg:max-w-[180px] bg-white text-black h-12 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-meximco-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  { "animate-pulse": pending }
                )}
                type="submit"
                data-testid="save-button"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
