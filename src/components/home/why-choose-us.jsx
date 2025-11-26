export default function WhyChooseUs() {
  const reasons = [
    {
      title: "Expert Agents",
      description: "Our team of experienced professionals brings decades of expertise in luxury real estate with proven track records in high-value transactions.",
      icon: "👔",
      stats: "8+ Years Avg. Experience",
      features: ["Certified Professionals", "Market Specialists", "Multilingual Team"]
    },
    {
      title: "Curated Properties",
      description: "Every listing is hand-selected to meet our rigorous standards of quality, location, and investment potential.",
      icon: "🏆",
      stats: "100+ Premium Listings",
      features: ["Quality Verified", "Exclusive Access", "Investment Grade"]
    },
    {
      title: "24/7 Support",
      description: "Dedicated client service available round the clock with personalized concierge for all your real estate needs.",
      icon: "📱",
      stats: "5-min Response Time",
      features: ["Personal Concierge", "Emergency Support", "Virtual Tours"]
    },
    {
      title: "Market Expertise",
      description: "Deep market knowledge and data-driven insights ensuring optimal investments and premium valuations.",
      icon: "📈",
      stats: "98% Success Rate",
      features: ["Market Analytics", "Investment Strategy", "Value Optimization"]
    },
  ]

  // Navigation handlers
  const handleContactRedirect = () => {
    window.location.href = '/contact'
  }

  const handleViewPropertiesRedirect = () => {
    window.location.href = '/properties'
  }

  return (
    <section className="py-24 bg-gradient-to-br from-white via-light-gray to-navy/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-navy/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/3 rounded-full blur-2xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-gold/20 mb-8">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="font-open-sans text-gold font-semibold text-sm uppercase tracking-wider">
              Premium Service Excellence
            </span>
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          </div>
          
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-6">
            Why <span className="text-gold">Choose</span> Us
          </h2>
          
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-20 h-1 bg-gold rounded-full" />
            <div className="w-3 h-3 bg-gold rounded-full rotate-45" />
            <div className="w-20 h-1 bg-gold rounded-full" />
          </div>
          
          <p className="font-open-sans text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Experience unparalleled service with our commitment to excellence, innovative approach, 
            and dedication to your real estate success.
          </p>
        </div>

        {/* Enhanced Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white hover:border-gold/30 hover:transform hover:-translate-y-2"
              style={{
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/5 to-transparent rounded-tr-2xl" />
              
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold to-gold/80 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-3xl">{reason.icon}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gold rounded-full" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-playfair text-2xl font-bold text-navy mb-4 group-hover:text-gold transition-colors duration-300">
                {reason.title}
              </h3>
              
              <p className="font-open-sans text-gray-700 leading-relaxed mb-6 text-lg">
                {reason.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-2 mb-6 p-4 bg-light-gray rounded-xl border-l-4 border-gold">
                <div className="w-3 h-3 bg-gold rounded-full animate-pulse" />
                <span className="font-open-sans font-semibold text-navy text-sm">
                  {reason.stats}
                </span>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {reason.features.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex}
                    className="flex items-center gap-3 group/feature"
                  >
                    <div className="w-2 h-2 bg-gold rounded-full group-hover/feature:scale-150 transition-transform duration-300" />
                    <span className="font-open-sans text-gray-600 group-hover/feature:text-navy group-hover/feature:font-medium transition-all duration-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold/20 transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gold/20">
          <h3 className="font-playfair text-3xl font-bold text-navy mb-4">
            Ready to Experience the Difference?
          </h3>
          <p className="font-open-sans text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have found their dream properties with our exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleContactRedirect}
              className="group bg-navy text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-48"
            >
              <span className="flex items-center gap-3 justify-center">
                Get Started Today
                <div className="group-hover:translate-x-1 transition-transform duration-300">→</div>
              </span>
            </button>
            <button 
              onClick={handleViewPropertiesRedirect}
              className="group border-2 border-navy text-navy px-8 py-4 rounded-2xl font-semibold hover:border-gold hover:text-gold transition-all duration-300 transform hover:-translate-y-1 min-w-48"
            >
              <span className="flex items-center gap-3 justify-center">
                View Properties
                <div className="group-hover:scale-110 transition-transform duration-300">👑</div>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}