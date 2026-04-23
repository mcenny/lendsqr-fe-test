import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/test-utils'
import Login from './index'

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
})
