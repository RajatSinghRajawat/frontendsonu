"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { feedbacksService } from "@/services/feedbacksService"
import toast from "react-hot-toast"

export default function FeedbackModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "5",
    feedback: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Prepare data for API
      const feedbackData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        rating: Number(formData.rating),
        message: formData.feedback.trim()
      }

      // Call API
      const response = await feedbacksService.createFeedback(feedbackData)
      
      if (response.success) {
        toast.success("Thank you for your feedback!")
        setSubmitted(true)
        
        // Reset form and close modal after 2 seconds
        setTimeout(() => {
          setFormData({ name: "", email: "", rating: "5", feedback: "" })
          setSubmitted(false)
          onClose()
        }, 2000)
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error(error.message || "Failed to submit feedback. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-playfair text-2xl font-bold text-navy">Send Feedback</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <p className="font-playfair text-xl text-gold mb-2">Thank You!</p>
              <p className="font-open-sans text-gray-700">Your feedback has been received.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-open-sans text-sm font-semibold text-navy mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-sm font-open-sans focus:outline-none focus:border-gold"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block font-open-sans text-sm font-semibold text-navy mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-sm font-open-sans focus:outline-none focus:border-gold"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block font-open-sans text-sm font-semibold text-navy mb-2">Rating</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-sm font-open-sans focus:outline-none focus:border-gold"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div>
                <label className="block font-open-sans text-sm font-semibold text-navy mb-2">Your Feedback</label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-border rounded-sm font-open-sans focus:outline-none focus:border-gold resize-none"
                  placeholder="Share your feedback..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy text-white py-3 rounded-sm font-open-sans font-semibold hover:bg-navy/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
