"use client"

import React from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { useTheme } from "../contexts/ThemeContext"
import "./globals.css"

export const Layout = ({ children }) => {
  const { isDarkMode } = useTheme()
  const bgClass = isDarkMode ? "bg-slate-950" : "bg-slate-50"

  return (
    <div className={`${bgClass} min-h-screen transition-colors duration-300`}>
      <Header adminName="Admin" adminPicture="" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pt-4 px-4 md:px-8">
          <div className="max-w-7xl mx-auto pb-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
