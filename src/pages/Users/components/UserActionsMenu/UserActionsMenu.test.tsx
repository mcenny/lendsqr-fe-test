import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/test-utils'
import UserActionsMenu from './index'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('UserActionsMenu', () => {
  it('opens the dropdown when the trigger is clicked', async () => {
    render(<UserActionsMenu userId="u1" />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /user actions/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('navigates to the user details page when View Details is clicked', async () => {
    mockNavigate.mockClear()
    render(<UserActionsMenu userId="u42" />)
    await userEvent.click(screen.getByRole('button', { name: /user actions/i }))
    await userEvent.click(screen.getByRole('menuitem', { name: /view details/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/users/u42', expect.objectContaining({ state: expect.objectContaining({ returnSearch: expect.any(String) }) }))
  })

  it('closes the menu when Blacklist User is clicked', async () => {
    render(<UserActionsMenu userId="u1" />)
    await userEvent.click(screen.getByRole('button', { name: /user actions/i }))
    await userEvent.click(screen.getByRole('menuitem', { name: /blacklist user/i }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
