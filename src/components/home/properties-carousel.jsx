"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { propertiesService } from "@/services/propertiesService"
import { BACKEND_URL } from "@/config/api"

// PropertyCard Component
const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => { e.target.src = "/placeholder.svg" }}
        />

        {/* Price Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
          <span className="font-bold text-xl text-gray-900">
            ₹{(property.price || 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{property.location}</span>
          </div>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between mb-4 py-3 border-y border-gray-100">
          <div className="flex items-center gap-1">
            <Square size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{property.gaj || 0} Gaj</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-700">₹{(property.pricePerGaj || 0).toLocaleString()}/Gaj</span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="flex items-center justify-center">
          <Link
            to={`/property/${property.id}`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LatestPropertiesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const response = await propertiesService.getAllProperties({})
        
        // Transform API data
        const getImageUrl = (img) => {
          if (!img || img === "/placeholder.svg") return "/placeholder.svg"
          if (img.startsWith('http')) return img
          if (img.startsWith('/')) return `${BACKEND_URL}${img}`
          return `${BACKEND_URL}/${img}`
        }
        
        const transformedProperties = (response.data || []).map((prop) => {
          // Handle images
          let imageUrl = "/placeholder.svg"
          if (prop.images) {
            if (typeof prop.images === 'string') {
              imageUrl = getImageUrl(prop.images)
            } else if (Array.isArray(prop.images) && prop.images.length > 0) {
              imageUrl = getImageUrl(prop.images[0])
            }
          }
          
          return {
            id: prop._id || prop.id,
            title: prop.name || prop.title,
            location: prop.location,
            price: prop.totalPrice || prop.price || (prop.pricePerGaj * (prop.Gaj || prop.gaj || 0)),
            image: imageUrl,
            gaj: prop.Gaj || prop.gaj || 0,
            pricePerGaj: prop.pricePerGaj || 0,
            featured: true,
            newListing: true,
          }
        })
        
        setProperties(transformedProperties)
      } catch (err) {
        console.error("Error fetching properties:", err)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchProperties()
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || properties.length === 0) return

    const interval = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, isAutoPlaying, properties.length])

  const handleNext = () => {
    const maxIndex = Math.ceil(properties.length / 2) - 1
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1 || 1))
  }

  const handlePrev = () => {
    const maxIndex = Math.ceil(properties.length / 2) - 1
    setCurrentIndex((prev) => (prev - 1 + (maxIndex + 1 || 1)) % (maxIndex + 1 || 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const currentProperties = properties.slice(currentIndex * 2, currentIndex * 2 + 2)
  const maxSlides = Math.ceil(properties.length / 2)

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-b from-light-gray to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-light-gray to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 lg:w-72 lg:h-72 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-navy/5 rounded-full translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="font-open-sans text-gold font-semibold text-sm uppercase tracking-wide">
              Latest Premium Listings
            </span>
          </div>
          
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-navy mb-4 leading-tight">
            Discover Your <span className="text-gold">Dream</span> Property
          </h2>
          
          <div className="w-16 h-1 bg-gold mx-auto mb-6" />
          
          <p className="font-open-sans text-base lg:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed px-4">
            Explore our handpicked collection of exclusive properties featuring the latest 
            market additions with premium amenities and unparalleled locations.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8 mt-8 pt-8 border-t border-gray-200 px-4">
            <div className="text-center min-w-[100px]">
              <div className="font-playfair text-2xl font-bold text-navy">{properties.length}+</div>
              <div className="font-open-sans text-gray-600 text-sm">Premium Properties</div>
            </div>

            <div className="w-1 h-8 bg-gold/30 hidden lg:block" />
            <div className="text-center min-w-[100px]">
              <div className="font-playfair text-2xl font-bold text-navy">4.8</div>
              <div className="font-open-sans text-gray-600 text-sm">Client Rating</div>
            </div>
          </div>
        </div>

        {/* Enhanced Carousel Container */}
        {properties.length > 0 ? (
          <div className="relative">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 relative">
              {currentProperties.map((property, index) => (
                <div 
                  key={property.id} 
                  className="relative group"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {/* Enhanced Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 lg:gap-6 mt-12 lg:mt-16 pt-6 lg:pt-8 border-t border-gray-200">
              {/* Left side - Indicators */}
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex gap-1 lg:gap-2">
                  {Array.from({ length: maxSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`relative rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? "bg-gold w-6 lg:w-8" 
                          : "bg-gray-300 hover:bg-gray-400 w-2 lg:w-3"
                      } h-2 lg:h-3`}
                      aria-label={`View properties ${index * 2 + 1}-${index * 2 + 2}`}
                    >
                      {index === currentIndex && (
                        <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-30" />
                      )}
                    </button>
                  ))}
                </div>
                
                <span className="font-open-sans text-gray-600 text-sm whitespace-nowrap">
                  {currentIndex + 1} of {maxSlides}
                </span>
              </div>

              {/* Right side - Navigation Buttons */}
              <div className="flex gap-2 lg:gap-3">
                <button
                  onClick={handlePrev}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  className="group bg-white text-navy p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 border-gray-200 hover:border-gold hover:bg-gold hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Previous properties"
                >
                  <ChevronLeft size={20} className="lg:w-6 lg:h-6 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={handleNext}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  className="group bg-white text-navy p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 border-gray-200 hover:border-gold hover:bg-gold hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Next properties"
                >
                  <ChevronRight size={20} className="lg:w-6 lg:h-6 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* View All Button */}
            <div className="text-center mt-8 lg:mt-12">
              <button
                onClick={() => navigate("/properties")}
                className="group bg-[#C9A14A] text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-semibold hover:bg-[#0A2540] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
              >
                <span className="flex items-center gap-2 lg:gap-3 justify-center">
                  View All Latest Properties
                  <MapPin
                    size={18}
                    className="lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No properties available.</p>
          </div>
        )}
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}
