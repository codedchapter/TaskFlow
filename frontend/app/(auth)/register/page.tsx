'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { api } from '@/lib/api'
import { auth } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await api.register(email, password)
      const { access_token } = await api.login(email, password)
      auth.setToken(access_token)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 mb-8 text-sm text-foreground/60">
        Start organizing your tasks in under a minute.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          minLength={8}
        />

        {error && <p className="mb-4 text-sm text-accent">{error}</p>}

        <Button type="submit" className="w-full">Create account</Button>
      </form>
    </div>
  )
}
