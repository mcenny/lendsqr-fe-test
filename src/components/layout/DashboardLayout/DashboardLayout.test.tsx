import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/test-utils'
import DashboardLayout from './index'

describe('DashboardLayout', () => {
  it('renders the header landmark', () => {
    render(<DashboardLayout />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the main navigation landmark', () => {
    render(<DashboardLayout />)
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
  })

  it('renders the main content area', () => {
    render(<DashboardLayout />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('has a Users nav link', () => {
    render(<DashboardLayout />)
    expect(screen.getByRole('link', { name: /^users$/i })).toBeInTheDocument()
  })

  it('renders the lendsqr logo image', () => {
    render(<DashboardLayout />)
    expect(screen.getByAltText(/lendsqr logo/i)).toBeInTheDocument()
  })
})
