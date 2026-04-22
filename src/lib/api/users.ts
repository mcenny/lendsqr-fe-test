import { apiFetch } from './client'
import type { User } from '@/types/user'

export interface GetUsersParams {
  page?: number
  limit?: number
  organization?: string
  username?: string
  email?: string
  phoneNumber?: string
  dateJoined?: string
  status?: string
}

export async function getUsers(params: GetUsersParams = {}): Promise<User[]> {
  const query = new URLSearchParams()
  const entries = Object.entries(params) as [string, string | number | undefined][]
  entries.forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value))
    }
  })
  const qs = query.toString()
  return apiFetch<User[]>(`/users${qs ? `?${qs}` : ''}`)
}

export async function getUserById(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}`)
}
