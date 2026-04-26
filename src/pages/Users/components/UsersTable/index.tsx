import { useRef, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/lib/api/users'
import StatusPill from '@/components/ui/StatusPill'
import type { UserStatus } from '@/types/user'
import UserActionsMenu from '../UserActionsMenu'
import UsersFilter from '../UsersFilter'
import './UsersTable.scss'

const COLUMNS = [
  { key: 'organization', label: 'Organization' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'dateJoined', label: 'Date Joined' },
  { key: 'status', label: 'Status' },
] as const

function formatDate(raw: string): string {
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  const date = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${date} ${time}`
}

export default function UsersTable() {
  const [searchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [filterAnchor, setFilterAnchor] = useState<{ top: number; left: number } | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '10')

  const params = Object.fromEntries(
    [...searchParams.entries()].filter(([k]) => !['page', 'limit'].includes(k)),
  )

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  })

  const pageData = data?.slice((page - 1) * limit, page * limit) ?? []
  const total = data?.length ?? 0

  const FILTER_WIDTH = 270

  function handleFilterClick(key: string, btn: HTMLButtonElement) {
    if (activeFilter === key) {
      setActiveFilter(null)
      setFilterAnchor(null)
      return
    }
    const wrapperRect = wrapperRef.current?.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    if (wrapperRect) {
      const idealLeft = btnRect.left - wrapperRect.left
      const maxLeft = wrapperRect.width - FILTER_WIDTH
      setFilterAnchor({
        top: btnRect.bottom - wrapperRect.top,
        left: Math.min(idealLeft, Math.max(0, maxLeft)),
      })
    }
    setActiveFilter(key)
  }

  const uniqueOrganizations = useMemo(() => {
    if (!data) return []
    return Array.from(new Set(data.map((u) => u.organization)))
  }, [data])

  return (
    <div className="users-table-wrapper" ref={wrapperRef}>
      <div className="users-table">
        <table className="users-table__table" aria-label="Users">
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '40px' }} />
          </colgroup>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className="users-table__th" scope="col">
                  <div className="users-table__th-inner">
                    {col.label}
                    <button
                      className="users-table__filter-btn"
                      aria-label={`Filter by ${col.label}`}
                      onClick={(e) => handleFilterClick(col.key, e.currentTarget)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M6.22222 13.3333H9.77778V11.5556H6.22222V13.3333ZM0 2.66667V4.44444H16V2.66667H0ZM2.66667 8.88889H13.3333V7.11111H2.66667V8.88889Z" fill="#545F7D" />
                      </svg>
                    </button>
                  </div>
                </th>
              ))}
              <th className="users-table__th users-table__th--actions" scope="col" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: limit }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="users-table__td">
                      <div
                        className="users-table__skeleton-cell"
                        style={{ width: `${60 + (j * 13) % 40}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))}

            {isError && (
              <tr>
                <td colSpan={7} className="users-table__error">
                  Failed to load users.{' '}
                  <button
                    className="users-table__retry-btn"
                    onClick={() => void refetch()}
                  >
                    Try again
                  </button>
                </td>
              </tr>
            )}

            {!isLoading && !isError && pageData.length === 0 && (
              <tr>
                <td colSpan={7} className="users-table__empty">
                  No users found.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              pageData.map((user) => (
                <tr key={user.id} className="users-table__tr">
                  <td className="users-table__td" data-label="Organization"><span className="users-table__td-value">{user.organization}</span></td>
                  <td className="users-table__td" data-label="Username"><span className="users-table__td-value">{user.username}</span></td>
                  <td className="users-table__td" data-label="Email"><span className="users-table__td-value">{user.email.toLowerCase()}</span></td>
                  <td className="users-table__td" data-label="Phone Number"><span className="users-table__td-value">{user.phoneNumber}</span></td>
                  <td className="users-table__td" data-label="Date Joined"><span className="users-table__td-value">{formatDate(user.dateJoined)}</span></td>
                  <td className="users-table__td" data-label="Status">
                    <StatusPill status={user.status.toLowerCase() as UserStatus} />
                  </td>
                  <td className="users-table__td">
                    <UserActionsMenu userId={user.id} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {activeFilter && filterAnchor && (
        <div
          className="users-table__filter-popover"
          style={{ top: filterAnchor.top, left: filterAnchor.left }}
        >
          <UsersFilter 
            onClose={() => { setActiveFilter(null); setFilterAnchor(null) }} 
            organizations={uniqueOrganizations}
          />
        </div>
      )}

      {!isLoading && !isError && total > 0 && (
        <UsersPagination total={total} page={page} limit={limit} />
      )}
    </div>
  )
}

function UsersPagination({
  total,
  page,
  limit,
}: {
  total: number
  page: number
  limit: number
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const totalPages = Math.ceil(total / limit)

  function goTo(p: number) {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  function setLimit(l: number) {
    const next = new URLSearchParams(searchParams)
    next.set('limit', String(l))
    next.set('page', '1')
    setSearchParams(next)
  }

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else if (page <= 3) {
    pages.push(1, 2, 3, '...', totalPages - 1, totalPages)
  } else if (page >= totalPages - 2) {
    pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages)
  } else {
    pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
  }

  return (
    <div className="users-pagination">
      <div className="users-pagination__info">
        <span>Showing</span>
        <select
          className="users-pagination__size-select"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          aria-label="Rows per page"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span>out of {total}</span>
      </div>
      <div className="users-pagination__pages">
        <button
          className="users-pagination__nav-btn"
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="#213F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="users-pagination__ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`users-pagination__page-btn${p === page ? ' users-pagination__page-btn--active' : ''}`}
              onClick={() => goTo(p as number)}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}
        <button
          className="users-pagination__nav-btn"
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="#213F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
