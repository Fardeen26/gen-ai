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

export default function SearchCard() {
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
                console.log("card data inside card", cardData)
                botMessage = {
                    role: "bot",
                    content: `I found ${cardData.results.length} credit card${cardData.length > 1 ? 's' : ''} matching your requirements:`,
                    cardData: cardData.results
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
        <div className="flex flex-col h-[calc(100vh-2.5rem)] mt-2 sm:mt-5 mb-2 sm:mb-5 w-full max-w-[75rem] mx-auto bg-background rounded-xl sm:rounded-2xl shadow relative !overflow-hidden">
            <ScrollAreaPrimitive.Root className="flex-1 px-0 pt-4 sm:pt-8 pb-4 overflow-y-auto" style={{ height: "calc(100vh-120px)" }}>
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
                                    <div className={`${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"} px-4 sm:px-6 py-3 sm:py-4 rounded-2xl ${message.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"} max-w-[280px] sm:max-w-2xl text-sm shadow`}>
                                        {message.content}
                                    </div>
                                    {message.cardData && Array.isArray(message.cardData) && (
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
                                                    />
                                                );
                                            })}
                                        </div>
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
                <ScrollAreaPrimitive.Scrollbar orientation="vertical" />
                <ScrollAreaPrimitive.Corner />
            </ScrollAreaPrimitive.Root>

            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-t bg-white rounded-b-xl sm:rounded-b-2xl">
                <Input
                    className="flex-1 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-200 text-sm sm:text-base px-4 sm:px-5 py-2 sm:py-3"
                    placeholder="Ask me about credit cards..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    }}
                />
                <Button size="icon" className="rounded-full bg-blue-600 text-white hover:bg-blue-700 w-9 h-9 sm:w-10 sm:h-10" onClick={handleSubmit}>
                    {isLoading ? <CircleStop className="w-4 h-4 sm:w-5 sm:h-5 text-xs animate-pulse" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
                </Button>
            </div>
        </div>
    )
}