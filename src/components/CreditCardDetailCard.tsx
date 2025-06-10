import { CreditCardDetailCardProps } from "@/types";
import { Star, BadgeDollarSign } from "lucide-react";

export default function CreditCardDetailCard({
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
        <div className="w-full sm:w-[320px] bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 border border-gray-100">
            <div className="flex justify-between items-center mb-1 sm:mb-2">
                {isPremium ? (
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 sm:px-3 py-1 rounded-md">PREMIUM</span>
                ) : <span />}
                <span className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
                    {rating}
                </span>
            </div>
            <div>
                <div className="text-base sm:text-lg font-semibold leading-tight">{cardName}</div>
                <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">{bankName}</div>
            </div>
            <div className="flex justify-between mb-1 sm:mb-2">
                <div>
                    <div className="text-xs text-gray-500">Annual Fee</div>
                    <div className="font-semibold text-sm sm:text-base">{annualFee}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500">Min Income</div>
                    <div className="font-semibold text-sm sm:text-base">{minIncome}</div>
                </div>
            </div>
            <div>
                <div className="text-sm font-medium mb-1 sm:mb-2">Key Benefits</div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                    {benefits.map((b, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs font-medium border border-gray-200">
                            {b.icon}
                            {b.label}
                        </span>
                    ))}
                </div>
            </div>
            <div className="bg-green-50 rounded-xl p-2 sm:p-3 flex items-start gap-2 sm:gap-3 mt-1 sm:mt-2">
                <BadgeDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5" />
                <div>
                    <div className="font-semibold text-xs sm:text-sm text-green-800 mb-0.5 sm:mb-1">Rewards</div>
                    <div className="text-xs text-gray-700 leading-tight">{rewards.rate}</div>
                    <div className="text-xs text-gray-500">{rewards.details}</div>
                </div>
            </div>
        </div>
    );
}