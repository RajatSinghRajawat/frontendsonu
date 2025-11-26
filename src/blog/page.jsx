"use client"

import { Link } from "react-router-dom"
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { blogService } from "@/services/blogService"
import { BACKEND_URL } from "@/config/api"
import toast from "react-hot-toast"
import pic5 from "../images/pagepic/pic5.webp"

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await blogService.getAllBlogs()
        
        // Transform API data to match component expectations
        const getImageUrl = (img) => {
          if (!img || img === "/placeholder.svg") return "/placeholder.svg"
          if (img.startsWith('http')) return img
          if (img.startsWith('/')) return `${BACKEND_URL}${img}`
          return `${BACKEND_URL}/${img}`
        }
        
        const transformedBlogs = (response.data || []).map((blog) => {
          // Safely handle image - could be string, object, or array
          let imageUrl = "/placeholder.svg";
          if (blog.image) {
            if (typeof blog.image === 'string') {
              imageUrl = getImageUrl(blog.image)
            } else if (Array.isArray(blog.image) && blog.image.length > 0) {
              imageUrl = getImageUrl(blog.image[0])
            } else if (typeof blog.image === 'object' && blog.image.url) {
              imageUrl = getImageUrl(blog.image.url)
            }
          }
          
          return {
            id: blog._id || blog.id,
            title: blog.name || blog.title,
            excerpt: blog.description || blog.excerpt || "",
            content: blog.content || "",
            image: imageUrl,
            author: blog.author || "Admin",
            date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : new Date().toLocaleDateString(),
            category: blog.category || "General",
          };
        })
        
        setBlogPosts(transformedBlogs)
      } catch (err) {
        console.error("Error fetching blogs:", err)
        setError(err.message || "Failed to load blogs")
        toast.error(err.message || "Failed to load blogs")
      } finally {
        setLoading(false)
      }
    }
    
    fetchBlogs()
  }, [])

  const totalPages = Math.ceil(blogPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = useMemo(() => {
    return blogPosts.slice(startIndex, endIndex)
  }, [blogPosts, startIndex, endIndex])

  const featuredPost = useMemo(() => {
    return blogPosts.length > 0 ? blogPosts[0] : null
  }, [blogPosts])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden mt-6 py-16">
        <div className="absolute inset-0">
          <img
            src={pic5}
            alt="Luxury blog background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <nav className="mb-4 text-sm font-light tracking-wide opacity-90">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="font-semibold text-4xl text-gold">Our Blog</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight tracking-tight">
            Luxury Insights Blog
          </h1>
          <p className="text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto">
            Expert insights, market trends, and luxury lifestyle tips from our seasoned professionals
          </p>
        </div>
      </section>

      {/* EXISTING BLOG CONTENT */}
      <section className="min-h-screen pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
              <p className="mt-4 text-gray-600">Loading blogs...</p>
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

          {/* Featured Post */}
          {!loading && !error && featuredPost && (
            <div className="mb-24 bg-light-gray rounded-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-96 md:h-full overflow-hidden">
                  <img
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-block bg-gold/20 text-gold px-4 py-2 rounded-sm font-open-sans text-sm font-semibold">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="font-playfair text-3xl md:text-4xl font-bold text-navy mb-4">{featuredPost.title}</h2>
                  <p className="font-open-sans text-gray-700 leading-relaxed mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-6 mb-6 text-sm font-open-sans text-gray-600">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {featuredPost.date}
                    </div>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-2 text-navy hover:text-gold transition-colors font-open-sans font-semibold"
                  >
                    Read Article <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && !error && (
            <div>
              <h2 className="font-playfair text-3xl font-bold text-navy mb-12">Latest Articles</h2>
              {currentPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-light-gray rounded-sm overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <div className="mb-3">
                            <span className="inline-block bg-gold/20 text-gold px-3 py-1 rounded-sm font-open-sans text-xs font-semibold">
                              {post.category}
                            </span>
                          </div>
                          <h3 className="font-playfair text-xl font-bold text-navy mb-3">{post.title}</h3>
                          <p className="font-open-sans text-gray-700 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs font-open-sans text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {post.date}
                            </div>
                          </div>
                          <Link
                            to={`/blog/${post.id}`}
                            className="inline-flex items-center gap-2 text-navy hover:text-gold transition-colors font-open-sans font-semibold text-sm"
                          >
                            Read More <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-md border ${
                            currentPage === page
                              ? 'bg-gold text-white border-gold'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No blog posts available yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
