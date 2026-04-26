import { apiFetch } from './client'
import { getAllCachedUsers, setAllCachedUsers } from '@/lib/cache'
import { ApiError } from '@/types/api'
import type { User } from '@/types/user'

export interface GetUsersParams {
  organization?: string
  username?: string
  email?: string
  phoneNumber?: string
  dateJoined?: string
  status?: string
}

// In-memory session cache — avoids redundant network requests when filters change.
let _allUsers: User[] | null = null

async function revalidateInBackground(): Promise<void> {
  try {
    const fresh = await apiFetch<User[]>('')
    _allUsers = fresh
    void setAllCachedUsers(fresh)
  } catch {
    // Network unavailable — keep serving from cache
  }
}

async function fetchAllUsers(): Promise<User[]> {
  if (_allUsers) return _allUsers

  // Cross-session IDB cache: serve immediately, revalidate in background
  const cached = await getAllCachedUsers()
  if (cached) {
    _allUsers = cached
    void revalidateInBackground()
    return cached
  }

  // Cold start — block on network, then persist
  _allUsers = await apiFetch<User[]>('')
  void setAllCachedUsers(_allUsers)
  return _allUsers
}

function applyFilters(users: User[], params: GetUsersParams): User[] {
  let result = users
  if (params.organization) {
    const q = params.organization.toLowerCase()
    result = result.filter(u => u.organization.toLowerCase().includes(q))
  }
  if (params.username) {
    const q = params.username.toLowerCase()
    result = result.filter(u => u.username.toLowerCase().includes(q))
  }
  if (params.email) {
    const q = params.email.toLowerCase()
    result = result.filter(u => u.email.toLowerCase().includes(q))
  }
  if (params.phoneNumber) {
    result = result.filter(u => u.phoneNumber.includes(params.phoneNumber!))
  }
  if (params.status) {
    result = result.filter(u => u.status === params.status)
  }
  if (params.dateJoined) {
    result = result.filter(u => u.dateJoined.startsWith(params.dateJoined!))
  }
  return result
}

export async function getUsers(params: GetUsersParams = {}): Promise<User[]> {
  const all = await fetchAllUsers()
  return applyFilters(all, params)
}

export async function getUserById(id: string): Promise<User> {
  const all = await fetchAllUsers()
  const user = all.find(u => u.id === id)
  if (!user) throw new ApiError(404, `User ${id} not found`)
  return user
}
