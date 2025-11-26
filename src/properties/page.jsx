import { useState, useEffect, useMemo, useCallback } from "react"
import PropertyCard from "@/components/property-card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { propertiesService } from "@/services/propertiesService"
import { BACKEND_URL } from "@/config/api"
import toast from "react-hot-toast"
import pic3 from "../images/pagepic/pic3.webp"

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter states
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPrice, setSelectedPrice] = useState("All")
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        const filters = {
          ...(selectedCategory !== "All" && { category: selectedCategory }),
          ...(selectedPrice !== "All" && {
            minPrice: selectedPrice === "Under50" ? 0 : selectedPrice === "50to1" ? 5000000 : selectedPrice === "1to2" ? 10000000 : 20000000,
            maxPrice: selectedPrice === "Under50" ? 5000000 : selectedPrice === "50to1" ? 10000000 : selectedPrice === "1to2" ? 20000000 : undefined,
          }),
          ...(search && { location: search }),
        }
        
        const response = await propertiesService.getAllProperties(filters)
        console.log(response.data  , "response.data")
        
        // Transform API data to match component expectations
        const transformedProperties = (response.data || []).map((prop) => {
          // Handle images - can be string, array, or object
          let imageUrl = "/placeholder.svg";
          
          const getImageUrl = (img) => {
            if (!img || img === "/placeholder.svg") return "/placeholder.svg"
            if (img.startsWith('http')) return img
            if (img.startsWith('/')) return `${BACKEND_URL}${img}`
            return `${BACKEND_URL}/${img}`
          }
          
          if (prop.images) {
            if (typeof prop.images === 'string') {
              imageUrl = getImageUrl(prop.images)
            } else if (Array.isArray(prop.images) && prop.images.length > 0) {
              imageUrl = getImageUrl(prop.images[0])
            }
          }
          
          return {
            ...prop,
            id: prop._id || prop.id,
            title: prop.name || prop.title || prop.name,
            location: prop.location,
            price: prop.totalPrice || prop.price || (prop.pricePerGaj * (prop.Gaj || prop.gaj || 0)),
            category: prop.category,
            image: imageUrl,
            gaj: prop.Gaj || prop.gaj || 0,
            pricePerGaj: prop.pricePerGaj || 0,
          };
        })
        
        setProperties(transformedProperties)
      } catch (err) {
        console.error("Error fetching properties:", err)
        setError(err.message || "Failed to load properties")
        toast.error(err.message || "Failed to load properties")
      } finally {
        setLoading(false)
      }
    }
    
    fetchProperties()
  }, [selectedCategory, selectedPrice, search])

  // Price filter logic (for client-side filtering if needed)
  const checkPriceRange = useCallback((price) => {
    if (selectedPrice === "All") return true
    if (selectedPrice === "Under50") return price < 5000000
    if (selectedPrice === "50to1") return price >= 5000000 && price <= 10000000
    if (selectedPrice === "1to2") return price >= 10000000 && price <= 20000000
    if (selectedPrice === "2plus") return price > 20000000
    return true
  }, [selectedPrice])

  // Filtered results with client-side search
  const filteredProperties = useMemo(() => {
    if (!search && selectedCategory === "All") {
      return properties.filter(p => checkPriceRange(p.price || p.totalPrice || 0))
    }
    
    return properties.filter((p) => {
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory
      const matchSearch = !search || 
        p.location?.toLowerCase().includes(search.toLowerCase()) ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.name?.toLowerCase().includes(search.toLowerCase())
      
      const matchPrice = checkPriceRange(p.price || p.totalPrice || 0)
      
      return matchCategory && matchSearch && matchPrice
    })
  }, [properties, search, selectedCategory, checkPriceRange])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(properties.map(p => p.category).filter(Boolean))
    return ["All", ...Array.from(cats)]
  }, [properties])

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage)

  // Reset to page 1 when filters change
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
    handleFilterChange()
  }, [handleFilterChange])

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value)
    handleFilterChange()
  }, [handleFilterChange])

  const handlePriceChange = useCallback((e) => {
    setSelectedPrice(e.target.value)
    handleFilterChange()
  }, [handleFilterChange])

  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden mt-6 py-16">
        <div className="absolute inset-0">
          <img
            src={pic3}
            alt="Luxury properties background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
          <nav className="mb-4 text-sm tracking-wide opacity-90">
            <a href="/" className="hover:text-gold">Home</a>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-4xl font-bold text-gold">Properties</span>
          </nav>

          <h1 className="text-5xl font-extrabold mb-5">
            Explore Our Properties
          </h1>
          <p className="text-lg opacity-90">
            Discover premium plots & land options across Jaipur.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="min-h-screen pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-navy">
              Available Properties
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto my-4" />
          </div>

          {/* FILTERS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search by location or title..."
              value={search}
              onChange={handleSearchChange}
              className="px-6 py-3 border rounded-sm focus:outline-none focus:border-gold"
            />

            {/* PRICE FILTER */}
            <select
              value={selectedPrice}
              onChange={handlePriceChange}
              className="px-6 py-3 border rounded-sm focus:outline-none focus:border-gold"
            >
              <option value="All">All Price Ranges</option>
              <option value="Under50">Under 50L</option>
              <option value="50to1">50L – 1Cr</option>
              <option value="1to2">1Cr – 2Cr</option>
              <option value="2plus">2Cr+</option>
            </select>

            {/* CATEGORY FILTER */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-6 py-3 border rounded-sm focus:outline-none focus:border-gold"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          )}

          {/* ERROR STATE */}
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

          {/* PROPERTIES GRID */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProperties.length > 0 ? (
                  paginatedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                ) : (
                  <p className="text-center text-gray-600 col-span-3">
                    No properties found matching your filters.
                  </p>
                )}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
