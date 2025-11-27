"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Star, Award, Users, Clock, TrendingUp, Loader2 } from "lucide-react"
import luxry from "../images/luxury.jpg"
import { teamService } from "../services/teamService"
import { BACKEND_URL } from "../config/api"

export default function AboutPage() {
  const [expandedWhy, setExpandedWhy] = useState(null)
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [loadingTeam, setLoadingTeam] = useState(false)
  
  // Fetch team members on component mount
  useEffect(() => {
    console.log("BACKEND_URL:", BACKEND_URL)
    fetchTeamMembers()
  }, [])
  
  const fetchTeamMembers = async () => {
    try {
      setLoadingTeam(true)
      const response = await teamService.getAllTeamMembers()
      console.log("Team API Response:", response)
      if (response && response.data) {
        console.log("Team Members:", response.data)
        setTeamMembers(response.data)
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
      // Keep empty array on error, so hardcoded data can be used as fallback
      setTeamMembers([])
    } finally {
      setLoadingTeam(false)
    }
  }

  const whyChooseUs = [
    {
      id: 1,
      title: "Award-Winning Service",
      description:
        "Recognized nationally for excellence in luxury real estate. Our team has won numerous industry awards for customer satisfaction and innovative marketing strategies.",
      highlights: ["5-Star Reviews", "Industry Recognition", "Client Testimonials"],
      icon: <Award className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Expert Team",
      description:
        "Our agents bring decades of combined experience in the luxury market. Each team member is personally selected for their expertise, professionalism, and dedication.",
      highlights: ["8+ Years Avg Experience", "Certified Specialists", "Market Leaders"],
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 3,
      title: "24/7 Dedicated Support",
      description:
        "We're always available for our clients. Whether you have questions at midnight or need emergency assistance, our support team is ready to help.",
      highlights: ["Round-the-Clock Service", "Personal Account Managers", "Priority Response"],
      icon: <Clock className="w-6 h-6" />
    },
    {
      id: 4,
      title: "Market Expertise",
      description:
        "Deep understanding of market trends, property valuations, and investment opportunities. We provide insightful analysis to help you make informed decisions.",
      highlights: ["Market Analytics", "Investment Guidance", "Price Optimization"],
      icon: <TrendingUp className="w-6 h-6" />
    },
  ]

  const faqs = [
    {
      id: 1,
      question: "What is the average timeline for selling a luxury property?",
      answer:
        "The timeline varies depending on market conditions and property specifics. Typically, luxury properties sell within 3-6 months. Our expert marketing strategies often accelerate this timeline. We provide personalized estimates during initial consultations.",
    },
    {
      id: 2,
      question: "How do you determine property valuations?",
      answer:
        "We use comprehensive market analysis including comparable sales, property features, location factors, and current market trends. Our team conducts detailed valuations using industry-leading tools and expertise to ensure accurate pricing.",
    },
    {
      id: 3,
      question: "Do you handle international clients?",
      answer:
        "Yes, we have extensive experience with international clients and can facilitate transactions across borders. We work with legal and tax professionals to ensure smooth international sales and purchases.",
    },
    {
      id: 4,
      question: "What services do you offer beyond property sales?",
      answer:
        "Beyond sales, we offer property management, investment consulting, market analysis, staging services, and financial advisory referrals. Our goal is to provide comprehensive luxury real estate solutions.",
    },
    {
      id: 5,
      question: "How are your agents trained and qualified?",
      answer:
        "All our agents undergo rigorous training programs and maintain current licenses and certifications. We invest in continuous professional development to ensure our team stays ahead of market trends.",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
            
            {/* Background Image - Full Screen */}
            <div className="absolute inset-0">
                <img 
                    src={luxry} 
                    alt="Elegant office background"
                    className="w-full h-full object-cover"
                />
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                
                {/* Breadcrumb Navigation */}
                <div className="mb-4">
                    <p className="text-sm font-light tracking-wider opacity-80">
                        <a href="/" className="hover:text-gold transition-colors">Home</a> / 
                        <span className="font-semibold text-4xl text-gold ml-1">About Us</span>
                    </p>
                </div>
                
                {/* Main Heading */}
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                    Our Story, Our Vision
                </h1>
                
                {/* About Content */}
                <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto mb-10">
                    We are dedicated to setting new benchmarks in luxury real estate. 
                    Since our founding, our mission has been simple: to provide unparalleled 
                    service and deliver exceptional value, ensuring every client's journey is a success.
                </p>
                
            
            </div>
        </section>

      {/* Rest of the content remains the same but with improved spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-12 relative z-20">
        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-4xl font-bold text-navy mb-6">Our Story</h2>
              <p className="font-open-sans text-gray-700 leading-relaxed mb-6 text-lg">
                Founded in 2015, Bhavish Property has emerged as the premier destination for high-end real estate.
                With a passion for excellence and a commitment to our clients, we've transformed the luxury property market.
              </p>
              <p className="font-open-sans text-gray-700 leading-relaxed mb-6">
                Our team of seasoned professionals brings together decades of combined expertise in luxury real estate,
                architecture, and investment strategies. We understand that buying or selling a luxury property is more
                than a transaction—it's a journey.
              </p>
              <p className="font-open-sans text-gray-700 leading-relaxed">
                Today, we serve a global clientele, connecting visionary investors with their dream properties.
              </p>
            </div>
            <div className="relative">
              <div className="bg-light-gray h-96 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={luxry}
                  alt="About Bhavish Property"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gold text-navy p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">8+</div>
                <div className="text-sm font-semibold">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Values - Enhanced */}
        <div className="mb-24">
          <h2 className="font-playfair text-4xl font-bold text-navy text-center mb-4">Our Values</h2>
          <p className="font-open-sans text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            The principles that guide every decision we make and every relationship we build
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Mission",
                description: "To connect exceptional clients with extraordinary properties, delivering unparalleled service and expertise at every step.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: "🏆",
                title: "Integrity",
                description: "We operate with complete transparency and honesty, building trust through consistent, ethical practices in every transaction.",
                color: "from-emerald-500 to-emerald-600"
              },
              {
                icon: "💎",
                title: "Excellence",
                description: "We never compromise on quality, from the properties we represent to the service we provide to every client.",
                color: "from-purple-500 to-purple-600"
              }
            ].map((value, index) => (
              <div key={index} className="group relative">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${value.color} text-white text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">{value.title}</h3>
                  <p className="font-open-sans text-gray-700 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us - Enhanced */}
        <div className="mb-24">
          <h2 className="font-playfair text-4xl font-bold text-navy text-center mb-4">Why Choose Bhavish Property</h2>
          <p className="font-open-sans text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover what sets us apart in the world of luxury real estate
          </p>
          <div className="space-y-6 max-w-4xl mx-auto">
            {whyChooseUs.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <button
                  onClick={() => setExpandedWhy(expandedWhy === item.id ? null : item.id)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-gold/5 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl font-bold text-navy mb-2">{item.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {item.highlights.map((highlight, i) => (
                          <span key={i} className="font-open-sans text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-gold transition-transform duration-300 flex-shrink-0 ${expandedWhy === item.id ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedWhy === item.id && (
                  <div className="px-8 pb-8 pt-2 border-t border-gray-100">
                    <p className="font-open-sans text-gray-700 text-lg mb-6">{item.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {item.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gold/5 rounded-lg p-4">
                          <div className="w-3 h-3 bg-gold rounded-full flex-shrink-0" />
                          <span className="font-open-sans font-semibold text-navy">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

     

        {/* Team Section - Enhanced */}
      <div>
  <h2 className="font-playfair text-4xl font-bold text-navy text-center mb-4">Our Leadership Team</h2>
  <p className="font-open-sans text-gray-600 text-center mb-12 max-w-2xl mx-auto">
    Meet the visionaries behind Bhavish Property's success story
  </p>
  
  {loadingTeam ? (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-12 h-12 animate-spin text-navy" />
    </div>
  ) : teamMembers.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      {teamMembers.map((member, index) => {
        const imageUrl = member.image ? `${BACKEND_URL}${member.image}` : "/placeholder-user.jpg"
        console.log(`Member ${member.name} - Image URL:`, imageUrl)
        
        return (
          <div key={member._id || index} className="group text-center bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-sm">
            <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-200">
              <img
                src={imageUrl}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => { 
                  console.log(`Image failed to load for ${member.name}:`, imageUrl)
                  e.target.src = "/placeholder-user.jpg" 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-open-sans text-sm">{member.designation}</p>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-navy mb-2">{member.name}</h3>
              <p className="font-open-sans text-gray-700 text-sm sm:text-base">{member.designation}</p>
            </div>
          </div>
        )
      })}
    </div>
  ) : (
    <div className="text-center py-20">
      <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <p className="font-open-sans text-gray-600">No team members available at the moment.</p>
    </div>
  )}
</div>
      </div>
    </main>
  )
} 