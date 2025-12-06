"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { feedbacksService } from "@/services/feedbacksService"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch feedbacks from API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true)
        const response = await feedbacksService.getAllFeedbacks()
        
        // Transform feedbacks data to match component structure
        // Only show approved feedbacks (API already filters approved ones)
        const transformed = (response.data || [])
          .slice(0, 3)
          .map((feedback) => ({
            name: feedback.name || "Anonymous",
            title: feedback.email ? feedback.email.split('@')[0] : "Client", // Use email username as title
            text: feedback.message || "",
            rating: feedback.rating || 5,
          }))
        
        // If less than 3, use defaults
        while (transformed.length < 3) {
          transformed.push({
            name: "Client",
            title: "Customer",
            text: "Excellent service and professional team!",
            rating: 5,
          })
        }
        
        setTestimonials(transformed)
      } catch (err) {
        console.error("Error fetching feedbacks:", err)
        // Use default testimonials on error
        setTestimonials([
          {
            name: "Michael Johnson",
            title: "CEO, Tech Ventures",
            text: "Exceptional service from start to finish. Bhavish Property found me the perfect penthouse within my timeline.",
            rating: 5,
          },
          {
            name: "Sarah Chen",
            title: "Investment Consultant",
            text: "The team's expertise and attention to detail is unmatched. Highly recommended for premium properties.",
            rating: 5,
          },
          {
            name: "James Richardson",
            title: "Business Owner",
            text: "Professional, knowledgeable, and trustworthy. This is the gold standard in luxury real estate.",
            rating: 5,
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchFeedbacks()
  }, [])

  const next = () => {
    setCurrentIndex((currentIndex + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-play functionality
  useEffect(() => {
    if (testimonials.length === 0) return
    
    const interval = setInterval(() => {
      next()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, testimonials.length])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-navy mb-3">
            Client Testimonials 
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto" />
        </div>

        {/* Testimonial Card */}
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 relative">
          {/* Quote Icon */}
          <div className="absolute -top-4 left-8 bg-gold p-2 rounded">
            <Quote className="w-5 h-5 text-white" fill="currentColor" />
          </div>

          <div className="relative min-h-[120px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full text-center"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonials[currentIndex]?.rating || 5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-gold text-gold" />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="font-playfair text-xl text-navy font-bold mb-4 leading-relaxed">
                  "{testimonials[currentIndex]?.text || ''}"
                </p>
                
                {/* Client Info */}
                <div>
                  <p className="font-open-sans font-semibold text-navy">
                    {testimonials[currentIndex]?.name || 'Client'}
                  </p>
                  <p className="font-open-sans text-gray-600 text-sm">
                    {testimonials[currentIndex]?.title || 'Customer'}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-navy" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="p-2 bg-white border border-gray-300 text-navy rounded hover:bg-gold hover:text-white hover:border-gold transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="p-2 bg-white border border-gray-300 text-navy rounded hover:bg-gold hover:text-white hover:border-gold transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
