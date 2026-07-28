import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  Eye,
  EyeOff,
  LockKeyhole,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import ThemeToggle from '@/components/ThemeToggle'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    })

    if (authError) {
      setError(authError.message || 'We could not sign you in. Check your details and try again.')
      setLoading(false)
      return
    }

    window.location.href = '/'
  }

  return (
    <main className="auth-shell">
      <section className="auth-brand" aria-label="About Hindsight">
        <div className="flex items-center gap-3">
          <span className="auth-mark" aria-hidden="true">
            <BrainCircuit className="size-[18px]" />
          </span>
          <span className="text-sm font-bold">Hindsight</span>
        </div>

        <div className="auth-brand-copy">
          <h1>Memory, made navigable.</h1>
          <p>
            Explore what your systems remember, understand how knowledge connects,
            and find the evidence behind every recall.
          </p>
        </div>

        <p className="relative z-[1] m-0 text-xs text-white/65">
          Private workspace · Authorized operators only
        </p>
      </section>

      <section className="auth-form-side" aria-labelledby="login-title">
        <div className="auth-theme">
          <ThemeToggle />
        </div>

        <div className="auth-form-wrap">
          <h2 id="login-title">Welcome back</h2>
          <p>Sign in to your memory operations workspace.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 bg-card px-3.5 shadow-none"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <span className="text-xs text-muted-foreground">Required</span>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 bg-card pr-12 pl-3.5 shadow-none"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 size-11 rounded-l-none text-muted-foreground"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="size-[18px]" aria-hidden="true" />
                  ) : (
                    <Eye className="size-[18px]" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="field-error" role="alert" aria-live="polite">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="h-11 w-full font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                  />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-7 flex items-start gap-2.5 text-xs leading-5 text-muted-foreground">
            <LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p className="m-0">
              Access is managed by your workspace administrator. Sign-up is disabled.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
