import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoMark from '@/assets/icons/logo-mark.svg'
import pabloSignIn from '@/assets/images/pablo-sign-in.png'
import './Login.scss'

interface FormErrors {
  email?: string
  password?: string
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(): boolean {
    const next: FormErrors = {}
    if (!email.trim()) next.email = 'Email is required'
    if (!password) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) void navigate('/users')
  }

  return (
    <div className="login">
      <div className="login__left">
        <img src={logoMark} alt="Lendsqr" className="login__logo" />
        <div className="login__illustration-wrap">
          <img src={pabloSignIn} alt="" aria-hidden="true" className="login__illustration" />
        </div>
      </div>

      <div className="login__right">
        <img src={logoMark} alt="Lendsqr" className="login__mobile-logo" />
        <div className="login__form-card">
          <h1 className="login__heading">Welcome!</h1>
          <p className="login__subtitle">Enter details to login.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="login__field">
              <div className="login__input-wrapper">
                <input
                  className="login__input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="login__error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="login__field">
              <div className="login__input-wrapper">
                <input
                  className="login__input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Password"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  className="login__toggle-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="login__error" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <a href="#" className="login__forgot">
              Forgot Password?
            </a>

            <button type="submit" className="login__submit">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
