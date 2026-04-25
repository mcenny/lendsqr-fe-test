import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoMark from '@/assets/icons/logo-mark.svg'
import pabloSignIn from '@/assets/images/pablo-sign-in.png'
import './Login.scss'

interface FormErrors {
  email?: string
  password?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email is required'
  if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address'
  return undefined
}

function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required'
  if (value.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  return undefined
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleEmailBlur() {
    const err = validateEmail(email)
    setErrors((prev) => {
      const next = { ...prev }
      if (err) next.email = err
      else delete next.email
      return next
    })
  }

  function handlePasswordBlur() {
    const err = validatePassword(password)
    setErrors((prev) => {
      const next = { ...prev }
      if (err) next.password = err
      else delete next.password
      return next
    })
  }

  function validate(): boolean {
    const next: FormErrors = {}
    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)
    if (emailErr) next.email = emailErr
    if (passwordErr) next.password = passwordErr
    setErrors(next)
    return !emailErr && !passwordErr
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    sessionStorage.setItem('isLoggedIn', 'true')
    void navigate('/users')
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
                  onBlur={handleEmailBlur}
                  aria-label="Email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                />
              </div>
              <p id="email-error" className="login__error" role="alert">
                {errors.email ?? ''}
              </p>
            </div>

            <div className="login__field">
              <div className="login__input-wrapper">
                <input
                  className="login__input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
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
              <p id="password-error" className="login__error" role="alert">
                {errors.password ?? ''}
              </p>
            </div>

            <a href="#" className="login__forgot">
              FORGOT PASSWORD?
            </a>

            <button type="submit" className="login__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in…' : 'LOG IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
