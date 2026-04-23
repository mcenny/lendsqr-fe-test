import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusPill from './index'

describe('StatusPill', () => {
  it('renders active status with correct class', () => {
    render(<StatusPill status="active" />)
    const pill = screen.getByText('Active')
    expect(pill.closest('[class*="status-pill"]')).toHaveClass('status-pill--active')
  })

  it('renders inactive status', () => {
    render(<StatusPill status="inactive" />)
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('renders pending status', () => {
    render(<StatusPill status="pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders blacklisted status', () => {
    render(<StatusPill status="blacklisted" />)
    expect(screen.getByText('Blacklisted')).toBeInTheDocument()
  })
})
