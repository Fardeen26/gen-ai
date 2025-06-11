import { CreditCardDetailCardProps } from "@/types";
import { Star, BadgeDollarSign, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function LandingPageCreditCard({
    cardName,
    bankName,
    annualFee,
    minIncome,
    rating,
    isPremium = false,
    benefits,
    rewards,
    summary
}: CreditCardDetailCardProps) {
    const [showSummary, setShowSummary] = useState(false);

    return (
        <>
            <div className="w-full sm:w-[350px] bg-white/0 shadow-lg ring-1 ring-black/5 text-white rounded-2xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 border border-white/20">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                    {isPremium ? (
                        <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 text-black text-xs font-semibold px-2 sm:px-3 py-1 rounded-md shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300">PREMIUM</span>
                    ) : <span />}
                    <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
                        <Star className="w-4 h-4 fill-yellow-300 stroke-yellow-400" />
                        {rating}
                    </span>
                </div>
                <div>
                    <div className="text-base sm:text-lg font-semibold leading-tight">{cardName}</div>
                    <div className="text-xs sm:text-sm mb-1 sm:mb-2">{bankName}</div>
                </div>
                <div className="flex justify-between mb-1 sm:mb-2">
                    <div>
                        <div className="text-xs text-gray-400">Annual Fee</div>
                        <div className="font-semibold text-sm sm:text-base">{annualFee}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400">Min Income</div>
                        <div className="font-semibold text-sm sm:text-base">{minIncome}</div>
                    </div>
                </div>
                <div>
                    <div className="text-sm font-medium mb-1 sm:mb-2">Key Benefits</div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                        {benefits.map((b, i) => (
                            <span key={i} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-white/90 text-black rounded-full text-xs font-medium border border-white/10">
                                {b.icon}
                                {b.label}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="relative rounded-xl p-2 sm:p-3 flex items-start gap-2 sm:gap-3 mt-auto overflow-hidden bg-white/10">
                    <div className="relative z-10 flex items-start gap-2 sm:gap-3 w-full ">
                        <BadgeDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mt-0.5" />
                        <div>
                            <div className="font-semibold text-xs sm:text-sm text-emerald-400 mb-0.5 sm:mb-1">Rewards</div>
                            <div className="text-xs text-white leading-tight">{rewards.rate}</div>
                            <div className="text-xs text-white">{rewards.details}</div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-between">
                    <Button className="w-full border border-white/10" onClick={() => setShowSummary(true)}>Summary</Button>
                </div>
            </div>

            {showSummary && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#151515] border border-white/10 text-white rounded-lg px-8 py-10 max-w-2xl w-full mx-4 relative">
                        <button
                            onClick={() => setShowSummary(false)}
                            className="absolute top-4 right-4 text-gray-200 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">{cardName} Summary</h2>
                        <div className="text-gray-100 space-y-2">
                            {summary}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}