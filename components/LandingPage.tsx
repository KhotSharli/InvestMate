"use client";

import { useState } from 'react'
import { BarChart2, Brain, DollarSign, Lock, MessageSquare, PieChart, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"

export default function LandingPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAnswer(`Here's what I found about "${question}": [AI-generated response would appear here]`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur dark:bg-gray-900/80">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <DollarSign className="h-6 w-6 text-[#4bf2b5]" />
              <span className="hidden font-bold text-[#4bf2b5] sm:inline-block">InvestMate</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a className="transition-colors hover:text-[#4bf2b5] text-gray-600 dark:text-gray-400" href="#features">Features</a>
              <a className="transition-colors hover:text-[#4bf2b5] text-gray-600 dark:text-gray-400" href="#how-it-works">How it Works</a>
              <a className="transition-colors hover:text-[#4bf2b5] text-gray-600 dark:text-gray-400" href="#demo">Demo</a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Button variant="ghost" className="text-[#4bf2b5]">Log in</Button>
            <Button className="bg-[#4bf2b5] text-white hover:bg-[#3ecaa2]">Sign up</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f5fff9] dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter text-[#4bf2b5] sm:text-5xl md:text-6xl">Welcome to InvestMate</h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
                  Your comprehensive financial investment platform for informed decision-making and personalized portfolio management.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-[#4bf2b5] text-white hover:bg-[#3ecaa2]">Get Started</Button>
                <Button variant="outline" className="text-[#4bf2b5] border-[#4bf2b5] hover:bg-[#4bf2b5]/10">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-[#4bf2b5] text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureItem icon={<PieChart className="h-12 w-12 mb-4 text-[#4bf2b5]" />} title="Personalized Portfolio" description="Tailored investment advice based on your unique financial profile." />
              <FeatureItem icon={<BarChart2 className="h-12 w-12 mb-4 text-[#4bf2b5]" />} title="Advanced Analytics" description="ML and DL models for risk analysis and return predictions." />
              <FeatureItem icon={<Brain className="h-12 w-12 mb-4 text-[#4bf2b5]" />} title="GenAI Interaction" description="Ask questions about investments, finance, and taxes." />
              <FeatureItem icon={<Zap className="h-12 w-12 mb-4 text-[#4bf2b5]" />} title="Real-time Data" description="Stay informed with the latest financial market trends." />
              <FeatureItem icon={<Lock className="h-12 w-12 mb-4 text-[#4bf2b5]" />} title="Secure Platform" description="Your financial data is protected with state-of-the-art security." />
              <FeatureItem icon={<MessageSquare className="h-12 w-12 mb-4 text-[#4bf2b5]" />} title="Expert Support" description="Get assistance from our team of financial experts." />
            </div>
          </div>
        </section>
        {/* Remaining sections */}
      </main>
      <footer className="w-full py-6 bg-gray-900 text-gray-300">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-[#4bf2b5]" />
              <span className="font-bold text-[#4bf2b5]">InvestMate</span>
            </div>
            <p className="text-center text-sm leading-loose text-gray-400 md:text-left">
              © 2023 InvestMate. All rights reserved.
            </p>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <a className="transition-colors hover:text-[#4bf2b5]" href="#">Privacy Policy</a>
              <a className="transition-colors hover:text-[#4bf2b5]" href="#">Terms of Service</a>
              <a className="transition-colors hover:text-[#4bf2b5]" href="#">Contact Us</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      {icon}
      <h3 className="text-xl font-bold mb-2 text-[#4bf2b5]">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}