import pino from "pino"

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})

/**
 * Redacts sensitive PII from strings (e.g., phone numbers, emails)
 * @param value The value to mask
 * @returns Masked value
 */
export const maskPII = (value: string | undefined): string => {
  if (!value) return "N/A"
  
  // Mask phone numbers (last 4 digits visible)
  if (value.match(/^\+?[\d\s-]{10,}$/)) {
    return value.replace(/.(?=.{4})/g, "X")
  }
  
  // Mask emails
  if (value.includes("@")) {
    const [name, domain] = value.split("@")
    return `${name[0]}XXXX@${domain}`
  }
  
  return "XXXXX"
}

export default logger
