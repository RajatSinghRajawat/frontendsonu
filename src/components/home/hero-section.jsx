"use client"
import { Link } from "react-router-dom"
import bgImage from "../../images/home3.webp"

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 md:bg-black/30" />

      {/* Content */}
      <div className="
        relative z-10 w-full 
        px-6 sm:px-10 md:px-16 lg:px-24
        flex flex-col items-center text-center 
        md:items-start md:text-left
        justify-center h-full
      ">
        
        {/* Tagline */}
        <div className="bg-white/20 shadow-md backdrop-blur-sm text-xs sm:text-sm inline-block px-4 py-1 rounded-full mb-4 border border-white/30 text-white">
          Welcome to BhavishProperties
        </div>

        {/* Heading */}
        <h1 className="
          text-3xl sm:text-4xl md:text-6xl 
          font-bold text-white leading-tight mb-4 
          drop-shadow-lg max-w-2xl
        ">
          Where <span className="bg-[#C9A14A] text-[#0A2540] px-2 rounded-2xl">dream homes</span>
          <br className="hidden sm:block" /> become a reality.
        </h1>

        {/* Description */}
        <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-xl mb-8 leading-relaxed">
          Discover more than <strong>1,000+</strong> property showcases across prime locations.
          Find your perfect luxury home today.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
          
          <Link to="/properties" className="w-full sm:w-auto">
            <button className="
              w-full sm:w-auto bg-[#C9A14A] hover:bg-[#b18c3b] 
              text-[#0A2540] font-semibold text-base sm:text-lg 
              px-8 py-3 sm:py-4 rounded-lg transition-all shadow-lg
            ">
              View Properties
            </button>
          </Link>

          <Link to="/contact" className="w-full sm:w-auto">
            <button className="
              w-full sm:w-auto bg-white/10 hover:bg-[#C9A14A] 
              text-white hover:text-[#0A2540]
              font-semibold text-base sm:text-lg 
              px-8 py-3 sm:py-4 rounded-lg backdrop-blur-sm 
              transition-all shadow-md border border-white/20
            ">
              Contact Now
            </button>
          </Link>

        </div>
      </div>
      {/* <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#fffdfa]"></div> */}

    </section>
  )
}
