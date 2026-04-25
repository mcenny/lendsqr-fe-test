import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
}))

import { getCachedUser, setCachedUser } from './cache'
import type { User } from '@/types/user'

const mockUser: User = {
  id: 'abc',
  organization: 'Lendsqr',
  username: 'Test User',
  email: 'test@example.com',
  phoneNumber: '08012345678',
  dateJoined: '2023-01-01T00:00:00.000Z',
  status: 'active',
  profile: {
    phoneNumber: '08012345678',
    emailAddress: 'test@example.com',
    bvn: '12345678901',
    gender: 'Female',
    maritalStatus: 'Single',
    children: 'None',
    typeOfResidence: 'Own Apartment',
  },
  education: {
    levelOfEducation: 'B.Sc',
    employmentStatus: 'Employed',
    sectorOfEmployment: 'Tech',
    durationOfEmployment: '1 year',
    officeEmail: 'test@company.com',
    monthlyIncome: '100000',
    loanRepayment: '10000',
  },
  socials: { twitter: '@test', facebook: 'Test', instagram: '@test' },
  guarantors: [
    { fullName: 'Guarantor One', phoneNumber: '08011111111', emailAddress: 'g@g.com', relationship: 'Friend' },
  ],
  userTier: 1,
  accountBalance: '50000.00',
  accountNumber: '1234567890',
  bankName: 'Test Bank',
}

describe('user cache', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getCachedUser returns undefined on a cache miss', async () => {
    const { get } = await import('idb-keyval')
    vi.mocked(get).mockResolvedValue(undefined)
    const result = await getCachedUser('abc')
    expect(result).toBeUndefined()
    expect(get).toHaveBeenCalledWith('user:abc')
  })

  it('getCachedUser returns the stored user on a cache hit', async () => {
    const { get } = await import('idb-keyval')
    vi.mocked(get).mockResolvedValue(mockUser)
    const result = await getCachedUser('abc')
    expect(result).toEqual(mockUser)
  })

  it('setCachedUser stores the user under the correct key', async () => {
    const { set } = await import('idb-keyval')
    vi.mocked(set).mockResolvedValue(undefined)
    await setCachedUser(mockUser)
    expect(set).toHaveBeenCalledWith('user:abc', mockUser)
  })
})
