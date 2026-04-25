import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/test-utils'
import Users from './index'
import * as usersApi from '@/lib/api/users'
import type { User } from '@/types/user'

const mockUsers: User[] = [
  {
    id: '1',
    organization: 'Lendsqr',
    username: 'adedeji',
    email: 'adedeji@lendsqr.com',
    phoneNumber: '08078903721',
    dateJoined: '2020-05-15T10:00:00.000Z',
    status: 'active',
    profile: {
      phoneNumber: '08078903721',
      emailAddress: 'adedeji@lendsqr.com',
      bvn: '07060780922',
      gender: 'Male',
      maritalStatus: 'Single',
      children: 'None',
      typeOfResidence: "Parent's Apartment",
    },
    education: {
      levelOfEducation: 'B.Sc',
      employmentStatus: 'Employed',
      sectorOfEmployment: 'FinTech',
      durationOfEmployment: '2 years',
      officeEmail: 'adedeji@lendsqr.com',
      monthlyIncome: '200000',
      loanRepayment: '40000',
    },
    socials: { twitter: '@adedeji', facebook: 'Adedeji', instagram: '@adedeji' },
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
  },
]

describe('Users page', () => {
  beforeEach(() => {
    vi.spyOn(usersApi, 'getUsers').mockResolvedValue(mockUsers)
  })

  it('renders the page heading', () => {
    render(<Users />)
    expect(screen.getByRole('heading', { name: /users/i })).toBeInTheDocument()
  })

  it('renders 4 stat cards', async () => {
    render(<Users />)
    await waitFor(() => {
      expect(screen.getByText('USERS')).toBeInTheDocument()
      expect(screen.getByText('ACTIVE USERS')).toBeInTheDocument()
      expect(screen.getByText('USERS WITH LOANS')).toBeInTheDocument()
      expect(screen.getByText('USERS WITH SAVINGS')).toBeInTheDocument()
    })
  })

  it('renders user rows in the table after loading', async () => {
    render(<Users />)
    expect(await screen.findByText('adedeji')).toBeInTheDocument()
    expect(screen.getByText('Lendsqr')).toBeInTheDocument()
  })

  it('renders a status pill for each user', async () => {
    render(<Users />)
    expect(await screen.findByText('Active')).toBeInTheDocument()
  })

  it('clicking a filter icon opens the filter panel', async () => {
    render(<Users />)
    await screen.findByText('adedeji')
    const filterBtns = screen.getAllByRole('button', { name: /filter by/i })
    await userEvent.click(filterBtns[0])
    expect(screen.getByRole('dialog', { name: /filter users/i })).toBeInTheDocument()
  })
})
