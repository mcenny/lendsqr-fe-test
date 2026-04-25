import { ApiError } from '@/types/api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
const JG_TOKEN = import.meta.env.VITE_JG_TOKEN as string | undefined

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (JG_TOKEN) headers['Authorization'] = `Bearer ${JG_TOKEN}`

  const response = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request failed: ${response.status} ${response.statusText}`,
    )
  }

  return response.json() as Promise<T>
}
