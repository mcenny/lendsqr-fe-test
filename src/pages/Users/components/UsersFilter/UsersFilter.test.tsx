import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSearchParams } from 'react-router-dom'
import { render } from '@/test/test-utils'
import UsersFilter from './index'

function ParamsDisplay() {
  const [params] = useSearchParams()
  return <div data-testid="params">{params.toString()}</div>
}

describe('UsersFilter', () => {
  it('renders all six filter fields', () => {
    render(<UsersFilter onClose={vi.fn()} />)
    expect(screen.getByLabelText(/organization/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
  })

  it('clicking Filter updates URL search params', async () => {
    const onClose = vi.fn()
    render(
      <>
        <UsersFilter onClose={onClose} />
        <ParamsDisplay />
      </>,
    )
    await userEvent.type(screen.getByLabelText(/username/i), 'grace')
    await userEvent.click(screen.getByRole('button', { name: /^filter$/i }))
    expect(screen.getByTestId('params').textContent).toContain('username=grace')
    expect(onClose).toHaveBeenCalled()
  })

  it('clicking Reset clears URL search params and calls onClose', async () => {
    const onClose = vi.fn()
    render(
      <>
        <UsersFilter onClose={onClose} />
        <ParamsDisplay />
      </>,
    )
    await userEvent.type(screen.getByLabelText(/username/i), 'grace')
    await userEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('params').textContent).not.toContain('username=grace')
    expect(onClose).toHaveBeenCalled()
  })
})
