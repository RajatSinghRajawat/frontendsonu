"use client"

import { Bed, Bath, Maximize2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import InquiryModal from "@/components/inquiry-modal"

export default function PropertyCard({ property }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-navy px-4 py-2 rounded-xl font-playfair font-bold shadow-lg">
            {property.price}
          </div> */}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-playfair text-xl font-bold text-navy mb-2 line-clamp-1">{property.title}</h3>
          <p className="font-open-sans text-gray-600 text-sm mb-4">{property.location}</p>

          {/* Features */}
          <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{property.gaj}</div>
              <div className="font-open-sans text-gray-600 text-xs">Gaj</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600 text-lg">₹{property.pricePerGaj}</div>
              <div className="font-open-sans text-gray-600 text-xs">Per Gaj</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Link
              to={`/property/${property.id}`}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-open-sans font-semibold hover:bg-blue-700 transition-all text-center shadow-md hover:shadow-lg"
            >
              View Details
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-open-sans font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
            >
              Send Inquiry
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <InquiryModal property={property} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}