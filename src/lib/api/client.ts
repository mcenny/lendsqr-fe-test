import { ApiError } from '@/types/api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
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
