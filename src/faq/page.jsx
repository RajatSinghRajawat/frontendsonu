"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import pic1 from "../images/pagepic/pic1.webp"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "What makes Bhavish Property different from other real estate agencies?",
      answer:
        "Bhavish Property specializes exclusively in premium properties with a personalized approach. Our team has decades of combined experience in luxury real estate and maintains relationships with discerning buyers and sellers worldwide. We provide white-glove service from initial consultation through closing.",
    },
    {
      question: "How long does the home buying process typically take?",
      answer:
        "The timeline varies depending on financing and inspections, but typically ranges from 30-60 days. Our team works diligently to streamline the process while ensuring all details are handled with precision. We keep you informed at every step.",
    },
    {
      question: "Do you assist with international buyers?",
      answer:
        "Yes, we have extensive experience working with international clients. We assist with visa requirements, currency exchange considerations, and can connect you with legal advisors who specialize in cross-border transactions.",
    },
    {
      question: "What are your commission rates?",
      answer:
        "Commission rates are negotiable and depend on the property value and specifics of the transaction. We believe in transparent pricing and will discuss all costs upfront before any agreement is made.",
    },
    {
      question: "Can you help with property management services?",
      answer:
        "Absolutely. We offer comprehensive property management services including maintenance, tenant screening, rent collection, and legal compliance. Our goal is to maximize your investment returns.",
    },
    {
      question: "How do I list my property with Bhavish Property?",
      answer:
        "Contact us for a free consultation. We'll evaluate your property, discuss your goals, and create a customized marketing strategy. Our team will handle all aspects of marketing and showing your property to qualified buyers.",
    },
    {
      question: "Do you offer financing options?",
      answer:
        "While we don't directly provide financing, we have established relationships with premium lenders and mortgage brokers who specialize in luxury real estate. We can facilitate introductions to expedite your financing process.",
    },
    {
      question: "What areas do you serve?",
      answer:
        "We primarily focus on luxury properties in metropolitan areas and premium locations worldwide. Contact us to discuss your specific location interests.",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
     <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden mt-6 py-16">
  {/* ✅ Background Image */}
  <div className="absolute inset-0">
    <img
      src={pic1}
      alt="Modern conference room background"
      className="w-full h-full object-cover object-center"
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/60" />
  </div>

  {/* ✅ Content */}
  <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
    
    {/* Breadcrumb */}
    <nav className="mb-4 text-sm font-light tracking-wide opacity-90">
      <a href="/" className="hover:text-gold transition-colors">Home</a>
      <span className="mx-2 text-gray-300">/</span>
      <span className="font-semibold text-4xl text-gold">FAQ</span>
    </nav>

    {/* Heading */}
    <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight tracking-tight">
      Frequently Asked Questions
    </h1>

    {/* Paragraph */}
    <p className="text-lg sm:text-xl font-light leading-relaxed max-w-3xl mx-auto mb-8">
      Find quick answers to the most common questions about our services, process, and more.
      We aim to provide you with all the information you need, clearly and efficiently.
    </p>

   
  </div>
</section>


      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gold/5 transition-colors"
              >
                <h3 className="font-open-sans font-semibold text-lg text-navy text-left">{faq.question}</h3>
                <ChevronDown
                  size={24}
                  className={`text-gold flex-shrink-0 ml-4 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-5 bg-gold/5 border-t border-gray-200">
                  <p className="font-open-sans text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Still have questions?</h2>
          <p className="font-open-sans text-lg mb-8">Our team is ready to help. Get in touch with us today.</p>
          <Link
            to="/contact"
            className="inline-block bg-gold text-navy px-8 py-3 font-open-sans font-semibold rounded-sm hover:bg-gold/90 transition-all hover:shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  )
}
