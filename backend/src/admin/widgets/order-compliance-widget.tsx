import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { BuildingStorefront, FaceSmile as User, DocumentText } from "@medusajs/icons"

type OrderWidgetProps = {
  data: {
    id: string
    customer?: {
      metadata?: Record<string, unknown>
      company_name?: string
      email?: string
    }
    metadata?: Record<string, unknown>
  }
}

const OrderComplianceWidget = ({ data }: OrderWidgetProps) => {
  const customerMeta = (data.customer?.metadata ?? {}) as Record<string, string>
  const orderMeta = (data.metadata ?? {}) as Record<string, string>

  const companyName =
    customerMeta?.company_name ||
    orderMeta?.company_name ||
    data.customer?.company_name as string ||
    null

  const bin = customerMeta?.bin || orderMeta?.bin || null
  const tradeLicense = customerMeta?.trade_license || orderMeta?.trade_license || null
  const isVerified = customerMeta?.is_verified === "true" || orderMeta?.is_verified === "true"

  const hasB2BData = companyName || bin || tradeLicense

  return (
    <Container className="divide-y p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-ui-bg-subtle">
        <div className="flex items-center gap-2">
          <BuildingStorefront className="text-ui-fg-base" />
          <Heading level="h2" className="font-semibold">
            B2B Compliance Data
          </Heading>
        </div>
        {isVerified ? (
          <Badge color="green" size="xsmall">Verified B2B</Badge>
        ) : (
          <Badge color="orange" size="xsmall">Pending Verification</Badge>
        )}
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        {!hasB2BData ? (
          <Text className="text-ui-fg-muted italic text-sm">
            No B2B metadata found for this order's customer. This may be a B2C order.
          </Text>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Company Name */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 mb-1">
                <BuildingStorefront className="text-ui-fg-subtle" style={{ width: 14, height: 14 }} />
                <Text
                  size="xsmall"
                  weight="plus"
                  className="text-ui-fg-subtle uppercase tracking-wider"
                >
                  Company
                </Text>
              </div>
              {companyName ? (
                <Text className="text-ui-fg-base font-semibold text-sm">{companyName}</Text>
              ) : (
                <Text className="text-ui-fg-muted italic text-sm">Not provided</Text>
              )}
            </div>

            {/* BIN */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 mb-1">
                <User className="text-ui-fg-subtle" style={{ width: 14, height: 14 }} />
                <Text
                  size="xsmall"
                  weight="plus"
                  className="text-ui-fg-subtle uppercase tracking-wider"
                >
                  BIN / Tax ID
                </Text>
              </div>
              {bin ? (
                <Text className="text-ui-fg-base font-mono font-semibold text-sm">{bin}</Text>
              ) : (
                <Text className="text-ui-fg-muted italic text-sm">Not provided</Text>
              )}
            </div>

            {/* Trade License */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 mb-1">
                <DocumentText className="text-ui-fg-subtle" style={{ width: 14, height: 14 }} />
                <Text
                  size="xsmall"
                  weight="plus"
                  className="text-ui-fg-subtle uppercase tracking-wider"
                >
                  Trade License
                </Text>
              </div>
              {tradeLicense ? (
                <Text className="text-ui-fg-base font-mono font-semibold text-sm">{tradeLicense}</Text>
              ) : (
                <Text className="text-ui-fg-muted italic text-sm">Not provided</Text>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {hasB2BData && (
        <div className="px-6 py-3 bg-ui-bg-subtle flex items-center justify-between">
          <Text size="xsmall" className="text-ui-fg-muted">
            Customer: <span className="font-medium text-ui-fg-subtle">{data.customer?.email ?? "—"}</span>
          </Text>
          <Text size="xsmall" className="text-ui-fg-muted">
            Order ID: <span className="font-mono">{data.id?.slice(0, 12)}...</span>
          </Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before",
})

export default OrderComplianceWidget
