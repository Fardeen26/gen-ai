import { CreditCardDetailCardProps } from "@/types";
import { Star, BadgeDollarSign } from "lucide-react";

export default function LandingPageCreditCard({
    cardName,
    bankName,
    annualFee,
    minIncome,
    rating,
    isPremium = false,
    benefits,
    rewards,
}: CreditCardDetailCardProps) {
    return (
        <div className="w-full sm:w-[350px] bg-white/0 shadow-lg ring-1 ring-black/5 text-white rounded-2xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 border border-white/20">
            <div className="flex justify-between items-center mb-1 sm:mb-2">
                {isPremium ? (
                    <span className="bg-blue-700 text-blue-200 text-xs font-semibold px-2 sm:px-3 py-1 rounded-md">PREMIUM</span>
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
                        <span key={i} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-700 rounded-full text-xs font-medium border border-gray-600">
                            {b.icon}
                            {b.label}
                        </span>
                    ))}
                </div>
            </div>
            <div className="bg-green-900 rounded-xl p-2 sm:p-3 flex items-start gap-2 sm:gap-3 mt-auto">
                <BadgeDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 mt-0.5" />
                <div>
                    <div className="font-semibold text-xs sm:text-sm text-green-100 mb-0.5 sm:mb-1">Rewards</div>
                    <div className="text-xs text-gray-300 leading-tight">{rewards.rate}</div>
                    <div className="text-xs text-gray-400">{rewards.details}</div>
                </div>
            </div>
        </div>
    );
}