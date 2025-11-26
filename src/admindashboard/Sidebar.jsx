import React, { useState } from "react"
import {
  LayoutDashboard,
  MessageSquare,
  Home,
  Users,
  MessageCircle,
  Images,
  User,
  LogOut,
   Menu,
  X,
  Share2,
} from "../utils/icons"
import { FileText } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", iconName: "dashboard" },
  { label: "Inquiries", path: "/admin/inquiries", iconName: "inquiries" },
  { label: "Properties", path: "/admin/properties", iconName: "home" },
  { label: "Contacts", path: "/admin/contacts", iconName: "contacts" },
  { label: "Testimonials", path: "/admin/testimonials", iconName: "testimonials" },
  { label: "Gallery", path: "/admin/gallery", iconName: "gallery" },
  { label: "Blog", path: "/admin/blog", iconName: "blog" },
  { label: "Social Media", path: "/admin/social-media", iconName: "social" },
  { label: "Profile", path: "/admin/profile", iconName: "profile" },
]

const getIcon = (iconName) => {
  switch (iconName) {
    case "dashboard":
      return <LayoutDashboard size={20} />
    case "inquiries":
      return <MessageSquare size={20} />
    case "home":
      return <Home size={20} />
    case "contacts":
      return <Users size={20} />
    case "testimonials":
      return <MessageCircle size={20} />
    case "gallery":
      return <Images size={20} />
    case "blog":
      return <FileText size={20} />
    case "social":
      return <Share2 size={20} />
    case "profile":
      return <User size={20} />
    default:
      return null
  }
}

export const Sidebar = () => {
  const { isDarkMode } = useTheme()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const bgClass = isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
  const textClass = isDarkMode ? "text-slate-100" : "text-slate-900"
  const hoverClass = isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
  const activeClass = "bg-gold text-navy"

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 lg:hidden z-50 p-3 rounded-full ${
          isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"
        } shadow-lg`}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 ${bgClass} border-r transition-all duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-40 overflow-y-auto`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive ? activeClass : `${textClass} ${hoverClass}`
                }`}
                onClick={() => setIsOpen(false)}
              >
                {getIcon(item.iconName)}
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}

          <div className={`border-t ${isDarkMode ? "border-slate-700" : "border-slate-200"} mt-4 pt-4`}>
            <Link
              to="/admin/login"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
              onClick={() => setIsOpen(false)}
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  )
}
