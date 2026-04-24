import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/lib/api/users'
import { getCachedUser, setCachedUser } from '@/lib/cache'
import GeneralDetails from './components/GeneralDetails'
import './UserDetails.scss'

const TABS = ['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System']

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="user-details__star"
      viewBox="0 0 16 16"
      fill={filled ? '#E9B200' : 'none'}
      stroke={filled ? '#E9B200' : '#C1C6D5'}
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M8 1l1.796 3.638 4.014.583-2.905 2.83.686 3.997L8 10.098l-3.591 1.95.686-3.997L2.19 5.22l4.014-.583z" />
    </svg>
  )
}

export default function UserDetails() {
  const { id = '' } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState(0)

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const cached = await getCachedUser(id)
      if (cached) return cached
      const fetched = await getUserById(id)
      await setCachedUser(fetched)
      return fetched
    },
    enabled: !!id,
  })

  return (
    <div className="user-details">
      <Link to="/users" className="user-details__nav" aria-label="Back to Users">
        <svg
          className="user-details__nav-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Users
      </Link>

      <div className="user-details__header">
        <h1 className="user-details__heading">User Details</h1>
        <div className="user-details__actions">
          <button className="user-details__btn user-details__btn--blacklist">Blacklist User</button>
          <button className="user-details__btn user-details__btn--activate">Activate User</button>
        </div>
      </div>

      {isLoading && <div className="user-details__loading">Loading user details…</div>}
      {isError && <div className="user-details__error">Failed to load user. Please try again.</div>}

      {user && (
        <>
          <div className="user-details__profile-card">
            <div className="user-details__basic-info">
              <div className="user-details__avatar-wrap">
                <svg
                  className="user-details__avatar-icon"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="20" cy="13" r="7" />
                  <path d="M6 38c0-7.732 6.268-14 14-14s14 6.268 14 14H6z" />
                </svg>
              </div>

              <div className="user-details__name-block">
                <p className="user-details__name">{user.profile?.fullName ?? user.username}</p>
                <p className="user-details__user-id">{user.id}</p>
              </div>

              <div className="user-details__divider" aria-hidden="true" />

              <div className="user-details__tier-block">
                <p className="user-details__tier-label">User's Tier</p>
                <div className="user-details__stars">
                  {[1, 2, 3].map((n) => (
                    <StarIcon key={n} filled={n <= (user.userTier ?? 1)} />
                  ))}
                </div>
              </div>

              <div className="user-details__divider" aria-hidden="true" />

              <div className="user-details__balance-block">
                <p className="user-details__balance">
                  ₦{user.accountBalance ? Number(user.accountBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
                </p>
                <p className="user-details__bank">
                  {user.accountNumber && user.bankName ? `${user.accountNumber}/${user.bankName}` : '—'}
                </p>
              </div>
            </div>

            <div className="user-details__tabs" role="tablist" aria-label="User details tabs">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  role="tab"
                  className="user-details__tab"
                  aria-selected={activeTab === i}
                  onClick={() => setActiveTab(i)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="user-details__tab-content" role="tabpanel">
            {activeTab === 0 && user.profile ? (
              <GeneralDetails user={user} />
            ) : activeTab === 0 ? (
              <p className="user-details__tab-placeholder">No profile data available.</p>
            ) : (
              <p className="user-details__tab-placeholder">{TABS[activeTab]} — coming soon</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
