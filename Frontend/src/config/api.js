// API Configuration
//
// The API is served under the frontend's OWN origin via the `/api` rewrite in
// vercel.json (and Vite's dev proxy locally), so requests are relative and the
// auth cookie is first-party.
//
// This is deliberate, not incidental. `vercel.app` is on the Public Suffix
// List, which makes zingr-eta.vercel.app and zingr-backend.vercel.app two
// different *sites*. Calling the backend host directly made the `token` cookie
// a third-party cookie, and Safari — plus every browser on iOS, since they all
// run WebKit — silently discards those. Accounts were created but the session
// never persisted on those devices.
//
// Set VITE_API_URL to point at a backend host directly (bypassing the proxy)
// only if you know the cookie will not be needed, e.g. for a smoke test.

const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

// Remove trailing slash if present
export const API_URL = API_BASE_URL.replace(/\/$/, '')

export default API_URL
