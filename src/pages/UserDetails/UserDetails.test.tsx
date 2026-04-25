import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/test-utils'
import UserDetails from './index'
import { ApiError } from '@/types/api'
import type { User } from '@/types/user'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useParams: () => ({ id: '1' }) }
})

vi.mock('@/lib/cache', () => ({
  getCachedUser: vi.fn().mockResolvedValue(undefined),
  setCachedUser: vi.fn().mockResolvedValue(undefined),
}))

const mockUser: User = {
  id: '1',
  organization: 'Lendsqr',
  username: 'Grace Effiom',
  email: 'grace@gmail.com',
  phoneNumber: '07060780922',
  dateJoined: '2020-04-30T10:00:00.000Z',
  status: 'active',
  profile: {
    phoneNumber: '07060780922',
    emailAddress: 'grace@gmail.com',
    bvn: '07060780922',
    gender: 'Female',
    maritalStatus: 'Single',
    children: 'None',
    typeOfResidence: "Parent's Apartment",
  },
  education: {
    levelOfEducation: 'B.Sc',
    employmentStatus: 'Employed',
    sectorOfEmployment: 'FinTech',
    durationOfEmployment: '2 years',
    officeEmail: 'grace@lendsqr.com',
    monthlyIncome: '200000',
    loanRepayment: '40000',
  },
  socials: { twitter: '@grace_effiom', facebook: 'Grace Effiom', instagram: '@grace_effiom' },
  guarantors: [
    {
      fullName: 'Debby Ogana',
      phoneNumber: '07060780922',
      emailAddress: 'debby@gmail.com',
      relationship: 'Sister',
    },
  ],
  userTier: 1,
  accountBalance: '200000.00',
  accountNumber: '9912345678',
  bankName: 'Providus Bank',
}

vi.mock('@/lib/api/users', () => ({
  getUserById: vi.fn(),
  getUsers: vi.fn().mockResolvedValue([]),
}))

describe('UserDetails page', () => {
  beforeEach(async () => {
    const { getUserById } = await import('@/lib/api/users')
    vi.mocked(getUserById).mockResolvedValue(mockUser)
  })

  it('renders User Details heading', () => {
    render(<UserDetails />)
    expect(screen.getByRole('heading', { name: /user details/i })).toBeInTheDocument()
  })

  it('renders the user full name after load', async () => {
    render(<UserDetails />)
    expect(await screen.findAllByText('Grace Effiom')).not.toHaveLength(0)
  })

  it('renders General Details tab as active', async () => {
    render(<UserDetails />)
    await screen.findAllByText('Grace Effiom')
    const tab = screen.getByRole('tab', { name: /general details/i })
    expect(tab).toHaveAttribute('aria-selected', 'true')
  })

  it('renders personal information field labels', async () => {
    render(<UserDetails />)
    await screen.findAllByText('Grace Effiom')
    expect(screen.getByText('BVN')).toBeInTheDocument()
    expect(screen.getByText('Gender')).toBeInTheDocument()
  })

  it('renders Back to Users link', () => {
    render(<UserDetails />)
    expect(screen.getByRole('link', { name: /back to users/i })).toBeInTheDocument()
  })

  it('renders Blacklist User and Activate User buttons', () => {
    render(<UserDetails />)
    expect(screen.getByRole('button', { name: /blacklist user/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /activate user/i })).toBeInTheDocument()
  })

  it('shows "coming soon" when a non-General Details tab is clicked', async () => {
    render(<UserDetails />)
    await screen.findAllByText('Grace Effiom')
    await userEvent.click(screen.getByRole('tab', { name: /documents/i }))
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })

  it('shows generic error state with retry button when fetch fails', async () => {
    const { getUserById } = await import('@/lib/api/users')
    vi.mocked(getUserById).mockRejectedValue(new Error('Network error'))
    render(<UserDetails />)
    expect(await screen.findByText(/failed to load user/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows 404 message with link to users when user is not found', async () => {
    const { getUserById } = await import('@/lib/api/users')
    vi.mocked(getUserById).mockRejectedValue(new ApiError(404, 'Not found'))
    render(<UserDetails />)
    const errorAlert = await screen.findByRole('alert')
    expect(within(errorAlert).getByText(/user not found/i)).toBeInTheDocument()
    expect(within(errorAlert).getByRole('link', { name: /back to users/i })).toBeInTheDocument()
  })
})
