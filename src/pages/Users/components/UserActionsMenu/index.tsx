import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserActionsMenu.scss'

interface Props {
  userId: string
}

export default function UserActionsMenu({ userId }: Props) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="user-actions-menu" ref={menuRef}>
      <button
        className="user-actions-menu__trigger"
        aria-label="User actions"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 4 18" fill="currentColor" width="4" height="18" aria-hidden="true">
          <circle cx="2" cy="2" r="2" />
          <circle cx="2" cy="9" r="2" />
          <circle cx="2" cy="16" r="2" />
        </svg>
      </button>

      {open && (
        <div className="user-actions-menu__dropdown" role="menu">
          <button
            className="user-actions-menu__item"
            role="menuitem"
            onClick={() => { setOpen(false); void navigate(`/users/${userId}`) }}
          >
            <svg viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M1 6s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
              <circle cx="8" cy="6" r="2" />
            </svg>
            View Details
          </button>
          <button className="user-actions-menu__item" role="menuitem" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="7" cy="4" r="3" />
              <path d="M1 13c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            </svg>
            Blacklist User
          </button>
          <button className="user-actions-menu__item" role="menuitem" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="7" cy="4" r="3" />
              <path d="M1 13c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            </svg>
            Activate User
          </button>
        </div>
      )}
    </div>
  )
}
