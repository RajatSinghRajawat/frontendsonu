import { Award, Users, Clock, TrendingUp } from "lucide-react"
import pic2 from "../images/pagepic/pic2.webp"
export default function WhyChooseUsPage() {
  const points = [
    {
      icon: Award,
      title: "Award-Winning Service",
      description:
        "Recognized nationally for excellence in luxury real estate. Our team has won numerous industry awards for customer satisfaction and innovative marketing strategies.",
      highlights: ["5-Star Reviews", "Industry Recognition", "Client Testimonials"],
    },
    {
      icon: Users,
      title: "Expert Team",
      description:
        "Our agents bring decades of combined experience in the luxury market. Each team member is personally selected for their expertise, professionalism, and dedication.",
      highlights: ["8+ Years Avg Experience", "Certified Specialists", "Market Leaders"],
    },
    {
      icon: Clock,
      title: "24/7 Dedicated Support",
      description:
        "We're always available for our clients. Whether you have questions at midnight or need emergency assistance, our support team is ready to help.",
      highlights: ["Round-the-Clock Service", "Personal Account Managers", "Priority Response"],
    },
    {
      icon: TrendingUp,
      title: "Market Expertise",
      description:
        "Deep understanding of market trends, property valuations, and investment opportunities. We provide insightful analysis to help you make informed decisions.",
      highlights: ["Market Analytics", "Investment Guidance", "Price Optimization"],
    },
  ]

  return (
    <main className="bg-white">
      {/* ✅ HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden mt-6 py-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={pic2} // 👈 apni image yahan lagao
            alt="Luxury living room background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm font-light tracking-wide opacity-90">
            <a href="/" className="hover:text-gold transition-colors">Home</a>
            <span className="mx-2 text-gray-300">/</span>
            <span className="font-semibold text-4xl text-gold">Why Choose Us</span>
          </nav>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight tracking-tight">
            Why Choose Bhavish Property
          </h1>

          {/* Paragraph */}
          <p className="text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto">
            Discover what makes us the trusted name in luxury real estate. Our dedication, experience,
            and results speak for themselves.
          </p>
        </div>
      </section>

      {/* ✅ MAIN CONTENT */}
      <section className="min-h-screen pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl md:text-6xl font-bold text-navy mb-4">
              Why Choose Bhavish Property
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mb-6" />
            <p className="font-open-sans text-lg text-gray-700 max-w-2xl mx-auto">
              Experience the difference that exceptional expertise and personalized service can make
            </p>
          </div>

          {/* Main Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            {points.map((point, index) => {
              const Icon = point.icon
              return (
                <div
                  key={index}
                  className="bg-light-gray p-10 rounded-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-navy p-4 rounded-sm">
                      <Icon size={28} className="text-gold" />
                    </div>
                    <h3 className="font-playfair text-2xl font-bold text-navy">{point.title}</h3>
                  </div>
                  <p className="font-open-sans text-gray-700 leading-relaxed mb-6">
                    {point.description}
                  </p>
                  <div className="space-y-2">
                    {point.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gold rounded-full" />
                        <span className="font-open-sans text-sm font-semibold text-navy">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Stats */}
          <div className="bg-navy text-white py-16 rounded-sm mb-24">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="font-playfair text-4xl font-bold text-gold mb-2">25+</h3>
                <p className="font-open-sans text-white/80">Projects Completed</p>
              </div>
              <div>
                <h3 className="font-playfair text-4xl font-bold text-gold mb-2">8+</h3>
                <p className="font-open-sans text-white/80">Years Experience</p>
              </div>
              <div>
                <h3 className="font-playfair text-4xl font-bold text-gold mb-2">8+</h3>
                <p className="font-open-sans text-white/80">Properties Sold</p>
              </div>
              <div>
                <h3 className="font-playfair text-4xl font-bold text-gold mb-2">24/7</h3>
                <p className="font-open-sans text-white/80">Customer Support</p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
         <div className="bg-light-gray p-6 sm:p-8 md:p-10 rounded-sm text-center max-w-3xl mx-auto">
  <svg
    className="w-8 h-8 sm:w-10 sm:h-10 text-gold mx-auto mb-4"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4-5-7-5s-7 3.75-7 5c0 6 0 7 7 8z" />
  </svg>

  <p className="font-playfair text-base sm:text-lg font-bold text-navy leading-relaxed mb-3">
    At Bhavish Property, we don’t just sell properties — we build trust.  
    I personally guide every client to ensure they get the right property,  
    the right price, and the right direction. Our transparency and  
    deep market experience have helped thousands of families find  
    their perfect home.
  </p>

  <p className="font-open-sans text-sm sm:text-base font-semibold text-navy">
    - Girdhar Gopal Mahawer, CEO & Owner — Bhavish Property
  </p>
</div>

        </div>
      </section>
    </main>
  )
}
