import { useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import './UsersFilter.scss'

interface Props {
  onClose: () => void
  organizations?: string[]
}

const STATUS_OPTIONS = ['active', 'inactive', 'pending', 'blacklisted'] as const

export default function UsersFilter({ onClose, organizations = [] }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next = new URLSearchParams(searchParams)
    next.set('page', '1');
    (['organization', 'username', 'email', 'phoneNumber', 'dateJoined', 'status'] as const).forEach(
      (key) => {
        const val = data.get(key) as string
        if (val) next.set(key, val)
        else next.delete(key)
      },
    )
    setSearchParams(next)
    onClose()
  }

  function handleReset() {
    const next = new URLSearchParams()
    next.set('page', '1')
    setSearchParams(next)
    onClose()
  }

  return (
    <form
      ref={formRef}
      className="users-filter"
      onSubmit={handleSubmit}
      role="dialog"
      aria-label="Filter users"
    >
      {[
        { name: 'organization', label: 'Organization', type: 'select', placeholder: 'Select' },
        { name: 'username', label: 'Username', type: 'text', placeholder: 'User' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
        { name: 'dateJoined', label: 'Date', type: 'date', placeholder: 'Date' },
        { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Phone Number' },
      ].map(({ name, label, type, placeholder }) => (
        <div key={name} className="users-filter__field">
          <label className="users-filter__label" htmlFor={`filter-${name}`}>
            {label}
          </label>
          {type === 'select' ? (
            <select
              id={`filter-${name}`}
              name={name}
              className="users-filter__select"
              defaultValue={searchParams.get(name) ?? ''}
            >
              <option value="">{placeholder}</option>
              {name === 'organization' && organizations.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`filter-${name}`}
              name={name}
              type={type}
              className="users-filter__input"
              placeholder={placeholder}
              defaultValue={searchParams.get(name) ?? ''}
            />
          )}
        </div>
      ))}

      <div className="users-filter__field">
        <label className="users-filter__label" htmlFor="filter-status">
          Status
        </label>
        <select
          id="filter-status"
          name="status"
          className="users-filter__select"
          defaultValue={searchParams.get('status') ?? ''}
        >
          <option value="">Select</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="users-filter__actions">
        <button type="button" className="users-filter__btn users-filter__btn--reset" onClick={handleReset}>
          Reset
        </button>
        <button type="submit" className="users-filter__btn users-filter__btn--filter">
          Filter
        </button>
      </div>
    </form>
  )
}
