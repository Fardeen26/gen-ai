import { Button } from "@/components/ui/button";
import Image from "next/image";
import AvailableCardsSection from "@/components/AvailableCardsSection";
import Link from "next/link";
import SearchCard from "@/components/SearchCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="container mx-auto px-4 sm:px-6 lg:px-20 py-6 flex justify-between items-center">
        <div className="text-xl sm:text-2xl font-bold flex items-center space-x-0.5">
          <Image src='/logo.svg' alt="logo" width={35} height={35} />
          <span>Card Buddy</span>
        </div>

        <nav className="hidden md:flex space-x-8 lg:space-x-16">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/cards" className="hover:text-blue-400 transition-colors">Available Cards</Link>
          <Link href="/assistant" className="hover:text-blue-400 transition-colors">AI assistant</Link>
          <Link href="/learn" className="hover:text-blue-400 transition-colors">Learn</Link>
        </nav>

        <div className="space-x-4">
          <Link href='/assistant'>
            <Button className="px-4 py-2 rounded-md border border-white/20 bg-white/10 hover:bg-white/15 transition-colors">AI Assistant</Button>
          </Link>
        </div>
      </header>

      <section className="relative px-4 sm:px-6 lg:px-20 xl:px-72 py-12 sm:py-16 lg:py-24 flex flex-col items-center justify-start text-center bg-[url('/bg.svg')] bg-cover h-screen max-sm:h-auto bg-center">
        <p className="text-white mb-4 py-1 px-6 rounded-full border border-white/20 bg-white/10 text-xs">Over 5,000 users have used Card Buddy last week</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 leading-tight">
          The <span className="bg-gradient-to-r from-[#DCE9F8] to-[#0A61CB] bg-clip-text text-transparent">Only</span> platform for all your credit card related doubts
        </h1>
        <p className="text-base sm:text-lg mb-8 text-gray-400 max-w-2xl">
          Get resolved all your credit card related doubts powered by AI
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

      <section className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h2 className="text-5xl max-sm:text-2xl font-bold text-center">Leverage the Highly Intelligent <br />
            <span className="bg-gradient-to-r from-[#DCE9F8] to-[#0A61CB] bg-clip-text text-transparent">Ai Assistant</span>
          </h2>
          <p className="text-white/80 mt-1 text-lg max-sm:text-sm text-center">get details, compare cards, ask doubts</p>
        </div>
        <div className="w-full !bg-red-600/10">
          <SearchCard isHomePage={true} />
        </div>
      </section>
    </main>
  );
}
