import { get, set } from 'idb-keyval'
import type { User } from '@/types/user'

const USER_PREFIX = 'user:'

export async function getCachedUser(id: string): Promise<User | undefined> {
  return get<User>(`${USER_PREFIX}${id}`)
}

export async function setCachedUser(user: User): Promise<void> {
  await set(`${USER_PREFIX}${user.id}`, user)
}
