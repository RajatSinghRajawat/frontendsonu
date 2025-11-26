import React, { useState } from "react"
import { Sun, Moon, LogOut, User, Lock } from "../utils/icons"
import { useTheme } from "../contexts/ThemeContext"
import { Link } from "react-router-dom"

export const Header = ({ adminName }) => {
  const { isDarkMode, toggleTheme } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)

  const bgClass = isDarkMode ? "bg-slate-900" : "bg-white"
  const textClass = isDarkMode ? "text-slate-100" : "text-slate-900"
  const borderClass = isDarkMode ? "border-slate-700" : "border-slate-200"

  return (
    <header className={`${bgClass} ${borderClass} border-b sticky top-0 z-40 transition-colors duration-300`}>
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <img
            src="/src/images/bhavish.jpg"
            alt="Logo"
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10  object-cover flex-shrink-0"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleTheme}
            className={`p-1.5 md:p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-slate-800 text-gold hover:bg-slate-700"
                : "bg-slate-100 text-navy hover:bg-slate-200"
            }`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center gap-1 sm:gap-1 md:gap-2 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg transition-colors ${
                isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
              }`}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-gold flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xs sm:text-xs md:text-sm">A</span>
              </div>
              <span className={`text-xs sm:text-xs md:text-sm font-medium ${textClass} hidden sm:inline`}>{adminName}</span>
            </button>

            {showDropdown && (
              <div
                className={`absolute right-0 mt-2 w-40 md:w-48 rounded-lg shadow-lg border ${
                  isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                }`}
              >
                <Link
                  to="/admin/profile"
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-t-lg transition-colors ${
                    isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                  }`}
                >
                  <User size={14} />
                  <span className={`text-sm ${textClass}`}>Profile</span>
                </Link>
                <Link
                  to="/admin/profile"
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 transition-colors ${
                    isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                  }`}
                >
                  <Lock size={14} />
                  <span className={`text-sm ${textClass}`}>Change Password</span>
                </Link>
                <Link
                  to="/admin/login"
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-b-lg transition-colors border-t ${
                    isDarkMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <LogOut size={14} />
                  <span className={`text-sm ${textClass}`}>Logout</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
