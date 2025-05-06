import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatSuggestions } from "./ChatSuggestions";
import { 
  CircleDollarSign, 
  Send, 
  ChevronDown, 
  Bot 
} from "lucide-react";

interface Message {
  content: string;
  type: "user" | "bot";
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    content: "Hello! I'm your finance advisor. How can I help you today with financial information, investment advice, or market insights?",
    type: "bot",
    timestamp: new Date(),
  },
];

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage: Message = {
      content: input,
      type: "user",
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
  
    try {
      const response = await fetch("https://ce3f-34-143-164-252.ngrok-free.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
  
      const data = await response.json();
      const botMessage: Message = {
        content: data.answer || "Sorry, I couldn't process your request.",
        type: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          content: "An error occurred while fetching the response.",
          type: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  
    setIsTyping(false);
  };  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setInput(suggestion);
    document.getElementById("chat-input")?.focus();
  };

  return (
    <div className="flex flex-col h-full relative bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-lg">
      {/* Chat messages container */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-4">
        {messages.map((message, i) => (
          <ChatMessage
            key={i}
            content={message.content}
            type={message.type}
            timestamp={message.timestamp}
            isLatest={i === messages.length - 1}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 py-2 px-4 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 bg-primary text-background p-2 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      )}

      {/* Chat input box */}
      <div className="border-t px-4 md:px-8 py-4 bg-background/90 backdrop-blur-md shadow-lg">
        <div className="flex flex-col gap-4">
          {messages.length <= 2 && <ChatSuggestions onSelectSuggestion={handleSuggestionSelect} />}

          <div className="glass-panel rounded-xl flex items-center overflow-hidden border border-muted shadow-lg backdrop-blur-xl bg-background/50">
            <div className="flex items-center flex-1 px-3 py-2">
              <CircleDollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <textarea
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about investments, markets, banking..."
                className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none h-10 py-2.5 max-h-20 text-sm placeholder-muted-foreground"
                rows={1}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="h-10 px-4 flex items-center justify-center text-primary-foreground bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-center">
            <span className="text-xs text-muted-foreground">
              Powered by financial data sources • Updated in real-time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
