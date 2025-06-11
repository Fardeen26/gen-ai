"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import AvailableCardsSection from "@/components/AvailableCardsSection";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="container mx-auto px-4 sm:px-6 lg:px-20 py-6 flex justify-between items-center">
        <div className="text-xl sm:text-2xl font-bold flex items-center space-x-0.5">
          <Image src='/logo.svg' alt="logo" width={35} height={35} />
          <span>Card Buddy</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 lg:space-x-16">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/cards" className="hover:text-blue-400 transition-colors">Available Cards</Link>
          <Link href="/assistant" className="hover:text-blue-400 transition-colors">AI assistant</Link>
        </nav>

        {/* CTA Button - Always visible */}
        <div className="space-x-4">
          <Link href='/assistant'>
            <Button className="px-4 py-2 rounded-md border-2 border-[#2B2F37] bg-[#14171F] hover:bg-[#1d222d] transition-colors">AI assistant</Button>
          </Link>
        </div>
      </header>

      <section className="relative px-4 sm:px-6 lg:px-20 xl:px-72 py-12 sm:py-16 lg:py-24 flex flex-col items-center justify-start text-center bg-[url('/bg.svg')] bg-cover h-screen max-sm:h-auto bg-center">
        <p className="text-blue-400 mb-4 text-sm sm:text-base">Over 5,000 users have used Card Buddy last week</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 leading-tight">
          The <span className="bg-gradient-to-r from-[#DCE9F8] to-[#0A61CB] bg-clip-text text-transparent">neway</span> of tracking your credit card success
        </h1>
        <p className="text-base sm:text-lg mb-8 text-gray-400 max-w-2xl">
          Easily access and manage your credit card benefits
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href='/assistant'>
            <Button className="text-sm w-full max-sm:w-[70vw] sm:w-40 rounded-md h-10 bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
              AI assistant
            </Button>
          </Link>
          <Link href='/cards'>
            <Button className="px-4 w-full sm:w-40 h-10 py-1 text-sm rounded-md border border-gray-600 text-white font-semibold hover:bg-black/80 transition-colors">
              Browse
            </Button>
          </Link>
        </div>
      </section>

      <AvailableCardsSection />
    </main>
  );
}
