import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import React, { useContext, useMemo, type JSX } from "react"
import { AlertCircle } from "lucide-react"

import Radio from "@modules/common/components/radio"

import { isManual } from "@lib/constants"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
        {
          "border-ui-border-interactive":
            selectedPaymentOptionId === paymentProviderId,
        }
      )}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-x-4">
          <Radio checked={selectedPaymentOptionId === paymentProviderId} />
          <Text className="text-base-regular">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )}
        </div>
        <span className="justify-self-end text-ui-fg-base">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}
      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 transition-all duration-150 ease-in-out">
            <Text className="txt-medium-plus text-ui-fg-base mb-1">
              Enter your card details:
            </Text>
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={(e) => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}

export const RBSLBankTransferContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  customer,
}: Omit<PaymentContainerProps, "children"> & {
  customer?: any
}) => {
  const creditLimit = customer?.metadata?.credit_limit

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId && (
        <div className="mt-4 p-6 bg-black text-white rounded-lg border border-white/10 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Capital Tier Active</h4>
          </div>
          
          {creditLimit ? (
            <div className="space-y-2">
              <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                A Corporate Credit Line of <span className="text-white">${Number(creditLimit).toLocaleString()}</span> is authorized for this entity. This acquisition will be allocated against your standing balance.
              </p>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white w-2/3 shadow-[0_0_10px_#fff]" />
              </div>
            </div>
          ) : (
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-relaxed italic">
              Bank Deposit / Swift transmission required. Dhaka Unit allocation will remain in STDBY status until Proof of Payment is authorized.
            </p>
          )}

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Protocol: RBSL-CAP-ACCORD-2024</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Verified Strategic Partner</span>
          </div>
        </div>
      )}
    </PaymentContainer>
  )
}

export const MFSValidationCard = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  updateData,
  data,
}: Omit<PaymentContainerProps, "children"> & {
  updateData: (data: Record<string, any>) => void
  data: Record<string, any>
}) => {
  const isTrxIdInvalid = data.trx_id && data.trx_id.length > 0 && data.trx_id.length !== 10

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId && (
        <div className="mt-4 p-6 bg-black text-white rounded-lg border border-white/10 space-y-4">
          <div className="flex items-center space-x-2">
            <div className={clx("w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]", {
               "bg-pink-600 text-pink-600": paymentProviderId === "rbsl-bkash",
               "bg-orange-600 text-orange-600": paymentProviderId === "rbsl-nagad"
            })} />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">
              {paymentProviderId.split("-")[2]?.toUpperCase() || "MFS"} Localized Settlement
            </h4>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
             <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Sender Phone Number</label>
                <input 
                  type="text" 
                  placeholder="017XXXXXXXX"
                  value={data.sender_number || ""}
                  onChange={(e) => updateData({ ...data, sender_number: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-xs font-mono focus:outline-none focus:border-white transition-colors"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Transaction ID (TrxID)</label>
                <input 
                   type="text" 
                   placeholder="A1B2C3D4E5"
                   value={data.trx_id || ""}
                   onChange={(e) => updateData({ ...data, trx_id: e.target.value })}
                   className={clx("w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-xs font-mono focus:outline-none focus:border-white transition-colors uppercase", {
                     "border-red-500/50": isTrxIdInvalid
                   })}
                />
                {isTrxIdInvalid && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                     <AlertCircle className="w-3 h-3 text-red-500" />
                     <p className="text-[8px] font-black uppercase tracking-widest text-red-500">
                        Invalid TrxID format. <a href="mailto:finance-desk@rbsl.dhaka?subject=TrxID%20Discrepancy" className="underline hover:text-white transition-colors">Open Support Ticket</a>
                     </p>
                  </div>
                )}
             </div>
          </div>

          <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest leading-relaxed italic border-t border-white/5 pt-4">
             Authorized by Dhaka Unit Strategic Extraction Division. TrxID verification protocol active.
          </p>
        </div>
      )}
    </PaymentContainer>
  )
}
