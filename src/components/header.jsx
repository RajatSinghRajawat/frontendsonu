"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, Mail, Phone, Clock } from "lucide-react"
import logo from "../images/bhavish.jpg"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isAtTop, setIsAtTop] = useState(true)

  // 🧠 Scroll listener: show topbar only at very top
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      setIsAtTop(currentScroll < 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const contact = {
    email: "girdharmahawer@gmail.com",
    phone: "+91 9929305979",
  }

  const aboutDropdown = [
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/why-choose-us", label: "Why Choose Us" },
  ]

  const linkBaseClass =
    "font-open-sans text-sm font-semibold uppercase tracking-wide transition-colors duration-300"
  const linkDesktopClass =
    "text-gray-700 dark:text-gray-200 hover:text-gold dark:hover:text-gold"
  const linkMobileClass =
    "block w-full py-3 px-4 text-gray-700 dark:text-gray-200 hover:text-gold hover:bg-gold/5 dark:hover:bg-gray-700/50"

  const getLinkLabel = (href) => {
    const label = href.substring(1)
    return label.charAt(0).toUpperCase() + label.slice(1)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* 🧾 Top Contact Strip - Only shows at very top */}
      <div
        className={`hidden lg:block bg-navy dark:bg-gray-900 border-b border-gray-700 
          transition-all duration-500 ease-in-out overflow-hidden ${
            isAtTop ? "max-h-15 opacity-100" : "max-h-0 opacity-100"
          }`}
      >
        <div className="max-w-7xl mx-auto px-8 py-1 flex justify-between items-center">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 text-xs font-medium text-white hover:text-gold transition-colors"
          >
            <Mail size={16} className="text-gold" />
            {contact.email}
          </a>

          <p className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Clock size={16} className="text-gold" />
            Any Inquiry? <span className="text-gold">Contact Here!</span>
          </p>

          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-xs font-medium text-white hover:text-gold transition-colors"
          >
            <Phone size={16} className="text-gold" />
            {contact.phone}
          </a>
        </div>
      </div>

      {/* 🌟 Main Navbar - Always sticks to top without any gap */}
      <nav 
        className={`bg-white dark:bg-gray-800 shadow-xl dark:shadow-2xl transition-all duration-300 ${
          isAtTop ? 'rounded-b-2xl' : 'rounded-b-2xl'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8   py-1 flex items-center justify-between">
          {/* ✅ Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={logo}
              alt="Company Logo"
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* 💻 Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-10">
            <Link
              to="/"
              className={`${linkBaseClass} ${linkDesktopClass} hover:border-b-2 hover:border-gold pb-1`}
            >
              Home
            </Link>

            {/* About Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className={`${linkBaseClass} ${linkDesktopClass} flex items-center gap-1 hover:border-b-2 hover:border-gold pb-1`}
              >
                About
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isAboutOpen ? "rotate-180 text-gold" : ""
                  }`}
                />
              </button>

              {isAboutOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white dark:bg-gray-700 
                           border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl z-50 overflow-hidden"
                >
                  {aboutDropdown.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-5 py-3 font-open-sans text-sm font-medium 
                               text-gray-700 dark:text-gray-100 hover:bg-gold/10 hover:text-gold 
                               dark:hover:bg-gold/20 transition-all duration-200 border-b dark:border-gray-600 last:border-b-0"
                      onClick={() => setIsAboutOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other Links */}
            {["/properties", "/gallery", "/blog", "/testimonials", "/contact"].map(
              (href) => (
                <Link
                  key={href}
                  to={href}
                  className={`${linkBaseClass} ${linkDesktopClass} hover:border-b-2 hover:border-gold pb-1`}
                >
                  {getLinkLabel(href)}
                </Link>
              )
            )}
          </div>

          {/* 📱 Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-navy dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} className="text-gold" /> : <Menu size={24} />}
          </button>
        </div>

        {/* 📱 Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-inner">
            <div className="px-2 py-4 space-y-1">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`${linkBaseClass} ${linkMobileClass}`}
              >
                Home
              </Link>

              {/* About Dropdown */}
              <div className="border-t border-b border-gray-100 dark:border-gray-700 my-2">
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="w-full text-left font-open-sans text-sm font-semibold 
                             text-gray-700 dark:text-gray-200 hover:text-gold uppercase tracking-wide py-3 px-4 flex items-center justify-between"
                >
                  About
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isAboutOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isAboutOpen && (
                  <div className="bg-gray-50 dark:bg-gray-700/70 border-t border-gray-200 dark:border-gray-600">
                    {aboutDropdown.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block px-8 py-2 font-open-sans text-sm font-medium text-gray-600 dark:text-gray-300 
                                   hover:text-gold hover:bg-gold/10 dark:hover:bg-gray-700 transition-all duration-150"
                        onClick={() => {
                          setIsAboutOpen(false)
                          setIsOpen(false)
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Links */}
              {["/properties", "/gallery", "/blog", "/testimonials", "/contact"].map(
                (href) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setIsOpen(false)}
                    className={`${linkBaseClass} ${linkMobileClass}`}
                  >
                    {getLinkLabel(href)}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}