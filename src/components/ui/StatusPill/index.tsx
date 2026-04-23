import type { UserStatus } from '@/types/user'
import './StatusPill.scss'

const LABELS: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  blacklisted: 'Blacklisted',
}

interface Props {
  status: UserStatus
}

export default function StatusPill({ status }: Props) {
  return (
    <span className={`status-pill status-pill--${status}`}>
      {LABELS[status]}
    </span>
  )
}
