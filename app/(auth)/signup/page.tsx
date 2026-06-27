'use client'

import React, { useState } from 'react'
import { authenticateUser } from '../actions'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const formData = new FormData(event.currentTarget)
    formData.append('actionType', isSignUp ? 'signup' : 'login')

    const result = await authenticateUser(formData)
    if (result?.error) {
      setErrorMsg(result.error)
      setLoading(false)
    }
  }

  return (
    /* Changed screen background to black/dark slate */
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Changed inner container background to match the dark theme */}
      <div className="max-w-md w-full space-y-8 p-8 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-amber-500 tracking-tight">
            Teen Wealth Tracker
          </h2>
          <p className="mt-2 text-sm text-amber-500/80">
            {isSignUp ? 'Create your account to start saving' : 'Welcome back! Log into your dashboard'}
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="p-3 text-sm text-red-400 bg-red-950/50 rounded-lg border border-red-900/50">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              /* Added text-amber-400 so the user's typed input text turns yellow */
              className="w-full px-4 py-2.5 bg-slate-800 text-amber-400 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors placeholder:text-slate-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              /* Added text-amber-400 here as well so their typed password bullets turn yellow */
              className="w-full px-4 py-2.5 bg-slate-800 text-amber-400 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-medium text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 font-bold"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors focus:outline-none"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  )
}