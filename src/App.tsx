import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Login from '@/pages/Login'
import Users from '@/pages/Users'
import UserDetails from '@/pages/UserDetails'

const queryClient = new QueryClient()

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Navigate to="/users" replace />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetails />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
