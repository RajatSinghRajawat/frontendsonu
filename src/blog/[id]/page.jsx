"use client"

import { ChevronLeft, Calendar, User } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { blogService } from "@/services/blogService"
import { BACKEND_URL } from "@/config/api"
import toast from "react-hot-toast"

export default function BlogPostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])

  // Parse content into sections if it contains markdown-like structure
  // IMPORTANT: This hook must be called before any conditional returns
  const contentSections = useMemo(() => {
    if (!post || !post.fullContent) return []
    
    try {
      // Ensure fullContent is a string
      const contentStr = typeof post.fullContent === 'string' ? post.fullContent : String(post.fullContent || '')
      if (!contentStr) return []
      
      // Simple parsing: Split by double newlines and check for headings
      const sections = contentStr.split(/\n\n+/).map((section) => {
        const trimmed = section.trim()
        if (!trimmed) return null
        
        if (trimmed.startsWith('##') || trimmed.startsWith('###')) {
          return {
            type: 'heading',
            title: trimmed.replace(/^#+\s*/, ''),
            content: '',
          }
        }
        return {
          type: 'paragraph',
          content: trimmed,
        }
      }).filter(Boolean)
      
      return sections
    } catch (err) {
      console.error("Content parsing error:", err)
      return []
    }
  }, [post?.fullContent])

  // Fetch blog post by ID
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) {
        setError("Blog ID is missing")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const response = await blogService.getBlogById(id)
        
        // Handle response structure - API interceptor returns response.data
        // Backend returns: { success: true, data: blog }
        // So response from interceptor is: { success: true, data: blog }
        // We need to extract the blog object from response.data
        let blog = null
        
        if (response) {
          // Check if response has data property (from backend structure)
          if (response.data && typeof response.data === 'object') {
            blog = response.data
          } else if (response._id || response.id) {
            // Response is already the blog object
            blog = response
          } else {
            blog = response.data || response
          }
        }
        
        if (!blog || (!blog._id && !blog.id)) {
          console.error("Blog not found - Response:", response)
          setError("Blog post not found")
          setLoading(false)
          return
        }

        // Safely handle image
        const getImageUrl = (img) => {
          if (!img || img === "/placeholder.svg") return "/placeholder.svg"
          if (img.startsWith('http')) return img
          if (img.startsWith('/')) return `${BACKEND_URL}${img}`
          return `${BACKEND_URL}/${img}`
        }
        
        let imageUrl = "/placeholder.svg"
        try {
          if (blog.image) {
            if (typeof blog.image === 'string') {
              imageUrl = getImageUrl(blog.image)
            } else if (Array.isArray(blog.image) && blog.image.length > 0) {
              imageUrl = getImageUrl(blog.image[0])
            } else if (typeof blog.image === 'object' && blog.image.url) {
              imageUrl = getImageUrl(blog.image.url)
            }
          }
        } catch (imgError) {
          console.error("Image processing error:", imgError)
          imageUrl = "/placeholder.svg"
        }

        const transformedPost = {
          id: blog._id || blog.id || id,
          title: blog.name || blog.title || "Untitled",
          description: blog.description || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          image: imageUrl,
          author: blog.author || "Admin",
          date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : new Date().toLocaleDateString(),
          category: blog.category || "General",
          fullContent: blog.content || "",
          subHeadings: blog.subHeadings || [],
          quotes: blog.quotes || [],
          highlightPoints: blog.highlightPoints || [],
        }

        setPost(transformedPost)

        // Fetch related posts (get all and filter)
        try {
          const allBlogsResponse = await blogService.getAllBlogs()
          const allBlogs = allBlogsResponse?.data || []
          const currentBlogId = blog._id || blog.id
          
          const related = allBlogs
            .filter(b => {
              const blogId = b._id || b.id
              return blogId && blogId !== currentBlogId && blogId.toString() !== id
            })
            .slice(0, 3)
            .map(b => {
              const getImageUrl = (img) => {
                if (!img || img === "/placeholder.svg") return "/placeholder.svg"
                if (img.startsWith('http')) return img
                if (img.startsWith('/')) return `${BACKEND_URL}${img}`
                return `${BACKEND_URL}/${img}`
              }
              
              let imgUrl = "/placeholder.svg"
              try {
                if (b.image) {
                  if (typeof b.image === 'string') {
                    imgUrl = getImageUrl(b.image)
                  } else if (Array.isArray(b.image) && b.image.length > 0) {
                    imgUrl = getImageUrl(b.image[0])
                  }
                }
              } catch (imgErr) {
                console.error("Related post image error:", imgErr)
              }
              return {
                id: b._id || b.id,
                title: b.name || b.title || "Untitled",
                excerpt: b.description || b.excerpt || "",
                image: imgUrl,
                author: b.author || "Admin",
                date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : new Date().toLocaleDateString(),
                category: b.category || "General",
              }
            })
          setRelatedPosts(related)
        } catch (err) {
          console.error("Error fetching related posts:", err)
          // Continue without related posts
          setRelatedPosts([])
        }

      } catch (err) {
        console.error("Error fetching blog post:", err)
        const errorMessage = err?.message || err?.error || "Failed to load blog post"
        setError(errorMessage)
        toast.error(errorMessage)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBlogPost()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-600">Loading blog post...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="font-playfair text-4xl text-navy mb-4">Blog post not found</h1>
            <p className="text-red-600 mb-4">{error || "The blog post you're looking for doesn't exist."}</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/blog"
                className="px-6 py-2 bg-gold text-navy rounded-sm font-semibold hover:bg-gold/90"
              >
                Back to Blog
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-200 text-navy rounded-sm font-semibold hover:bg-gray-300"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Final safety check - if post is still null after loading, show error
  if (!post && !loading && !error) {
    return (
      <main className="min-h-screen bg-white pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="font-playfair text-4xl text-navy mb-4">Unable to load blog post</h1>
            <p className="text-gray-600 mb-4">Please try again later.</p>
            <Link
              to="/blog"
              className="px-6 py-2 bg-gold text-navy rounded-sm font-semibold hover:bg-gold/90"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden mt-6 py-16">
        <div className="absolute inset-0">
          <img
            src={post?.image || "/placeholder.svg"}
            alt={post?.title || "Blog post"}
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.target.src = "/placeholder.svg" }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <nav className="mb-4 text-sm font-light tracking-wide opacity-90">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link to="/blog" className="hover:text-gold transition-colors">Blog</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="font-semibold text-gold">{post?.title || "Blog Post"}</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight tracking-tight">
            {post?.title || "Blog Post"}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm font-open-sans opacity-90">
            <div className="flex items-center gap-2">
              <User size={16} />
              {post?.author || "Admin"}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {post?.date || new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="min-h-screen pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link to="/blog" className="flex items-center gap-2 text-navy hover:text-gold mb-8 transition-colors">
            <ChevronLeft size={20} />
            <span className="font-open-sans font-semibold">Back to Blog</span>
          </Link>

          {/* Category */}
          <div className="mb-6">
            <span className="inline-block bg-gold/20 text-gold px-4 py-2 rounded-sm font-open-sans text-sm font-semibold">
              {post?.category || "General"}
            </span>
          </div>

          {/* Description */}
          {post?.description && (
            <div className="mb-8">
              <h2 className="font-playfair text-2xl font-bold text-navy mb-4">Description</h2>
              <p className="font-open-sans text-gray-700 leading-relaxed text-lg">
                {post.description}
              </p>
            </div>
          )}

          {/* Excerpt */}
          {post?.excerpt && (
            <div className="mb-8">
              <h2 className="font-playfair text-2xl font-bold text-navy mb-4">Excerpt</h2>
              <p className="font-open-sans text-gray-700 leading-relaxed text-lg italic">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Full Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {/* Main Content */}
            {contentSections.length > 0 ? (
              contentSections.map((section, index) => {
                if (!section) return null
                if (section.type === 'heading') {
                  return (
                    <h3 key={index} className="font-playfair text-2xl font-bold text-navy mb-4 mt-8">
                      {section.title || ""}
                    </h3>
                  )
                }
                return (
                  <p key={index} className="font-open-sans text-gray-700 leading-relaxed text-lg mb-4">
                    {section.content || ""}
                  </p>
                )
              })
            ) : (
              <div className="font-open-sans text-gray-700 leading-relaxed text-lg whitespace-pre-wrap mb-8">
                {post?.fullContent || post?.content || "No content available."}
              </div>
            )}

            {/* Sub Headings */}
            {post?.subHeadings && Array.isArray(post.subHeadings) && post.subHeadings.length > 0 && (
              <div className="mt-12 mb-8">
                <h2 className="font-playfair text-3xl font-bold text-navy mb-6">Key Sections</h2>
                {post.subHeadings.map((subHeading, index) => (
                  <div key={index} className="mb-8">
                    {subHeading.title && (
                      <h3 className="font-playfair text-2xl font-bold text-navy mb-3">
                        {subHeading.title}
                      </h3>
                    )}
                    {subHeading.content && (
                      <p className="font-open-sans text-gray-700 leading-relaxed text-lg">
                        {subHeading.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Highlight Points */}
            {post?.highlightPoints && Array.isArray(post.highlightPoints) && post.highlightPoints.length > 0 && (
              <div className="mt-12 mb-8 bg-gold/10 p-6 rounded-lg border-l-4 border-gold">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">Key Highlights</h2>
                <ul className="space-y-3">
                  {post.highlightPoints.map((point, index) => (
                    <li key={index} className="font-open-sans text-gray-700 leading-relaxed text-lg flex items-start">
                      <span className="text-gold mr-3 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quotes */}
            {post?.quotes && Array.isArray(post.quotes) && post.quotes.length > 0 && (
              <div className="mt-12 mb-8">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">Notable Quotes</h2>
                {post.quotes.map((quote, index) => (
                  <blockquote 
                    key={index} 
                    className="font-playfair text-xl italic text-gray-600 border-l-4 border-gold pl-6 py-4 my-4 bg-gray-50 rounded-r-lg"
                  >
                    "{quote}"
                  </blockquote>
                ))}
              </div>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="border-t pt-12">
              <h3 className="font-playfair text-2xl font-bold text-navy mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id || Math.random()}
                    to={`/blog/${relatedPost.id}`}
                    className="bg-light-gray rounded-sm overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-32 overflow-hidden">
                      <img
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title || "Blog post"}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "/placeholder.svg" }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="inline-block bg-gold/20 text-gold px-2 py-1 rounded-sm font-open-sans text-xs font-semibold">
                          {relatedPost.category || "General"}
                        </span>
                      </div>
                      <h4 className="font-playfair text-lg font-bold text-navy mb-2 line-clamp-2">
                        {relatedPost.title || "Untitled"}
                      </h4>
                      <p className="font-open-sans text-gray-700 text-sm mb-3 line-clamp-2">
                        {relatedPost.excerpt || ""}
                      </p>
                      <div className="flex items-center gap-3 text-xs font-open-sans text-gray-600">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          {relatedPost.author || "Admin"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {relatedPost.date || new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
