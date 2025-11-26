"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Link, useParams } from "react-router-dom"
import { ChevronLeft, Bed, Bath, Maximize2, MapPin, Phone, Mail, X } from "lucide-react"
import InquiryModal from "@/components/inquiry-modal"
import PropertyCard from "@/components/property-card"
import { propertiesService } from "@/services/propertiesService"
import { BACKEND_URL } from "@/config/api"
import toast from "react-hot-toast"

function Stat({ icon, label, value }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        {icon}
        <span className="font-playfair text-2xl font-bold text-navy">{value}</span>
      </div>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  )
}

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [relatedProperties, setRelatedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  // Fetch property by ID
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await propertiesService.getPropertyById(id)
        console.log(response.data  , "response.data")
        
        const prop = response.data || response
        
        if (!prop) {
          setError("Property not found")
          return
        }

        // Ensure images array
        const getImageUrl = (img) => {
          if (!img || img === "/placeholder.svg") return "/placeholder.svg"
          if (img.startsWith('http')) return img
          if (img.startsWith('/')) return `${BACKEND_URL}${img}`
          return `${BACKEND_URL}/${img}`
        }
        
        let imagesArray = []
        if (prop.images) {
          if (typeof prop.images === 'string') {
            imagesArray = [getImageUrl(prop.images)]
          } else if (Array.isArray(prop.images)) {
            imagesArray = prop.images.map(img => getImageUrl(img)).filter(Boolean)
          }
        }
        
        // Ensure at least 5 images for gallery
        while (imagesArray.length < 5) {
          imagesArray.push("/placeholder.svg")
        }

        const propertyData = {
          ...prop,
          id: prop._id || prop.id,
          title: prop.name || prop.title || prop.name,
          images: imagesArray,
          plotCategory: prop.category || prop.plotCategory || "Plot",
          gaj: prop.Gaj || prop.gaj || 0,
          pricePerGaj: prop.pricePerGaj || 0,
          totalPrice: prop.totalPrice || prop.price || (prop.pricePerGaj * (prop.Gaj || prop.gaj || 0)),
          contact: prop.contact || {
            phone: "(+91) 9929305979",
            email: "girdharmahawer@gmail.com",
          },
        }

        setProperty(propertyData)

        // Fetch related properties
        try {
          const allPropsResponse = await propertiesService.getAllProperties({ category: prop.category || prop.plotCategory })
          console.log(allPropsResponse.data  , "allPropsResponse.data")
          
          const allProps = allPropsResponse.data || []
          const related = allProps
            .filter(p => (p._id || p.id) !== (prop._id || prop.id))
            .slice(0, 3)
            .map((p) => {
              // Handle images
              let imageUrl = "/placeholder.svg"
              if (p.images) {
                if (typeof p.images === 'string') {
                  imageUrl = getImageUrl(p.images)
                } else if (Array.isArray(p.images) && p.images.length > 0) {
                  imageUrl = getImageUrl(p.images[0])
                }
              }
              
              return {
                ...p,
                id: p._id || p.id,
                title: p.name || p.title || p.name,
                location: p.location,
                price: p.totalPrice || p.price || (p.pricePerGaj * (p.Gaj || p.gaj || 0)),
                category: p.category,
                image: imageUrl,
                gaj: p.Gaj || p.gaj || 0,
                pricePerGaj: p.pricePerGaj || 0,
              }
            })
          
          setRelatedProperties(related)
        } catch (err) {
          console.error("Error fetching related properties:", err)
        }

      } catch (err) {
        console.error("Error fetching property:", err)
        setError(err.message || "Failed to load property")
        toast.error(err.message || "Failed to load property")
      } finally {
        setLoading(false)
      }
    }
    
    fetchProperty()
  }, [id])

  const currencyFormatter = useCallback((value) => {
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value)
    } catch {
      return `₹${value?.toLocaleString?.() || value}`
    }
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-600">Loading property...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-white pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="font-playfair text-4xl text-navy mb-4">Property not found</h1>
            <p className="text-red-600 mb-4">{error || "The property you're looking for doesn't exist."}</p>
            <Link
              to="/properties"
              className="px-6 py-2 bg-gold text-navy rounded-sm font-semibold hover:bg-gold/90"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const totalPrice = property.totalPrice || (property.pricePerGaj * property.gaj)
  const mainImage = property.images && property.images.length > 0 && property.images[activeImage] ? property.images[activeImage] : "/placeholder.svg"

  return (
    <main className="min-h-screen bg-white pt-8 pb-12">
      <div className="max-w-7xl sm:pt-10 lg:pt-20 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-10">
          <Link to="/properties" className="flex mt-7 items-center gap-2 text-navy hover:text-gold mb-2 transition-colors">
            <ChevronLeft size={18} />
            <span className="font-open-sans font-semibold">Back to Properties</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2 w-full">
            {/* Main Image */}
            <div className="w-full rounded-md overflow-hidden shadow-lg">
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-56 sm:h-72 md:h-96 lg:h-[520px] object-cover cursor-zoom-in"
                onClick={() => setGalleryOpen(true)}
                onError={(e) => { e.target.src = "/placeholder.svg" }}
              />
            </div>

            {/* Thumbnails */}
            {property.images && property.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-3 bg-white">
                {property.images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`rounded-sm overflow-hidden border ${
                      activeImage === i ? "border-gold" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-16 sm:h-20 object-cover"
                      onError={(e) => { e.target.src = "/placeholder.svg" }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 lg:hidden">
              <Stat icon={<Bed size={20} />} label="Per Gaj" value={currencyFormatter(property.pricePerGaj)} />
              <Stat icon={<Maximize2 size={20} />} label="Gaj" value={property.gaj} />
              <Stat icon={<Bath size={20} />} label="Total" value={currencyFormatter(totalPrice)} />
            </div>

            {/* Description */}
            <div className="mt-8 w-full">
              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-navy mb-3">
                {property.title}
              </h1>

              <div className="flex items-center gap-3 text-gray-600 mb-4 text-sm sm:text-base">
                <MapPin size={16} />
                <span>{property.location}</span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 w-full">
                {property.shortDescription || "Premium property with excellent features and location."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {/* Plot Details */}
                <div>
                  <h3 className="font-playfair text-xl font-semibold text-navy mb-3">Plot Details</h3>
                  <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                    <li><strong>Price per Gaj:</strong> {currencyFormatter(property.pricePerGaj)}</li>
                    <li><strong>Gaj:</strong> {property.gaj}</li>
                    <li><strong>Total Price:</strong> {currencyFormatter(totalPrice)}</li>
                    <li><strong>Category:</strong> {property.plotCategory}</li>
                  </ul>
                </div>

                {/* Key Features */}
                <div>
                  <h3 className="font-playfair text-xl font-semibold text-navy mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {property.features && property.features.length > 0 ? (
                      property.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm sm:text-base">
                          <span className="w-2 h-2 bg-gold rounded-full mt-2" />
                          <span>{typeof f === 'string' ? f : f.name || f}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No features listed</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Contact Card */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 bg-light-gray p-6 rounded-md shadow w-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-playfair text-2xl text-navy">{currencyFormatter(totalPrice)}</h2>
                  <p className="text-sm text-gray-600">
                    {property.plotCategory} • {property.gaj} gaj
                  </p>
                </div>
                <div className="text-right text-xs sm:text-sm text-gray-500">
                  {property.location}
                </div>
              </div>

              <div className="grid gap-4 mb-4 w-full">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                    <Phone size={16} className="text-navy" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Call</p>
                    <p className="font-playfair font-semibold">{property.contact.phone}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                    <Mail size={16} className="text-navy" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="font-playfair font-semibold">{property.contact.email}</p>
                  </div>
                </div>

                {/* Inquiry btn */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-navy text-white py-3 rounded-sm font-open-sans font-semibold hover:bg-navy/90 transition-all"
                >
                  Send Inquiry
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Properties Section */}
        {relatedProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="font-playfair text-3xl font-bold text-navy mb-8 text-center">Related Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((relatedProperty) => (
                <PropertyCard key={relatedProperty.id} property={relatedProperty} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {isModalOpen && <InquiryModal property={property} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}

      {/* Gallery Lightbox */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            <button
              className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow"
              onClick={() => setGalleryOpen(false)}
            >
              <X />
            </button>

            <div className="bg-white rounded-md overflow-hidden">
              <img 
                src={property.images && property.images[activeImage] ? property.images[activeImage] : "/placeholder.svg"} 
                alt="gallery" 
                className="w-full h-[70vh] object-contain bg-black"
                onError={(e) => { e.target.src = "/placeholder.svg" }}
              />
              <div className="grid grid-cols-5 gap-2 p-4 bg-white">
                {property.images && property.images.slice(0, 5).map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)} 
                    className={`${activeImage === i ? "ring-2 ring-gold" : ""} rounded-sm overflow-hidden`}
                  >
                    <img 
                      src={img || "/placeholder.svg"} 
                      alt={`thumb-${i}`} 
                      className="w-full h-20 object-cover"
                      onError={(e) => { e.target.src = "/placeholder.svg" }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
