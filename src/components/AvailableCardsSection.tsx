"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import data from "@/data/data.json";
import { BENEFIT_CONFIG } from "@/config/benifits";
import LandingPageCreditCard from "./LandingPageCreditCards";

export default function AvailableCardsSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBank, setSelectedBank] = useState("all");
    const [sortBy, setSortBy] = useState("rating");
    const [showLoungeAccess, setShowLoungeAccess] = useState(false);
    const [showFuelSurchargeWaiver, setShowFuelSurchargeWaiver] = useState(false);
    const [showNoAnnualFee, setShowNoAnnualFee] = useState(false);
    const [showForFirstTimeUsers, setShowForFirstTimeUsers] = useState(false);

    const filteredCards = useMemo(() => {
        let cards = [...data[0]];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            cards = cards.filter(
                (card) =>
                    card.name.toLowerCase().includes(query) ||
                    card.bank.toLowerCase().includes(query) ||
                    card.rewards_rate.toLowerCase().includes(query)
            );
        }

        if (selectedBank !== "all") {
            cards = cards.filter((card) => card.bank.toLowerCase() === selectedBank.toLowerCase());
        }

        if (showLoungeAccess) {
            cards = cards.filter((card) => card.lounge_access && card.lounge_access !== "None");
        }

        if (showFuelSurchargeWaiver) {
            cards = cards.filter((card) => card.fuel_benifits && card.fuel_benifits !== "None");
        }

        if (showNoAnnualFee) {
            cards = cards.filter((card) => card.annual_fee === 0);
        }

        if (showForFirstTimeUsers) {
            cards = cards.filter((card) => !card.is_premium); // Example filter: non-premium cards for first-time users
        }

        cards.sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return b.rating - a.rating;
                case "annual_fee":
                    return a.annual_fee - b.annual_fee;
                case "name":
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return cards;
    }, [searchQuery, selectedBank, sortBy, showLoungeAccess, showFuelSurchargeWaiver, showNoAnnualFee, showForFirstTimeUsers]);

    return (
        <section className="container mx-auto px-10 max-sm:px-2 py-16 bg-black text-white">
            <div className="mb-12">
                <h2 className="text-5xl max-sm:text-2xl font-bold text-center">Available Credit Cards</h2>
                <p className="text-white/50 mt-1 text-lg max-sm:text-sm text-center">You&apos;ll find the cards of all categories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 items-center">
                <div className="col-span-1 md:col-span-2 lg:col-span-2">
                    <label htmlFor="search" className="mb-1">Search</label>
                    <Input
                        placeholder="Search cards..."
                        className="w-full bg-[#151515] border-white/20 placeholder:text-white/60"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        name="search"
                    />
                </div>
                <div className="w-[22vw] max-sm:w-full">
                    <label htmlFor="banks" className="mb-1">Banks</label>
                    <Select value={selectedBank} onValueChange={setSelectedBank} name="banks">
                        <SelectTrigger className="bg-[#151515] border-white/20 placeholder:text-white/60">
                            <SelectValue placeholder="Filter by bank" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#151515] border-white/20 text-white">
                            <SelectItem value="all">All Banks</SelectItem>
                            <SelectItem value="hdfc">HDFC</SelectItem>
                            <SelectItem value="icici">ICICI</SelectItem>
                            <SelectItem value="sbi">SBI</SelectItem>
                            <SelectItem value="axis">Axis</SelectItem>
                            <SelectItem value="kotak">Kotak</SelectItem>
                            <SelectItem value="american express">American Express</SelectItem>
                            <SelectItem value="rbl">RBL</SelectItem>
                            <SelectItem value="yes bank">YES Bank</SelectItem>
                            <SelectItem value="indusind">IndusInd</SelectItem>
                            <SelectItem value="federal bank">Federal Bank</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[22vw] max-sm:w-full">
                    <label htmlFor="sort" className="!mb-2">Sort</label>
                    <Select value={sortBy} onValueChange={setSortBy} name="sort">
                        <SelectTrigger className="bg-[#151515] border-white/20 placeholder:text-white/60">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#151515] border-white/20 text-white">
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="annual_fee">Annual Fee</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="w-[40vw] flex flex-row flex-wrap justify-around items-center pb-10 gap-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="lounge-access"
                        checked={showLoungeAccess}
                        onCheckedChange={(checked) => setShowLoungeAccess(checked as boolean)}
                        className="border-gray-700 data-[state=checked]:bg-blue-700"
                    />
                    <label htmlFor="lounge-access" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Lounge Access
                    </label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="fuel-waiver"
                        checked={showFuelSurchargeWaiver}
                        onCheckedChange={(checked) => setShowFuelSurchargeWaiver(checked as boolean)}
                        className="border-gray-700 data-[state=checked]:bg-blue-700"
                    />
                    <label htmlFor="fuel-waiver" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Fuel Surcharge Waiver
                    </label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="no-annual-fee"
                        checked={showNoAnnualFee}
                        onCheckedChange={(checked) => setShowNoAnnualFee(checked as boolean)}
                        className="border-gray-700 data-[state=checked]:bg-blue-700"
                    />
                    <label htmlFor="no-annual-fee" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        No Annual Fee
                    </label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="first-time-users"
                        checked={showForFirstTimeUsers}
                        onCheckedChange={(checked) => setShowForFirstTimeUsers(checked as boolean)}
                        className="border-gray-700 data-[state=checked]:bg-blue-700"
                    />
                    <label htmlFor="first-time-users" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        For First-Time Users
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {
                    filteredCards.length < 1 && <p>No Cards Found :/</p>
                }
                {filteredCards.length > 0 && filteredCards.map((card, idx) => {
                    const benefits = BENEFIT_CONFIG
                        .filter(cfg => ((card as unknown) as Record<string, unknown>)[cfg.key] && ((card as unknown) as Record<string, unknown>)[cfg.key] !== "None")
                        .map(cfg => ({ icon: cfg.icon, label: cfg.label }));

                    return (
                        <LandingPageCreditCard
                            key={idx}
                            cardName={card.name || 'N/A'}
                            bankName={card.bank || 'N/A'}
                            annualFee={`₹${card.annual_fee || 0}`}
                            minIncome={card.eligibility || 'N/A'}
                            rating={card.rating}
                            isPremium={card.is_premium}
                            benefits={benefits.length > 0 ? benefits : [{ icon: null, label: "No benefits" }]}
                            rewards={{ rate: card.rewards_rate || 'N/A', details: "4 points per ₹150" }}
                            summary={card.summary}
                        />
                    )
                })}
            </div>
        </section>
    );
} 