import { NavLink } from 'react-router-dom'
import homeIcon from '@/assets/icons/home.svg'
import briefcaseIcon from '@/assets/icons/briefcase.svg'
import usersNavIcon from '@/assets/icons/users-nav.svg'
import chevronDownIcon from '@/assets/icons/chevron-down.svg'
import logoutIcon from '@/assets/icons/logout.svg'
import navPlaceholderIcon from '@/assets/icons/nav-placeholder.svg'
import './Sidebar.scss'

const CUSTOMERS_NAV = [
  { label: 'Users', icon: usersNavIcon, to: '/users' as const },
  { label: 'Guarantors', icon: navPlaceholderIcon },
  { label: 'Loans', icon: navPlaceholderIcon },
  { label: 'Decision Models', icon: navPlaceholderIcon },
  { label: 'Savings', icon: navPlaceholderIcon },
  { label: 'Loan Requests', icon: navPlaceholderIcon },
  { label: 'Whitelist', icon: navPlaceholderIcon },
  { label: 'Karma', icon: navPlaceholderIcon },
]

const BUSINESSES_NAV = [
  { label: 'Organization', icon: navPlaceholderIcon },
  { label: 'Loan Products', icon: navPlaceholderIcon },
  { label: 'Savings Products', icon: navPlaceholderIcon },
  { label: 'Fees and Charges', icon: navPlaceholderIcon },
  { label: 'Transactions', icon: navPlaceholderIcon },
  { label: 'Services', icon: navPlaceholderIcon },
  { label: 'Service Account', icon: navPlaceholderIcon },
  { label: 'Settlements', icon: navPlaceholderIcon },
  { label: 'Reports', icon: navPlaceholderIcon },
]

const SETTINGS_NAV = [
  { label: 'Preferences', icon: navPlaceholderIcon },
  { label: 'Fees and Pricing', icon: navPlaceholderIcon },
  { label: 'Audit Logs', icon: navPlaceholderIcon },
  { label: 'Systems Messages', icon: navPlaceholderIcon },
]

export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar__switch-org">
        <button
          className="sidebar__switch-org-btn"
          aria-haspopup="true"
          aria-label="Switch organization"
        >
          <img src={briefcaseIcon} alt="" aria-hidden="true" />
          <span>Switch Organization</span>
          <img
            src={chevronDownIcon}
            alt=""
            aria-hidden="true"
            className="sidebar__switch-org-chevron"
          />
        </button>
      </div>

      <NavLink to="/users" className="sidebar__nav-dashboard">
        <img src={homeIcon} alt="" aria-hidden="true" />
        <span>Dashboard</span>
      </NavLink>

      <div className="sidebar__section">
        <span className="sidebar__section-label">CUSTOMERS</span>
        {CUSTOMERS_NAV.map(({ label, icon, to }) =>
          to ? (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `sidebar__nav-item${isActive ? ' sidebar__nav-item--active' : ''}`
              }
            >
              <img src={icon} alt="" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ) : (
            <a key={label} href="#" className="sidebar__nav-item">
              <img src={icon} alt="" aria-hidden="true" />
              <span>{label}</span>
            </a>
          ),
        )}
      </div>

      <div className="sidebar__section">
        <span className="sidebar__section-label">BUSINESSES</span>
        {BUSINESSES_NAV.map(({ label, icon }) => (
          <a key={label} href="#" className="sidebar__nav-item">
            <img src={icon} alt="" aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </div>

      <div className="sidebar__section">
        <span className="sidebar__section-label">SETTINGS</span>
        {SETTINGS_NAV.map(({ label, icon }) => (
          <a key={label} href="#" className="sidebar__nav-item">
            <img src={icon} alt="" aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </div>

      <div className="sidebar__footer">
        <button className="sidebar__nav-item sidebar__logout" aria-label="Log out">
          <img src={logoutIcon} alt="" aria-hidden="true" />
          <span>Logout</span>
        </button>
        <span className="sidebar__version">v1.2.0</span>
      </div>
    </nav>
  )
}
