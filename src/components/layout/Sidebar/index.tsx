import { NavLink, useNavigate } from 'react-router-dom'
import homeIcon from '@/assets/icons/home.svg'
import briefcaseIcon from '@/assets/icons/briefcase.svg'
import usersNavIcon from '@/assets/icons/users-nav.svg'
import chevronDownIcon from '@/assets/icons/chevron-down.svg'
import logoutIcon from '@/assets/icons/logout.svg'
import guarantorsIcon from '@/assets/icons/guarantors.svg'
import loansIcon from '@/assets/icons/loans.svg'
import decisionModelsIcon from '@/assets/icons/decision-models.svg'
import savingsIcon from '@/assets/icons/savings.svg'
import loanRequestsIcon from '@/assets/icons/loan-requests.svg'
import whitelistIcon from '@/assets/icons/whitelist.svg'
import karmaIcon from '@/assets/icons/karma.svg'
import organizationIcon from '@/assets/icons/organization.svg'
import loanProductsIcon from '@/assets/icons/loan-products.svg'
import savingsProductsIcon from '@/assets/icons/savings-products.svg'
import feesAndChargesIcon from '@/assets/icons/fees-and-charges.svg'
import transactionsIcon from '@/assets/icons/transactions.svg'
import servicesIcon from '@/assets/icons/services.svg'
import serviceAccountIcon from '@/assets/icons/service-account.svg'
import settlementsIcon from '@/assets/icons/settlements.svg'
import reportsIcon from '@/assets/icons/reports.svg'
import preferencesIcon from '@/assets/icons/preferences.svg'
import feesAndPricingIcon from '@/assets/icons/fees-and-pricing.svg'
import auditLogsIcon from '@/assets/icons/audit-logs.svg'
import systemsMessagesIcon from '@/assets/icons/systems-messages.svg'
import './Sidebar.scss'

const CUSTOMERS_NAV = [
  { label: 'Users', icon: usersNavIcon, to: '/users' as const },
  { label: 'Guarantors', icon: guarantorsIcon },
  { label: 'Loans', icon: loansIcon },
  { label: 'Decision Models', icon: decisionModelsIcon },
  { label: 'Savings', icon: savingsIcon },
  { label: 'Loan Requests', icon: loanRequestsIcon },
  { label: 'Whitelist', icon: whitelistIcon },
  { label: 'Karma', icon: karmaIcon },
]

const BUSINESSES_NAV = [
  { label: 'Organization', icon: organizationIcon },
  { label: 'Loan Products', icon: loanProductsIcon },
  { label: 'Savings Products', icon: savingsProductsIcon },
  { label: 'Fees and Charges', icon: feesAndChargesIcon },
  { label: 'Transactions', icon: transactionsIcon },
  { label: 'Services', icon: servicesIcon },
  { label: 'Service Account', icon: serviceAccountIcon },
  { label: 'Settlements', icon: settlementsIcon },
  { label: 'Reports', icon: reportsIcon },
]

const SETTINGS_NAV = [
  { label: 'Preferences', icon: preferencesIcon },
  { label: 'Fees and Pricing', icon: feesAndPricingIcon },
  { label: 'Audit Logs', icon: auditLogsIcon },
  { label: 'Systems Messages', icon: systemsMessagesIcon },
]

export default function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem('isLoggedIn')
    void navigate('/login')
  }

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
        <button
          className="sidebar__nav-item sidebar__logout"
          aria-label="Log out"
          onClick={handleLogout}
        >
          <img src={logoutIcon} alt="" aria-hidden="true" />
          <span>Logout</span>
        </button>
        <span className="sidebar__version">v1.2.0</span>
      </div>
    </nav>
  )
}
