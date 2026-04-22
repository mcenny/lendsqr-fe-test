import { NavLink } from 'react-router-dom'
import logoMark from '@/assets/icons/logo-mark.svg'
import searchIcon from '@/assets/icons/search.svg'
import bellIcon from '@/assets/icons/bell.svg'
import chevronDownIcon from '@/assets/icons/chevron-down.svg'
import './TopBar.scss'

export default function TopBar() {
  return (
    <header className="top-bar">
      <div className="top-bar__logo">
        <NavLink to="/users" aria-label="Lendsqr home">
          <img src={logoMark} alt="Lendsqr logo" className="top-bar__logo-img" />
        </NavLink>
      </div>

      <div className="top-bar__search">
        <input
          type="search"
          className="top-bar__search-input"
          placeholder="Search for anything"
          aria-label="Search"
        />
        <button className="top-bar__search-button" aria-label="Submit search">
          <img src={searchIcon} alt="" aria-hidden="true" />
        </button>
      </div>

      <div className="top-bar__actions">
        <a href="#" className="top-bar__docs-link">
          Docs
        </a>
        <button className="top-bar__icon-button" aria-label="Notifications">
          <img src={bellIcon} alt="" aria-hidden="true" />
        </button>
        <button className="top-bar__user-menu" aria-label="User menu" aria-haspopup="true">
          <div className="top-bar__avatar" aria-hidden="true">A</div>
          <span className="top-bar__username">Adedeji</span>
          <img src={chevronDownIcon} alt="" aria-hidden="true" className="top-bar__chevron" />
        </button>
      </div>
    </header>
  )
}
