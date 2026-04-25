import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/test-utils'
import Login from './index'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('Login', () => {
  it('renders email and password inputs', () => {
    render(<Login />)
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
  })

  it('renders the LOG IN button', () => {
    render(<Login />)
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    render(<Login />)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: /show password/i }))
    expect(passwordInput).toHaveAttribute('type', 'text')
    await userEvent.click(screen.getByRole('button', { name: /hide password/i }))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows required-field errors when submitted empty', async () => {
    render(<Login />)
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
  })

  it('shows email format error when a non-email string is submitted', async () => {
    render(<Login />)
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'notanemail')
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'validpass')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument()
  })

  it('shows email format error on blur with invalid input', async () => {
    render(<Login />)
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'bademail')
    await userEvent.tab()
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument()
  })

  it('shows password length error when password is too short', async () => {
    render(<Login />)
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'abc')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))
    expect(await screen.findByText(/at least 6/i)).toBeInTheDocument()
  })

  it('shows password length error on blur when password is too short', async () => {
    render(<Login />)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    await userEvent.type(passwordInput, 'abc')
    await userEvent.tab()
    expect(await screen.findByText(/at least 6/i)).toBeInTheDocument()
  })

  it('navigates to /users and sets session flag on valid submit', async () => {
    mockNavigate.mockClear()
    render(<Login />)
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'user@example.com')
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'validpass')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/users')
    expect(sessionStorage.getItem('isLoggedIn')).toBe('true')
  })

  it('does not navigate when form is invalid', async () => {
    mockNavigate.mockClear()
    render(<Login />)
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
