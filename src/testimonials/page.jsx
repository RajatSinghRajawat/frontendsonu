"use client"

import { Star } from "lucide-react"
import { useState, useEffect } from "react"
import FeedbackModal from "@/components/feedback-modal"
import { feedbacksService } from "@/services/feedbacksService"
import toast from "react-hot-toast"
import pic6 from "../images/pagepic/pic6.webp"

export default function TestimonialsPage() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch feedbacks from API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true)
        setError(null)
       const response = await feedbacksService.getAllFeedbacksAdmin();
        console.log(response.data, "response.data")
        
        setFeedbacks(response.data || [])
      } catch (err) {
        console.error("Error fetching feedbacks:", err)
        setError(err.message || "Failed to load feedbacks")
        toast.error(err.message || "Failed to load feedbacks")
      } finally {
        setLoading(false)
      }
    }
    
    fetchFeedbacks()
  }, [])

  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden mt-6 py-16">
        <div className="absolute inset-0">
          <img
            src={pic6}
            alt="Luxury testimonials background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <nav className="mb-4 text-sm font-light tracking-wide opacity-90">
            <a href="/" className="hover:text-gold transition-colors">Home</a>
            <span className="mx-2 text-gray-300">/</span>
            <span className="font-semibold text-4xl text-gold">Testimonials</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight tracking-tight">
            Client Testimonials
          </h1>
          <p className="text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto">
            Hear from our satisfied clients who found their dream properties through Bhavish Property.
          </p>
        </div>
      </section>

      {/* MAIN TESTIMONIALS CONTENT */}
      <section className="min-h-screen pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-navy mb-4">Client Testimonials</h2>
            <div className="w-16 h-1 bg-gold mx-auto mb-6" />
            <p className="font-open-sans text-lg text-gray-700 max-w-2xl mx-auto">
              Read what our satisfied clients have to say about their experience with Bhavish Property
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
              <p className="mt-4 text-gray-600">Loading feedbacks...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gold text-navy rounded-sm font-semibold hover:bg-gold/90"
              >
                Retry
              </button>
            </div>
          )}

          {/* Feedbacks Grid */}
          {!loading && !error && (
            <>
              {feedbacks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {feedbacks.map((feedback, index) => (
                    <div key={feedback._id || feedback.id || index} className="bg-light-gray p-8 rounded-sm hover:shadow-lg transition-shadow">
                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(feedback.rating || 5)].map((_, i) => (
                          <Star key={i} size={18} className="fill-gold text-gold" />
                        ))}
                      </div>

                      {/* Message */}
                      <p className="font-open-sans text-gray-700 leading-relaxed mb-6 min-h-24">"{feedback.message || ""}"</p>

                      {/* Author */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-navy flex-shrink-0 flex items-center justify-center">
                          <span className="text-white font-playfair font-bold text-lg">
                            {(feedback.name || "A")[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-playfair font-bold text-navy">{feedback.name || "Anonymous"}</p>
                          <p className="font-open-sans text-sm text-gray-700">{feedback.email || ""}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No feedbacks available yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Sticky Feedback Button */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-gold text-navy
        w-24 h-8 rounded-none font-open-sans font-bold -ml-7 hover:bg-navy hover:text-[#C9A14A]
        hover:bg-gold/90 shadow-lg transition-all hover:scale-105 z-40
        flex items-center justify-center border-t-2 rounded-t-2xl border-navy hover:border-[#C9A14A] rotate-90"
      >
        Feedback
      </button>

      {/* Feedback Modal */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </main>
  )
}
