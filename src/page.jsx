import HeroSection from "./components/home/hero-section"
import FeaturedProperties from "./components/home/featured-properties"
import PropertiesCarousel from "./components/home/properties-carousel"
import WhyChooseUs from "./components/home/why-choose-us"
import Testimonials from "./components/home/testimonials"
import CTASection from "./components/home/cta-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedProperties />
      <PropertiesCarousel />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </main>
  )
}
