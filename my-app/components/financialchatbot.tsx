"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // Ensure the path to the Card component is correct

// Define the type for messages
type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function FinancialChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [ticker, setTicker] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeAgent = async (tickerSymbol: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/initialize-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker: tickerSymbol }),
      });

      if (!response.ok) throw new Error("Failed to initialize agent");

      setIsInitialized(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'm ready to answer questions about ${tickerSymbol}'s 10-K filing.`,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to initialize the agent. Please try again.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    if (!isInitialized) {
      const tickerInput = input.toUpperCase();
      setTicker(tickerInput);
      setInput("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: `Initialize agent for ${tickerInput}`,
        },
      ]);
      await initializeAgent(tickerInput);
      return;
    }

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage,
          ticker,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Financial Analysis Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chat messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {!isInitialized && messages.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              Enter a stock ticker symbol to begin (e.g., AAPL)
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isInitialized
                  ? "Ask a question about the company's 10-K..."
                  : "Enter ticker symbol..."
              }
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 text-white p-2 rounded-lg disabled:bg-blue-300 hover:bg-blue-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}