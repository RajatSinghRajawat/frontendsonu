import { Link } from "react-router-dom"

export default function CTASection() {
  return (
    <section className="py-20 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
        <p className="font-open-sans text-lg text-white/90 max-w-2xl mx-auto mb-8">
          Let our expert team guide you through the luxury real estate market
        </p>
        <Link to="/contact">
          <button className="bg-gold text-navy px-8 py-4 rounded-sm font-playfair font-bold text-lg hover:bg-gold/90 transition-all shadow-lg">
            Start Your Journey
          </button>
        </Link>
      </div>
    </section>
  )
}
