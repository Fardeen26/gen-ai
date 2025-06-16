"use client";

import { Card } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Check, X } from "lucide-react";

interface ScoreFactor {
    name: string;
    percentage: number;
    description: string;
}

const scoreFactors: ScoreFactor[] = [
    {
        name: "Payment History",
        percentage: 35,
        description: "Your track record of paying bills on time",
    },
    {
        name: "Credit Utilization",
        percentage: 30,
        description: "How much of your available credit you're using",
    },
    {
        name: "Credit History Length",
        percentage: 15,
        description: "How long you've had credit accounts",
    },
    {
        name: "New Credit",
        percentage: 10,
        description: "Recent credit inquiries and new accounts",
    },
    {
        name: "Credit Mix",
        percentage: 10,
        description: "Variety of credit types you have",
    },
];

const doAndDonts = [
    {
        type: "do",
        text: "Pay bills on time",
        icon: <Check className="h-5 w-5 text-green-500" />,
    },
    {
        type: "do",
        text: "Keep utilization below 30%",
        icon: <Check className="h-5 w-5 text-green-500" />,
    },
    {
        type: "do",
        text: "Maintain a mix of credit types",
        icon: <Check className="h-5 w-5 text-green-500" />,
    },
    {
        type: "dont",
        text: "Apply for many cards at once",
        icon: <X className="h-5 w-5 text-red-500" />,
    },
    {
        type: "dont",
        text: "Max out your credit cards",
        icon: <X className="h-5 w-5 text-red-500" />,
    },
    {
        type: "dont",
        text: "Close old credit accounts",
        icon: <X className="h-5 w-5 text-red-500" />,
    },
];

export default function CreditScoreFactors() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4">What Affects Your Credit Score</h2>
                <p className="text-muted-foreground mb-6">
                    Your credit score is calculated based on several factors. Understanding these
                    factors helps you maintain a good credit score.
                </p>
            </div>

            <Card className="p-4 bg-gray-400/10 border-white/20 text-white">
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={scoreFactors}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={150}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value: number) => `${value}%`}
                                labelStyle={{ color: "#000" }}
                            />
                            <Bar
                                dataKey="percentage"
                                fill="#8884d8"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="py-4 px-6 bg-gray-400/10 border-white/20 text-white">
                    <h3 className="text-lg font-medium mb-4">Factor Explanations</h3>
                    <div className="space-y-4">
                        {scoreFactors.map((factor, index) => (
                            <div key={index}>
                                <h4 className="font-medium">{factor.name} ({factor.percentage}%)</h4>
                                <p className="text-sm text-muted-foreground">
                                    {factor.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="py-4 px-6 bg-gray-400/10 border-white/20 text-white">
                    <h3 className="text-lg font-medium mb-4">Do&apos;s and Don&apos;ts</h3>
                    <div className="space-y-4">
                        {doAndDonts.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                {item.icon}
                                <span className={item.type === "dont" ? "text-red-500" : ""}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card className="p-4 bg-gray-400/10 border-none text-white">
                <h3 className="text-lg font-medium mb-2">Pro Tips</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>Check your credit report regularly for errors</li>
                    <li>Set up payment reminders to avoid late payments</li>
                    <li>Keep old credit cards open to maintain credit history</li>
                    <li>Space out credit applications to minimize impact</li>
                </ul>
            </Card>
        </div>
    );
} 