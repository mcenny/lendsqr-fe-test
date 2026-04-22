import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'
import TopBar from '../TopBar'
import './DashboardLayout.scss'

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <TopBar />
      <div className="dashboard-layout__body">
        <Sidebar />
        <main className="dashboard-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
