import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 py-4 mt-10 text-white px-10">
            <div className="w-full flex max-sm:flex-col max-sm:items-center max-sm:space-y-2 justify-between">
                <div className="text-xl sm:text-lg font-bold flex items-center space-x-0.5">
                    <Image src='/logo.svg' alt="logo" width={25} height={25} />
                    <span>Card Buddy</span>
                </div>
                <div className="space-x-6 text-sm">
                    <Link href="/" className="hover:text-blue-400 transition-colors">Twitter</Link>
                    <Link href="/cards" className="hover:text-blue-400 transition-colors">Github</Link>
                    <Link href="/assistant" className="hover:text-blue-400 transition-colors">Developer</Link>
                </div>
            </div>
        </footer>
    )
}