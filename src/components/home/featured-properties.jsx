"use client"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import PropertyCard from "../../components/property-card"
import { propertiesService } from "@/services/propertiesService"
import { BACKEND_URL } from "@/config/api"

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch featured properties from API (limit to 4)
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true)
        const response = await propertiesService.getAllProperties({})
        
        // Transform API data and limit to 4
        const getImageUrl = (img) => {
          if (!img || img === "/placeholder.svg") return "/placeholder.svg"
          if (img.startsWith('http')) return img
          if (img.startsWith('/')) return `${BACKEND_URL}${img}`
          return `${BACKEND_URL}/${img}`
        }
        
        const transformedProperties = (response.data || [])
          .slice(0, 4)
          .map((prop) => {
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
            }
          })
        
        setProperties(transformedProperties)
      } catch (err) {
        console.error("Error fetching featured properties:", err)
        // Keep empty array on error
        setProperties([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchFeaturedProperties()
  }, [])

  const stats = [
    { number: "25+", label: "Projects Completed" },
    { number: "8+", label: "Years Experience" },
    { number: "50+", label: "Properties Sold" },
    { number: "24/7", label: "Customer Support" }
  ]

  if (loading) {
    return (
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy mb-4">
            Featured Properties
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mb-6 rounded-full" />
          <p className="font-open-sans text-lg text-gray-700 max-w-2xl mx-auto">
            Explore handpicked luxury properties from our exclusive collection.
          </p>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured properties available.</p>
          </div>
        )}

        {/* Button Section */}
        <div className="text-center mt-14">
          <Link
            to="/properties"
            className="inline-block bg-navy text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gold hover:text-navy transition-all duration-300"
          >
            View All Properties
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-playfair text-3xl md:text-4xl font-bold text-navy mb-2">
                  {stat.number}
                </div>
                <div className="font-open-sans text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
