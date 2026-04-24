import { Component, type ErrorInfo, type ReactNode } from 'react'
import './ErrorBoundary.scss'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h1 className="error-boundary__heading">Something went wrong.</h1>
          <p className="error-boundary__message">
            An unexpected error occurred. Please refresh the page.
          </p>
          <button
            className="error-boundary__btn"
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
