"use client";

import { Card } from "@/components/ui/card";
import {
    CreditCard,
    AlertCircle,
    DollarSign,
    Percent,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface FeeInfo {
    title: string;
    icon: React.ReactNode;
    description: string;
    example: string;
    howToAvoid: string;
}

const fees: FeeInfo[] = [
    {
        title: "Annual Fees",
        icon: <CreditCard className="h-5 w-5" />,
        description: "Yearly charges for maintaining your credit card account.",
        example: "₹500-₹5,000 per year depending on the card type",
        howToAvoid: "Look for lifetime free cards or cards that waive fees for first year",
    },
    {
        title: "Late Fees",
        icon: <AlertCircle className="h-5 w-5" />,
        description: "Charges applied when you miss your payment due date.",
        example: "₹750 + 3.5% of the overdue amount",
        howToAvoid: "Set up automatic payments or payment reminders",
    },
    {
        title: "Overlimit Charges",
        icon: <DollarSign className="h-5 w-5" />,
        description: "Fees charged when you exceed your credit limit.",
        example: "₹500 per instance + 2.5% of the overlimit amount",
        howToAvoid: "Monitor your credit limit and spending regularly",
    },
    {
        title: "EMI Conversion Charges",
        icon: <Percent className="h-5 w-5" />,
        description: "Fees for converting purchases into EMIs.",
        example: "1-2% of the purchase amount",
        howToAvoid: "Compare with regular interest rates before converting to EMI",
    },
];

export default function HiddenFees() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4">Hidden Fees to Watch For</h2>
                <p className="text-muted-foreground mb-6">
                    Credit cards come with various fees that can catch you by surprise.
                    Understanding these fees helps you make smarter financial decisions.
                </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {fees.map((fee, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-none">
                        <AccordionTrigger className="hover:no-underline bg-gray-400/10 border-white/20 my-1 px-6 rounded-md p-4">
                            <div className="flex items-center gap-3">
                                {fee.icon}
                                <span className="font-medium">{fee.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Card className="p-4 mt-2 border-none bg-gray-400/10 text-white">
                                <div className="space-y-4">
                                    <p className="text-base">{fee.description}</p>
                                    <div>
                                        <h4 className="font-medium mb-1">Example:</h4>
                                        <p className="text-sm">{fee.example}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">How to Avoid:</h4>
                                        <p className="text-sm">{fee.howToAvoid}</p>
                                    </div>
                                </div>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <Card className="p-4 bg-gray-400/10 border-none text-white">
                <h3 className="text-lg font-medium mb-2">Pro Tips</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>Always read the fine print before applying for a card</li>
                    <li>Set up payment reminders to avoid late fees</li>
                    <li>Keep track of your spending to stay within limits</li>
                    <li>Compare total cost including all fees before choosing a card</li>
                </ul>
            </Card>
        </div>
    );
} 