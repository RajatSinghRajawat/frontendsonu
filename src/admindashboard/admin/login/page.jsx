import React, { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../../contexts/ThemeContext"
import { useAuth } from "../../../contexts/AuthContext"
import bhavishLogo from "../../../images/bhavish.jpg"

const Sun = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const Moon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export default function LoginPage() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const bgClass = isDarkMode ? "bg-slate-950" : "bg-slate-50"
  const cardBgClass = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
  const textClass = isDarkMode ? "text-slate-100" : "text-slate-900"
  const secondaryTextClass = isDarkMode ? "text-slate-400" : "text-slate-600"
  const inputBgClass = isDarkMode
    ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
    : "bg-slate-50 border-slate-300 text-slate-900"

  const handleLogin = useCallback(async (e) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      const result = await login(email, password)
      if (result.success) {
        navigate("/admin/dashboard")
      } else {
        setError(result.error || "Login failed. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Login error:", err)
    }
  }, [email, password, login, navigate])

  return (
    <div className={`${bgClass} min-h-screen flex items-center justify-center transition-colors duration-300`}>
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-2 rounded-lg transition-colors ${
          isDarkMode
            ? "bg-slate-800 text-amber-400 hover:bg-slate-700"
            : "bg-slate-100 text-amber-600 hover:bg-slate-200"
        }`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className={`${cardBgClass} border rounded-xl p-8 shadow-2xl max-w-md w-full mx-4`}>
        <div className="text-center mb-8">
          <div className="w-32 h-20 mx-auto mb-4 overflow-hidden rounded-2xl  shadow-lg">
            <img 
              src={bhavishLogo} 
              alt="Bhavish Property Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className={`${textClass} text-3xl font-bold`}>Bhavish Property</h1>
          <p className={`${secondaryTextClass} mt-2`}>Admin Dashboard Login</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className={`${secondaryTextClass} text-sm block mb-2`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={loading}
              className={`w-full px-4 py-2 border rounded-lg ${inputBgClass} disabled:opacity-50`}
              required
            />
          </div>
          <div>
            <label className={`${secondaryTextClass} text-sm block mb-2`}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={loading}
                className={`w-full px-4 py-2 pr-10 border rounded-lg ${inputBgClass} disabled:opacity-50`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${secondaryTextClass} hover:${textClass} transition-colors focus:outline-none`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className={`${secondaryTextClass} text-center mt-6 text-sm`}>
          Use your registered email and password to login
        </p>
      </div>
    </div>
  )
}
