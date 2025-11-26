"use client"

import { useState, useEffect, useMemo } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { galleryService } from "@/services/galleryService"
import { BACKEND_URL } from "@/config/api"
import toast from "react-hot-toast"
import pic4 from "../images/pagepic/pic4.webp"

export default function GalleryPage() {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const imagesPerPage = 9

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await galleryService.getAllGalleryItems()
        
        // Transform API data
        const getImageUrl = (img) => {
          if (!img || img === "/placeholder.svg") return "/placeholder.svg"
          if (img.startsWith('http')) return img
          if (img.startsWith('/')) return `${BACKEND_URL}${img}`
          return `${BACKEND_URL}/${img}`
        }
        
        const transformedItems = (response.data || []).map((item) => {
          let imagesArray = []
          if (item.images) {
            if (typeof item.images === 'string') {
              imagesArray = [item.images]
            } else if (Array.isArray(item.images)) {
              imagesArray = item.images
            }
          }
          
          // Get image URLs with proper formatting
          const imageUrls = imagesArray.map(img => getImageUrl(img)).filter(Boolean)
          
          return {
            id: item._id || item.id,
            title: item.name || "Gallery Item",
            category: item.description || "Property",
            mainImage: imageUrls[0] || "/placeholder.svg",
            allImages: imageUrls.length > 0 ? imageUrls : ["/placeholder.svg"],
          }
        })
        
        setGalleryItems(transformedItems)
      } catch (err) {
        console.error("Error fetching gallery:", err)
        setError(err.message || "Failed to load gallery")
        toast.error(err.message || "Failed to load gallery")
      } finally {
        setLoading(false)
      }
    }
    
    fetchGallery()
  }, [])

  // Pagination logic
  const totalPages = Math.ceil(galleryItems.length / imagesPerPage)
  const startIndex = (currentPage - 1) * imagesPerPage
  const currentProperties = useMemo(() => {
    return galleryItems.slice(startIndex, startIndex + imagesPerPage)
  }, [galleryItems, startIndex, imagesPerPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 800, behavior: 'smooth' })
  }

  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden mt-6 py-16">
        <div className="absolute inset-0">
          <img
            src={pic4}
            alt="Luxury gallery background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <nav className="mb-4 text-sm font-light tracking-wide opacity-90">
            <a href="/" className="hover:text-gold transition-colors">Home</a>
            <span className="mx-2 text-gray-300">/</span>
            <span className="font-semibold text-4xl text-gold">Gallery</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight tracking-tight">
            Luxury Property Gallery
          </h1>

          <p className="text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto">
            Explore our stunning collection of premium properties and breathtaking interiors from around the world.
          </p>
        </div>
      </section>

      {/* MAIN GALLERY SECTION */}
      <section className="min-h-screen pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-navy mb-4">
              Property Gallery
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mb-6" />
            <p className="font-open-sans text-lg text-gray-700 max-w-2xl mx-auto">
              Explore our stunning collection of luxury properties and elegant spaces
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
              <p className="mt-4 text-gray-600">Loading gallery...</p>
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

          {/* Gallery Grid */}
          {!loading && !error && (
            <>
              {currentProperties.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {currentProperties.map((property) => (
                      <div
                        key={property.id}
                        onClick={() => setSelectedProperty(property)}
                        className="group cursor-pointer overflow-hidden rounded-sm bg-light-gray h-80 relative"
                      >
                        <img
                          src={property.mainImage || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => { e.target.src = "/placeholder.svg" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                          <h3 className="font-playfair text-xl font-bold text-white mb-1">
                            {property.title}
                          </h3>
                          <p className="font-open-sans text-sm text-gold">
                            {property.category}
                          </p>
                          <p className="font-open-sans text-xs text-white mt-2">
                            Click to view {property.allImages.length} photos
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-sm font-open-sans font-semibold transition-all ${
                          currentPage === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-navy text-white hover:bg-gold"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-sm font-open-sans font-semibold transition-all ${
                              currentPage === page
                                ? "bg-gold text-white"
                                : "bg-light-gray text-navy hover:bg-navy hover:text-white"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-2 px-4 py-2 rounded-sm font-open-sans font-semibold transition-all ${
                          currentPage === totalPages
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-navy text-white hover:bg-gold"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="font-open-sans text-lg text-gray-700">No gallery items found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-6 right-6 z-50 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Property Info */}
            <div className="text-center mb-8">
              <h2 className="font-playfair text-3xl font-bold text-white mb-2">
                {selectedProperty.title}
              </h2>
              <p className="font-open-sans text-gold text-lg">
                {selectedProperty.category}
              </p>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedProperty.allImages.slice(0, 3).map((image, index) => (
                <div key={index} className="rounded-sm overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${selectedProperty.title} - Image ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = "/placeholder.svg" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
