"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, CircleStop } from "lucide-react"
import CreditCardDetailCard from "@/components/CreditCardDetailCard"
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
    const [expectedType, setExpectedType] = useState<"cards" | "comparison" | "text" | null>(null)
    const scrollToBottomRef = useRef<HTMLDivElement | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)
    const activeBotMessageIndexRef = useRef<number | null>(null)
    const [isFinalizing, setIsFinalizing] = useState(false)
    const hasStructuredStartedRef = useRef(false)
    const expectedTypeRef = useRef<"cards" | "comparison" | "text" | null>(null)

    const stopStreaming = () => {
        abortControllerRef.current?.abort()
        abortControllerRef.current = null
        setIsFinalizing(false)
        setIsLoading(false)
    }

    const handleSubmit = async () => {
        if (!query.trim() || isLoading) return;
        const currentQuery = query
        hasStructuredStartedRef.current = false
        expectedTypeRef.current = null
        setExpectedType(null)

        const userMessage: Message = {
            role: "user",
            content: query
        };
        setMessages(prev => [...prev, userMessage]);
        setMessages(prev => {
            const next = [...prev, { role: "bot", content: "" } as Message]
            activeBotMessageIndexRef.current = next.length - 1
            return next
        })
        setQuery("");
        setIsLoading(true)
        setIsFinalizing(false)

        const controller = new AbortController()
        abortControllerRef.current = controller

        const updateActiveBotMessage = (patch: Partial<Message>) => {
            const idx = activeBotMessageIndexRef.current
            if (idx == null) return
            setMessages(prev => {
                if (!prev[idx]) return prev
                const next = [...prev]
                next[idx] = { ...next[idx], ...patch }
                return next
            })
        }

        try {
            const response = await fetch('/api/query?stream=1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: currentQuery }),
                signal: controller.signal
            })

            if (!response.ok) {
                const errorText = await response.text().catch(() => "")
                throw new Error(errorText || "Request failed")
            }

            const contentType = response.headers.get("content-type") || ""

            // Fallback (non-stream) response handling
            if (!response.body || !contentType.includes("application/x-ndjson")) {
                const data = await response.json()
                const fullText: string = data.results
                const beforeJson = fullText.split("```json")[0]
                const visibleText = beforeJson.replace(/^TYPE:.*$/gim, "").trim()
                const cardData = extractJsonFromAIResponse(fullText)

                if (cardData.type === "cards" || cardData.type === "comparison" || cardData.type === "text") {
                    expectedTypeRef.current = cardData.type
                    setExpectedType(cardData.type)
                }

                if (cardData.type === "cards") {
                    updateActiveBotMessage({
                        content: visibleText || cardData.summary || `I found ${cardData.results.length} credit card${cardData.results.length > 1 ? 's' : ''} matching your requirements:`,
                        cardData: cardData.results,
                        isComparison: false
                    })
                } else if (cardData.type === "comparison") {
                    let content = visibleText || cardData.summary || "Here's a comparison of the requested credit cards:"
                    if (cardData.missing_cards && cardData.missing_cards.length > 0) {
                        content += `\n\nNote: The following cards were not found in our database: ${cardData.missing_cards.join(", ")}`
                    }
                    updateActiveBotMessage({
                        content,
                        cardData: cardData.results,
                        isComparison: true
                    })
                } else if (cardData.type === "text") {
                    updateActiveBotMessage({ content: visibleText || cardData.content })
                } else {
                    throw new Error("Invalid response type")
                }
                return
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ""
            let fullText = ""

            while (true) {
                const { value, done } = await reader.read()
                if (done) break
                buffer += decoder.decode(value, { stream: true })

                const lines = buffer.split("\n")
                buffer = lines.pop() ?? ""

                for (const line of lines) {
                    const trimmed = line.trim()
                    if (!trimmed) continue

                    const event = JSON.parse(trimmed) as { type: string; text?: string; error?: string }
                    if (event.type === "delta" && typeof event.text === "string") {
                        fullText += event.text

                        // Detect structured response type as soon as possible
                        if (!expectedTypeRef.current && fullText.includes("TYPE:")) {
                            const match = fullText.match(/TYPE:\s*(cards|comparison|text)/i)
                            if (match) {
                                const t = match[1].toLowerCase() as "cards" | "comparison" | "text"
                                expectedTypeRef.current = t
                                setExpectedType(t)
                            }
                        }

                        const beforeJson = fullText.split("```json")[0]
                        const visible = beforeJson.replace(/^TYPE:.*$/gim, "").replace(/\s+$/, "")
                        if (visible.trim().length > 0) {
                            updateActiveBotMessage({ content: visible })
                        }

                        // As soon as the JSON block starts streaming (which the user doesn't see),
                        // show a loading state for cards / comparison so the UI doesn't look frozen.
                        if (!hasStructuredStartedRef.current && fullText.includes("```json")) {
                            hasStructuredStartedRef.current = true
                            if (expectedTypeRef.current === "cards" || expectedTypeRef.current === "comparison") {
                                setIsFinalizing(true)
                            }
                        }
                    } else if (event.type === "error") {
                        throw new Error(event.error || "Failed to process query")
                    }
                }
            }

            const beforeJson = fullText.split("```json")[0]
            const visibleText = beforeJson.replace(/^TYPE:.*$/gim, "").trim()
            const cardData = extractJsonFromAIResponse(fullText)

            if (cardData.type === "cards") {
                updateActiveBotMessage({
                    content: visibleText || cardData.summary || `I found ${cardData.results.length} credit card${cardData.results.length > 1 ? 's' : ''} matching your requirements:`,
                    cardData: cardData.results,
                    isComparison: false
                })
            } else if (cardData.type === "comparison") {
                let content = visibleText || cardData.summary || "Here's a comparison of the requested credit cards:"
                if (cardData.missing_cards && cardData.missing_cards.length > 0) {
                    content += `\n\nNote: The following cards were not found in our database: ${cardData.missing_cards.join(", ")}`
                }
                updateActiveBotMessage({
                    content,
                    cardData: cardData.results,
                    isComparison: true
                })
            } else if (cardData.type === "text") {
                updateActiveBotMessage({ content: visibleText || cardData.content })
            } else {
                throw new Error("Invalid response type")
            }
        } catch (error) {
            if (controller.signal.aborted) {
                updateActiveBotMessage({ content: "Stopped." })
                return
            }
            console.error('Error processing query:', error);
            updateActiveBotMessage({ content: "Sorry, I encountered an error while processing your request. Please try again." })
        } finally {
            setIsLoading(false)
            setIsFinalizing(false)
            abortControllerRef.current = null
        }
    }

    useEffect(() => {
        if (scrollToBottomRef.current && !isHomePage) {
            scrollToBottomRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [messages, isHomePage]);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort()
        }
    }, [])

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
                                    <div className={`${message.role === "user" ? "bg-gradient-to-br from-blue-700 to-blue-500 text-white" : "bg-gradient-to-br bg-gray-400/20"} px-4 sm:px-6 py-3 sm:py-4 rounded-2xl ${message.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"} max-w-[280px] sm:max-w-3xl text-sm shadow leading-relaxed`}>
                                        {message.role === "bot" && message.content.trim().length === 0 && isLoading && activeBotMessageIndexRef.current === index ? (
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                                                    <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                                                    <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                                                </div>
                                                <span className="text-white/70 text-sm">Thinking…</span>
                                            </div>
                                        ) : (
                                            message.role === "bot" ? (
                                                <div
                                                    className="space-y-2"
                                                    dangerouslySetInnerHTML={{ __html: message.content }}
                                                />
                                            ) : (
                                                message.content
                                            )
                                        )}
                                    </div>

                                    {message.role === "bot" && isFinalizing && activeBotMessageIndexRef.current === index && !message.cardData && (expectedType === "cards" || expectedType === "comparison") && (
                                        <div className="flex flex-col gap-4 w-full max-w-3xl">
                                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "0ms" }} />
                                                    <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "150ms" }} />
                                                    <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "300ms" }} />
                                                </div>
                                                <span>
                                                    {expectedType === "cards" ? "Loading card recommendations…" : "Preparing comparison table…"}
                                                </span>
                                            </div>

                                            {expectedType === "cards" && (
                                                <div className="flex flex-row flex-wrap gap-3 sm:gap-4">
                                                    {[1, 2, 3].map((i) => (
                                                        <div
                                                            key={i}
                                                            className="h-40 w-full min-w-[200px] max-w-[280px] rounded-lg bg-white/10 animate-pulse"
                                                            aria-hidden
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {expectedType === "comparison" && (
                                                <div className="w-full overflow-hidden rounded-lg border border-white/20">
                                                    <div className="h-10 bg-white/10 animate-pulse" />
                                                    <div className="flex gap-0 border-t border-white/10">
                                                        {[1, 2, 3].map((i) => (
                                                            <div
                                                                key={i}
                                                                className="h-24 flex-1 min-w-[120px] bg-white/5 animate-pulse"
                                                                style={{ animationDelay: `${i * 50}ms` }}
                                                                aria-hidden
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

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
                <Button size="icon" className="rounded-full bg-white hover:bg-white/80 text-black w-8 h-8 sm:w-10 sm:h-10" onClick={isLoading ? stopStreaming : handleSubmit}>
                    {isLoading ? <CircleStop className="w-4 h-4 sm:w-5 sm:h-5 text-xs animate-pulse" /> : <Send width={10} height={10} className="w-3 h-3 sm:w-5 sm:h-5" />}
                </Button>
            </div>
        </div>
    )
}