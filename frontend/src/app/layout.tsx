import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    template: "%s | Royal Bengal Shrooms Limited",
    default: "Royal Bengal Shrooms Limited | Strategic Bio-Extraction & Export",
  },
  description: "RBSL — Bangladesh's industrial leader in fungi biotechnology and standardized bioactive extraction. Strategic parent to the Meximco Scientific Series.",
  openGraph: {
    title: "Royal Bengal Shrooms Limited | Strategic Bio-Extraction & Export",
    description: "Industrial-grade fungi processing and pharmaceutical extraction from Dhaka, Bangladesh.",
    type: "website",
    siteName: "RBSL Institutional Portal",
  },
}

import { Toaster } from "react-hot-toast"

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" suppressHydrationWarning>
      <body className="text-meximco-primary bg-meximco-accent/10">
        <main className="relative">{props.children}</main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
