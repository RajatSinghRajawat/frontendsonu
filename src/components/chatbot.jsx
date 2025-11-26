
import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";

export default function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant for Bhavish Properties. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
   const systemPrompt = `
You are Bhavish Properties' official AI assistant.

RULES:
• Always reply short (1–3 lines only).
• Always stay related to real estate, Bhavish Properties, property buying, selling, pricing, location, investment, plots.
• Never give long explanations.
• Never talk outside property topics.
• Reply in the user's language (Hindi, English or Hinglish).
• Keep answers friendly, quick and helpful.
• Aim to guide the user toward property details, budgets, site visit, or contact.
• Bhavish Properties queries  
• Property details, pricing, location guidance  
• Investment advice  
• Website navigation (home, properties, contact, about, inquiry etc.)  
• Lead qualification (budget, requirement, location)  
• Professional customer support  

LANGUAGE RULES:
• Understand and respond in English, Hindi, or Hinglish automatically.  
• Always reply in the same language the user is using.  
• If the user mixes Hindi + English, reply in natural Hinglish.  
• Replies must be friendly, short, clear, and helpful.

STYLE RULES:
• Be professional, polite, and trustworthy.
• Give correct real-estate guidance.
• Never hallucinate fake data; give general guidance unless user provides details.
• Never break character as Bhavish Properties' AI assistant.
Your goal is to help customers understand properties, solve doubts, and guide them toward booking or contacting the team. Give short, clear, property-focused answers only.
`;


      const apiKey = "AIzaSyBpfXR5JL8egUZNd2opuL2NrLkGumYEQss";
      const modelName = "gemini-2.5-flash";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt + "\n\nUser: " + userMessage.content },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const assistantContent =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't respond. Try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantContent },
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm facing some issue right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-12 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] sm:w-80 h-[75vh] sm:h-96 flex flex-col overflow-hidden border border-gray-200">

        {/* HEADER */}
        <div className="bg-[#0A2540] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <h3 className="font-semibold text-sm sm:text-base">
              Bhavish Properties Assistant
            </h3>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-[#0A2540] text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none border"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border px-3 py-2 rounded-xl shadow-sm flex items-center gap-2 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0A2540]"></div>
                Typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 bg-white border-t flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-xl text-sm resize-none h-[40px] focus:ring-2 focus:ring-[#0A2540] outline-none"
            disabled={isLoading}
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-[#0A2540] text-white p-3 rounded-xl hover:bg-[#0A2540] disabled:opacity-50 transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
