function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value
}

export function getAppBaseUrl() {
  const configuredBaseUrl =
    process.env.APP_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

  if (configuredBaseUrl) {
    return normalizeBaseUrl(configuredBaseUrl)
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000"
  }

  throw new Error("Missing APP_URL, NEXTAUTH_URL, AUTH_URL, or VERCEL_URL.")
}

export function buildVerificationLink(token: string) {
  const url = new URL("/register/verify", getAppBaseUrl())
  url.searchParams.set("token", token)
  return url.toString()
}

export function getVerificationFromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"
}