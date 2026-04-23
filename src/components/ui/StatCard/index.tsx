import type { ReactNode } from 'react'
import './StatCard.scss'

interface Props {
  icon: ReactNode
  iconBg: string
  label: string
  value: number | string
}

export default function StatCard({ icon, iconBg, label, value }: Props) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon-wrap" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{Number(value).toLocaleString()}</p>
    </div>
  )
}
