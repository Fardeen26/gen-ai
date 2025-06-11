export interface CardData {
    id: number;
    bank: string;
    name: string;
    annual_fee: number;
    rating: number;
    is_premium: boolean;
    rewards_rate: string;
    cashback: {
        fuel: string;
        online: string;
    };
    lounge_access: string;
    fuel_benifits: string;
    dining: string;
    insurance: string;
    eligibility: string;
}

export interface Message {
    role: "user" | "bot";
    content: string;
    cardData?: CardData[];
    isComparison?: boolean;
}

export interface CreditCardDetailCardProps {
    cardName: string;
    bankName: string;
    annualFee: string;
    minIncome: string;
    rating: number;
    isPremium?: boolean;
    benefits: { icon: React.ReactNode; label: string }[];
    rewards: { rate: string; details: string };
}