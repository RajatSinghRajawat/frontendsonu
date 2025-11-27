"use client"

import { Bed, Bath, Maximize2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import InquiryModal from "@/components/inquiry-modal"

export default function PropertyCard({ property }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100 w-full max-w-xs mx-auto">
        {/* Image Container */}
        <div className="relative h-40 sm:h-44 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-playfair text-base font-bold text-navy mb-1 line-clamp-1">{property.title}</h3>
          <p className="font-open-sans text-gray-600 text-xs mb-2 line-clamp-1">{property.location}</p>

          {/* Features */}
          <div className="flex justify-between items-center mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="font-bold text-gray-900 text-sm">{property.gaj}</div>
              <div className="font-open-sans text-gray-600 text-xs">Gaj</div>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-blue-600 text-sm">₹{property.pricePerGaj.toLocaleString()}</div>
              <div className="font-open-sans text-gray-600 text-xs">Per Gaj</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Link
              to={`/property/${property.id}`}
              className="flex-1 bg-blue-600 text-white py-2 px-2 rounded-lg font-open-sans text-xs font-semibold hover:bg-blue-700 transition-all text-center shadow-sm hover:shadow-md"
            >
              View Details
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-green-600 text-white py-2 px-2 rounded-lg font-open-sans text-xs font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
            >
              Inquiry
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <InquiryModal property={property} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}