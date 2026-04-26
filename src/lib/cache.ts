import { get, set } from 'idb-keyval'
import type { User } from '@/types/user'

const USER_PREFIX = 'user:'
const ALL_USERS_KEY = 'all-users'

export async function getCachedUser(id: string): Promise<User | undefined> {
  try {
    return await get<User>(`${USER_PREFIX}${id}`)
  } catch {
    return undefined
  }
}

export async function setCachedUser(user: User): Promise<void> {
  try {
    await set(`${USER_PREFIX}${user.id}`, user)
  } catch {
    // Storage unavailable — silently skip
  }
}

export async function getAllCachedUsers(): Promise<User[] | undefined> {
  try {
    return await get<User[]>(ALL_USERS_KEY)
  } catch {
    return undefined
  }
}

export async function setAllCachedUsers(users: User[]): Promise<void> {
  try {
    await set(ALL_USERS_KEY, users)
  } catch {
    // Storage unavailable — silently skip
  }
}
