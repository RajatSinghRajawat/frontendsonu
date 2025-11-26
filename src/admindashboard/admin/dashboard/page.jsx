"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { MessageSquare, Users, Home, Images, PlusCircle, User, MessageCircle } from "lucide-react"
import Layout from "../../Layout"
import { inquiryService } from "../../../services/inquiryService"
import { contactService } from "../../../services/contactService"
import { propertiesService } from "../../../services/propertiesService"
import { testimonialsService } from "../../../services/testimonialsService"
import { toast, Toaster } from "react-hot-toast"

export default function DashboardOverview() {
  const router = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalInquiries: 0,
    totalContacts: 0,
    totalProperties: 0,
    totalTestimonials: 0
  })
  const [recentInquiries, setRecentInquiries] = useState([])
  const [recentContacts, setRecentContacts] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [inquiriesRes, contactsRes, propertiesRes, testimonialsRes] = await Promise.all([
        inquiryService.getAllInquiries().catch(() => ({ data: [] })),
        contactService.getAllContacts().catch(() => ({ data: [] })),
        propertiesService.getAllProperties().catch(() => ({ data: [] })),
        testimonialsService.getAllTestimonials().catch(() => ({ data: [] }))
      ])

      const inquiries = inquiriesRes?.data || []
      const contacts = contactsRes?.data || []
      const properties = propertiesRes?.data || []
      const testimonials = testimonialsRes?.data || []

      setStats({
        totalInquiries: inquiries.length,
        totalContacts: contacts.length,
        totalProperties: properties.length,
        totalTestimonials: testimonials.length
      })

      // Get recent 3 inquiries
      const sortedInquiries = inquiries
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 3)
        .map(inq => ({
          id: inq._id || inq.id,
          name: inq.name || 'Unknown',
          message: inq.message || inq.description || 'No message',
          date: inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'N/A'
        }))
      
      setRecentInquiries(sortedInquiries)

      // Get recent 3 contacts
      const sortedContacts = contacts
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 3)
        .map(contact => ({
          id: contact._id || contact.id,
          name: contact.name || 'Unknown',
          email: contact.email || 'No email'
        }))
      
      setRecentContacts(sortedContacts)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Navigation handlers
  const handleAddProperty = () => {
    router("/admin/properties")
  }

  const handleAddGalleryPhoto = () => {
    router("/admin/gallery")
  }

  const handleCheckTestimonial = () => {
    router("/admin/testimonials")
  }

  const handleCheckBlog = () => {
    router("/admin/blog")
  }

  const handleViewInquiries = () => {
    router("/admin/inquiries")
  }

  const handleViewContacts = () => {
    router("/admin/contacts")
  }

  const handleInquiryClick = () => {
    router(`/admin/inquiries`)
  }

  const handleContactClick = () => {
    router(`/admin/contacts`)
  }

  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="space-y-6 md:space-y-8 p-4 md:px-6 lg:px-8">
        {/* ---- Top Cards ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard title="Total Inquiries" value={loading ? "..." : stats.totalInquiries.toString()} icon={<MessageSquare size={24} />} />
          <StatCard title="Total Contacts" value={loading ? "..." : stats.totalContacts.toString()} icon={<Users size={24} />} />
          <StatCard title="Total Properties" value={loading ? "..." : stats.totalProperties.toString()} icon={<Home size={24} />} />
          <StatCard title="Total Testimonials" value={loading ? "..." : stats.totalTestimonials.toString()} icon={<Images size={24} />} />
        </div>

        {/* ---- Middle Section ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Left - Recent Inquiries */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl md:rounded-2xl p-3 md:p-4 border dark:border-slate-700">
            <div className="flex justify-between items-center mb-2 md:mb-3">
              <h2 className="text-base md:text-lg font-semibold">Recent Inquiries</h2>
              <button 
                onClick={handleViewInquiries}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                View More
              </button>
            </div>
            <ul className="space-y-2 md:space-y-3">
              {loading ? (
                <li className="text-center py-4 text-slate-500">Loading...</li>
              ) : recentInquiries.length === 0 ? (
                <li className="text-center py-4 text-slate-500">No recent inquiries</li>
              ) : (
                recentInquiries.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleInquiryClick(item.id)}
                    className="flex justify-between items-start p-2 md:p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base">{item.name}</p>
                      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{item.message}</p>
                    </div>
                    <span className="text-xs text-slate-400 ml-2 flex-shrink-0">{item.date}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Right - Recent Contacts */}
          <div className="bg-white dark:bg-slate-900 shadow rounded-xl md:rounded-2xl p-3 md:p-4 border dark:border-slate-700">
            <div className="flex justify-between items-center mb-2 md:mb-3">
              <h2 className="text-base md:text-lg font-semibold">Recent Contacts</h2>
              <button 
                onClick={handleViewContacts}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                View More
              </button>
            </div>
            <ul className="space-y-2 md:space-y-3">
              {loading ? (
                <li className="text-center py-4 text-slate-500">Loading...</li>
              ) : recentContacts.length === 0 ? (
                <li className="text-center py-4 text-slate-500">No recent contacts</li>
              ) : (
                recentContacts.map((contact) => (
                  <li
                    key={contact.id}
                    onClick={() => handleContactClick(contact.id)}
                    className="flex justify-between items-center p-2 md:p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                  >
                    <p className="font-medium text-sm md:text-base">{contact.name}</p>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{contact.email}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* ---- Bottom Quick Actions ---- */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <QuickAction 
            label="Add Property" 
            icon={<Home size={18} />} 
            onClick={handleAddProperty}
          />
          <QuickAction 
            label="Add Gallery Photo" 
            icon={<Images size={18} />} 
            onClick={handleAddGalleryPhoto}
          />
          <QuickAction 
            label="Check Testimonial" 
            icon={<MessageCircle size={18} />} 
            onClick={handleCheckTestimonial}
          />
          <QuickAction 
            label="Check Blog" 
            icon={<User size={18} />} 
            onClick={handleCheckBlog}
          />
        </div>
      </div>
    </Layout>
  )
}

/* ----- Small Components ----- */

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-slate-900 shadow border dark:border-slate-700 rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center justify-between">
    <div>
      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-xl md:text-2xl font-bold">{value}</h3>
    </div>
    <div className="text-amber-500">{icon}</div>
  </div>
)

const QuickAction = ({ label, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-center gap-1 md:gap-2 p-3 md:p-4 rounded-xl font-medium bg-[#C9A14A] hover:bg-amber-600 text-white transition text-sm md:text-base cursor-pointer"
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden">{label.split(' ')[0]}</span>
  </button>
)