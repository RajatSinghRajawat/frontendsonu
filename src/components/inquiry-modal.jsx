"use client"

import { X } from "lucide-react"
import { useState, useCallback } from "react"
import { inquiryService } from "@/services/inquiryService"
import toast from "react-hot-toast"

export default function InquiryModal({ property, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Prepare property details to send
      const propertyData = {
        propertyId: property?.id || property?._id,
        propertyTitle: property?.title || property?.name,
        propertyName: property?.name || property?.title,
        propertyLocation: property?.location,
        propertyPrice: property?.price,
        propertyTotalPrice: property?.totalPrice || property?.price,
        propertyPricePerGaj: property?.pricePerGaj,
        propertyGaj: property?.gaj || property?.Gaj,
        propertyCategory: property?.category,
        propertyPlotCategory: property?.plotCategory || property?.category,
        propertyImage: property?.image || (Array.isArray(property?.images) && property?.images.length > 0 ? property?.images[0] : property?.images)
      }
      
      const response = await inquiryService.createInquiry({
        ...formData,
        ...propertyData
      })
      
      if (response.success) {
        toast.success("Thank you for your inquiry! We will contact you soon.")
        setFormData({ name: "", email: "", phone: "", message: "" })
        onClose()
      } else {
        throw new Error(response.message || "Failed to send inquiry")
      }
    } catch (error) {
      console.error("Inquiry error:", error)
      toast.error(error.message || "Failed to send inquiry. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [formData, property, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-navy text-white p-6 flex items-center justify-between sticky top-0">
          <div>
            <h2 className="font-playfair text-2xl font-bold">Send Inquiry</h2>
            <p className="font-open-sans text-sm text-gold mt-1">
              {property?.title || property?.name || "Property"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-1 hover:bg-navy/80 rounded transition-all disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Property Info Display */}
          {property && (
            <div className="bg-light-gray p-4 rounded-sm mb-4">
              <p className="font-open-sans text-sm text-gray-700">
                <span className="font-semibold text-navy">Property:</span> {property.title || property.name}
              </p>
              {property.location && (
                <p className="font-open-sans text-sm text-gray-700">
                  <span className="font-semibold text-navy">Location:</span> {property.location}
                </p>
              )}
              {property.price && (
                <p className="font-open-sans text-sm text-gray-700">
                  <span className="font-semibold text-navy">Price:</span> ₹{property.price?.toLocaleString?.() || property.price}
                </p>
              )}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block font-open-sans text-sm font-semibold text-navy mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-sm font-open-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold disabled:opacity-50"
              placeholder="Your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block font-open-sans text-sm font-semibold text-navy mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-sm font-open-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold disabled:opacity-50"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block font-open-sans text-sm font-semibold text-navy mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-sm font-open-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold disabled:opacity-50"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block font-open-sans text-sm font-semibold text-navy mb-2">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              disabled={loading}
              className="w-full px-4 py-3 border border-border rounded-sm font-open-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none disabled:opacity-50"
              placeholder="Tell us more about your interest in this property..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-light-gray text-navy py-3 rounded-sm font-open-sans font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gold text-navy py-3 rounded-sm font-open-sans font-semibold hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
