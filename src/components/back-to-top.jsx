"use client"

import { ArrowUp, MessageCircle, Bot } from "lucide-react"
import { useState, useEffect } from "react"
import Chatbot from "./chatbot"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const openWhatsApp = () => {
    window.open("https://wa.me/918619224377", "_blank")
  }

  const openChatbot = () => {
    setIsChatbotOpen(true)
  }

  const closeChatbot = () => {
    setIsChatbotOpen(false)
  }

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
          {/* Chatbot Button */}
          <button
            onClick={openChatbot}
            className="w-12 h-12 bg-[#0A2540] text-white rounded-full flex items-center justify-center  shadow-lg transition-all hover:scale-110"
            title="Chat with AI Assistant"
          >
            <Bot size={24} />
          </button>

          {/* WhatsApp Button */}
          <button
            onClick={openWhatsApp}
            className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 shadow-lg transition-all hover:scale-110"
            title="Chat on WhatsApp"
          >
            <MessageCircle size={24} />
          </button>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-gold text-navy rounded-full flex items-center justify-center hover:bg-gold/90 shadow-lg transition-all hover:scale-110"
            title="Back to top"
          >
            <ArrowUp size={24} />
          </button>
        </div>
      )}

      <Chatbot isOpen={isChatbotOpen} onClose={closeChatbot} />
    </>
  )
}
