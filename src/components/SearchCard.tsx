"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, CircleStop } from "lucide-react"
import CreditCardDetailCard from "@/components/CreditCardDetailCard"
import axios from 'axios'
import { Message } from "@/types"
import { BENEFIT_CONFIG } from "@/config/benifits"
import { extractJsonFromAIResponse } from "@/lib/jsonFormatter"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"


export default function SearchCard({ isHomePage = false }: {
    isHomePage: boolean
}) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            content: "Hello! I can help you find the perfect credit card. What are you looking for?",
        },
    ])
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollToBottomRef = useRef<HTMLDivElement | null>(null)

    const handleSubmit = async () => {
        if (!query.trim()) return;

        const userMessage: Message = {
            role: "user",
            content: query
        };
        setMessages(prev => [...prev, userMessage]);
        setQuery("");
        setIsLoading(true)
        try {
            const response = await axios.post('/api/query', { query });

            let botMessage: Message;
            const cardData = extractJsonFromAIResponse(response.data.results)

            if (cardData.type === "cards") {
                botMessage = {
                    role: "bot",
                    content: cardData.summary || `I found ${cardData.results.length} credit card${cardData.results.length > 1 ? 's' : ''} matching your requirements:`,
                    cardData: cardData.results
                };
            } else if (cardData.type === "comparison") {
                let content = cardData.summary || "Here's a comparison of the requested credit cards:";

                if (cardData.missing_cards && cardData.missing_cards.length > 0) {
                    content += `\n\nNote: The following cards were not found in our database: ${cardData.missing_cards.join(", ")}`;
                }

                botMessage = {
                    role: "bot",
                    content: content,
                    cardData: cardData.results,
                    isComparison: true
                };
            } else if (cardData.type === "text") {
                botMessage = {
                    role: "bot",
                    content: cardData.content
                };
            } else {
                throw new Error("Invalid response type");
            }

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error processing query:', error);
            setMessages(prev => [...prev, {
                role: "bot",
                content: "Sorry, I encountered an error while processing your request. Please try again."
            }]);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (scrollToBottomRef.current) {
            scrollToBottomRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [messages]);

    return (
        <div className={`flex flex-col ${isHomePage ? 'h-auto' : 'h-[calc(100vh-2.5rem)]'} mt-2 sm:mt-5 mb-2 sm:mb-5 w-full max-w-[75rem] mx-auto rounded-xl sm:rounded-2xl  relative !overflow-hidden bg-black text-white`}>
            <ScrollAreaPrimitive.Root className="flex-1 px-0 pt-4 sm:pt-8 pb-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ height: "calc(100vh-120px)" }}>
                <ScrollAreaPrimitive.Viewport className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-8">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className="flex items-end gap-2 relative px-10 sm:px-12">
                                <div className="absolute top-2 left-0">
                                    {message.role === "bot" && (
                                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white shadow">
                                            <AvatarImage src="/bot-pfp.png" alt="profile" />
                                            <AvatarFallback className="bg-gray-200 text-gray-600">AI</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 py-2">
                                    <div className={`${message.role === "user" ? "bg-gradient-to-br from-blue-700 to-blue-500 text-white" : "bg-gradient-to-br bg-gray-400/20"} px-4 sm:px-6 py-3 sm:py-4 rounded-2xl ${message.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"} max-w-[280px] sm:max-w-2xl text-sm shadow`}>
                                        {message.content}
                                    </div>
                                    {message.cardData && Array.isArray(message.cardData) && (
                                        message.isComparison ? (
                                            <div className="w-full overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="hover:bg-white/10">
                                                            <TableHead className="text-white font-semibold">Feature</TableHead>
                                                            {message.cardData.map((card, index) => (
                                                                <TableHead key={index} className="min-w-[200px] text-white font-semibold">{card.name}</TableHead>
                                                            ))}
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        <TableRow className="hover:bg-white/10">
                                                            <TableCell className="font-medium">Bank</TableCell>
                                                            {message.cardData.map((card, index) => (
                                                                <TableCell key={index}>{card.bank}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                        <TableRow className="hover:bg-white/10">
                                                            <TableCell className="font-medium">Annual Fee</TableCell>
                                                            {message.cardData.map((card, index) => (
                                                                <TableCell key={index}>₹{card.annual_fee}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                        <TableRow className="hover:bg-white/10">
                                                            <TableCell className="font-medium">Rewards Rate</TableCell>
                                                            {message.cardData.map((card, index) => (
                                                                <TableCell key={index}>{card.rewards_rate || 'None'}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                        <TableRow className="hover:bg-white/10">
                                                            <TableCell className="font-medium">Lounge Access</TableCell>
                                                            {message.cardData.map((card, index) => (
                                                                <TableCell key={index}>{card.lounge_access || 'None'}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                        <TableRow className="hover:bg-white/10">
                                                            <TableCell className="font-medium">Fuel Benefits</TableCell>
                                                            {message.cardData.map((card, index) => (
                                                                <TableCell key={index}>{card.fuel_benifits || 'None'}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                        <TableRow className="hover:bg-white/10">
                                                            <TableCell className="font-medium">Dining</TableCell>
                                                            {message.cardData.map((card, index) => (
                                                                <TableCell key={index}>{card.dining || 'None'}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                        <TableRow className="hover:bg-white/10">
                                                            <TableCell className="font-medium">Eligibility</TableCell>
                                                            {message.cardData.map((card, index) => (
                                                                <TableCell key={index}>{card.eligibility}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-row flex-wrap gap-3 sm:gap-4">
                                                    {message.cardData.map((card, cardIndex) => {
                                                        const benefits = BENEFIT_CONFIG
                                                            .filter(cfg => ((card as unknown) as Record<string, unknown>)[cfg.key] && ((card as unknown) as Record<string, unknown>)[cfg.key] !== "None")
                                                            .map(cfg => ({ icon: cfg.icon, label: cfg.label }));

                                                        return (
                                                            <CreditCardDetailCard
                                                                key={cardIndex}
                                                                cardName={card.name || 'N/A'}
                                                                bankName={card.bank || 'N/A'}
                                                                annualFee={`₹${card.annual_fee || 0}`}
                                                                minIncome={card.eligibility || 'N/A'}
                                                                rating={card.rating}
                                                                isPremium={card.is_premium}
                                                                benefits={benefits.length > 0 ? benefits : [{ icon: null, label: "No benefits" }]}
                                                                rewards={{ rate: card.rewards_rate || 'N/A', details: "4 points per ₹150" }}
                                                                summary=""
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="absolute top-2 right-0">
                                    {message.role === "user" && (
                                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white shadow">
                                            <AvatarImage src="/user-pfp.png" alt="profile" />
                                            <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollToBottomRef} />
                </ScrollAreaPrimitive.Viewport>
            </ScrollAreaPrimitive.Root>

            <div className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-b-xl sm:rounded-b-2xl">
                <Input
                    className="max-w-4xl rounded-full bg-[#151515] border-white/20 placeholder:text-white/60 focus:ring-2 focus:ring-blue-200 sm:text-base px-4 sm:px-5 py-2 sm:py-3 placeholder:text-sm"
                    placeholder="Ask me about credit cards..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    }}
                />
                <Button size="icon" className="rounded-full bg-white hover:bg-white/80 text-black w-8 h-8 sm:w-10 sm:h-10" onClick={handleSubmit}>
                    {isLoading ? <CircleStop className="w-4 h-4 sm:w-5 sm:h-5 text-xs animate-pulse" /> : <Send width={10} height={10} className="w-3 h-3 sm:w-5 sm:h-5" />}
                </Button>
            </div>
        </div>
    )
}