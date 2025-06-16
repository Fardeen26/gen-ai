"use client";

import { Card } from "@/components/ui/card";
import {
    CreditCard,
    Gift,
    Plane,
    Clock,
} from "lucide-react";

interface CardType {
    title: string;
    icon: React.ReactNode;
    description: string;
    example: string;
    benefits: string[];
}

const cardTypes: CardType[] = [
    {
        title: "Cashback Cards",
        icon: <CreditCard className="h-6 w-6" />,
        description: "Earn cash rewards on your everyday purchases.",
        example: "HDFC Millennia gives 5% cashback on Amazon & Flipkart",
        benefits: [
            "Direct cash rewards",
            "No reward point conversion needed",
            "Simple to understand and use",
        ],
    },
    {
        title: "Rewards Cards",
        icon: <Gift className="h-6 w-6" />,
        description: "Earn points that can be redeemed for various rewards.",
        example: "Amex Membership Rewards points can be used for travel, shopping, and more",
        benefits: [
            "Flexible reward options",
            "Higher value on premium categories",
            "Welcome bonus points",
        ],
    },
    {
        title: "Travel Cards",
        icon: <Plane className="h-6 w-6" />,
        description: "Specialized cards for frequent travelers with travel-specific benefits.",
        example: "HDFC Regalia offers airport lounge access and travel insurance",
        benefits: [
            "Airport lounge access",
            "Travel insurance",
            "Air miles and hotel points",
        ],
    },
    {
        title: "Lifetime Free Cards",
        icon: <Clock className="h-6 w-6" />,
        description: "No annual fee cards, perfect for beginners.",
        example: "ICICI Amazon Pay Card offers cashback with no annual fee",
        benefits: [
            "No annual fees",
            "Basic rewards program",
            "Good for building credit history",
        ],
    },
];

export default function CardTypes() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4">Types of Cards Explained</h2>
                <p className="text-muted-foreground mb-6">
                    Different credit cards serve different purposes. Choose the one that best
                    matches your spending habits and financial goals.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {cardTypes.map((type, index) => (
                    <Card key={index} className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            {type.icon}
                            <h3 className="text-xl font-semibold">{type.title}</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">{type.description}</p>
                        <div className="mb-4">
                            <h4 className="font-medium mb-1">Example:</h4>
                            <p className="text-sm">{type.example}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Key Benefits:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {type.benefits.map((benefit, idx) => (
                                    <li key={idx} className="text-sm">
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-4 bg-muted">
                <h3 className="text-lg font-medium mb-2">Choosing the Right Card</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>Consider your spending patterns and lifestyle</li>
                    <li>Compare rewards and benefits across different cards</li>
                    <li>Check if the annual fee is worth the benefits</li>
                    <li>Look for cards that offer welcome bonuses</li>
                </ul>
            </Card>
        </div>
    );
} 