"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0088FE", "#FF8042"];

export default function AprCalculator() {
    const [loanAmount, setLoanAmount] = useState(10000);
    const [apr, setApr] = useState(24);
    const [duration, setDuration] = useState(6);

    const calculateInterest = () => {
        const monthlyRate = apr / 100 / 12;
        const interest = loanAmount * monthlyRate * duration;
        return interest;
    };

    const interest = calculateInterest();
    const totalRepayment = loanAmount + interest;

    const pieData = [
        { name: "Principal", value: loanAmount },
        { name: "Interest", value: interest },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4">What is APR?</h2>
                <p className="text-muted-foreground mb-6">
                    APR (Annual Percentage Rate) is the yearly interest rate you pay on your credit card balance.
                    It includes both the interest rate and any additional fees.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Loan Amount: ₹{loanAmount.toLocaleString()}
                        </label>
                        <Slider
                            value={[loanAmount]}
                            onValueChange={([value]) => setLoanAmount(value)}
                            min={1000}
                            max={50000}
                            step={1000}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            APR: {apr}%
                        </label>
                        <Slider
                            value={[apr]}
                            onValueChange={([value]) => setApr(value)}
                            min={5}
                            max={36}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Duration: {duration} months
                        </label>
                        <Slider
                            value={[duration]}
                            onValueChange={([value]) => setDuration(value)}
                            min={1}
                            max={12}
                            step={1}
                            className="w-full"
                        />
                    </div>
                </div>

                <Card className="p-4 bg-gray-400/10 border-none text-white">
                    <h3 className="text-lg font-medium mb-4">Breakdown</h3>
                    <div className="space-y-2 text-sm">
                        <p>Principal: ₹{loanAmount.toLocaleString()}</p>
                        <p>Interest: ₹{interest.toLocaleString()}</p>
                        <p className="font-semibold">
                            Total Repayment: ₹{totalRepayment.toLocaleString()}
                        </p>
                    </div>
                </Card>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <Card className="p-4 bg-gray-400/10 text-white border border-white/20">
                <p className="text-sm">
                    Example: ₹10,000 borrowed for 6 months at 24% APR = ₹1,200 interest
                </p>
            </Card>
        </div>
    );
} 