"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface PaymentData {
    month: number;
    minimumPayment: number;
    fullPayment: number;
}

export default function InterestCalculator() {
    const [balance, setBalance] = useState(10000);
    const [monthlyPayment, setMonthlyPayment] = useState(1000);
    const [interestRate, setInterestRate] = useState(24);

    const calculatePayments = (): PaymentData[] => {
        const monthlyRate = interestRate / 100 / 12;
        const minimumPayment = balance * 0.05;
        const data: PaymentData[] = [];

        let minBalance = balance;
        let fullBalance = balance;

        for (let month = 1; month <= 12; month++) {
            minBalance = minBalance * (1 + monthlyRate) - minimumPayment;
            if (minBalance < 0) minBalance = 0;

            fullBalance = fullBalance * (1 + monthlyRate) - monthlyPayment;
            if (fullBalance < 0) fullBalance = 0;

            data.push({
                month,
                minimumPayment: Math.round(minBalance),
                fullPayment: Math.round(fullBalance),
            });
        }

        return data;
    };

    const paymentData = calculatePayments();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4">How Interest Is Calculated</h2>
                <p className="text-muted-foreground mb-6">
                    Credit card interest compounds on your unpaid balance. The longer you take to pay off your balance,
                    the more interest you&apos;ll pay. See how different payment strategies affect your total debt over time.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Outstanding Balance (₹)
                    </label>
                    <Input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(Number(e.target.value))}
                        min={1000}
                        max={100000}
                        step={1000}
                        className="bg-black/20 border border-white/20"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Monthly Payment (₹)
                    </label>
                    <Input
                        type="number"
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                        min={100}
                        max={10000}
                        step={100}
                        className="bg-black/20 border border-white/20"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Interest Rate (%)
                    </label>
                    <Input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        min={5}
                        max={36}
                        step={1}
                        className="bg-black/20 border border-white/20"
                    />
                </div>
            </div>

            <Card className="p-4 bg-gray-400/10 border border-white/20">
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={paymentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value: number) => `₹${value.toLocaleString()}`}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="minimumPayment"
                                stroke="#8884d8"
                                name="Minimum Payment"
                            />
                            <Line
                                type="monotone"
                                dataKey="fullPayment"
                                stroke="#82ca9d"
                                name="Full Payment"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-4 bg-gray-400/10 border-none text-white">
                <h3 className="text-lg font-medium mb-2">Key Takeaways</h3>
                <ul className="list-disc list-inside space-y-2">
                    <li>Interest compounds on your unpaid balance each month</li>
                    <li>Making only minimum payments can lead to much higher total costs</li>
                    <li>Higher monthly payments help you pay off debt faster and save on interest</li>
                </ul>
            </Card>
        </div>
    );
} 