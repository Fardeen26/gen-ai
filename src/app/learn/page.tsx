"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import AprCalculator from "@/components/learn/AprCalculator";
import InterestCalculator from "@/components/learn/InterestCalculator";
import HiddenFees from "@/components/learn/HiddenFees";
import CardTypes from "@/components/learn/CardTypes";
import CreditScoreFactors from "@/components/learn/CreditScoreFactors";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchCard from "@/components/SearchCard";

export default function LearnPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 py-8 max-w-6xl text-white"
        >
            <div className="mb-8">
                <Link href="/">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
                <h1 className="text-4xl font-bold mb-2">Learn Credit Cards</h1>
                <p className="text-lg text-muted-foreground">
                    Master the basics of credit cards, interest rates, and smart usage — fast.
                </p>
            </div>

            <Tabs defaultValue="apr" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-8 bg-[#151515] border-white/20">
                    <TabsTrigger value="apr">APR Basics</TabsTrigger>
                    <TabsTrigger value="interest">Interest Calculation</TabsTrigger>
                    <TabsTrigger value="fees">Hidden Fees</TabsTrigger>
                    <TabsTrigger value="types">Card Types</TabsTrigger>
                    <TabsTrigger value="score">Credit Score</TabsTrigger>
                </TabsList>

                <TabsContent value="apr">
                    <Card className="p-6 bg-white/0 shadow-lg ring-1 ring-black/5 text-white rounded-2xl flex flex-col border border-white/20">
                        <AprCalculator />
                    </Card>
                </TabsContent>

                <TabsContent value="interest">
                    <Card className="p-6 bg-white/0 shadow-lg ring-1 ring-black/5 text-white rounded-2xl flex flex-col border border-white/20">
                        <InterestCalculator />
                    </Card>
                </TabsContent>

                <TabsContent value="fees">
                    <Card className="p-6 bg-white/0 shadow-lg ring-1 ring-black/5 text-white rounded-2xl flex flex-col border border-white/20">
                        <HiddenFees />
                    </Card>
                </TabsContent>

                <TabsContent value="types">
                    <Card className="p-6 bg-white/0 shadow-lg ring-1 ring-black/5 text-white rounded-2xl flex flex-col border border-white/20">
                        <CardTypes />
                    </Card>
                </TabsContent>

                <TabsContent value="score">
                    <Card className="p-6 bg-white/0 shadow-lg ring-1 ring-black/5 text-white rounded-2xl flex flex-col border border-white/20">
                        <CreditScoreFactors />
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-12 p-6 rounded-lg bg-white/0 shadow-lg ring-1 ring-black/5 text-white flex flex-col border border-white/20">
                <h2 className="text-2xl font-semibold mb-4">Still Confused? Ask Buddy 👇</h2>
                <SearchCard isHomePage={true} />
            </div>
        </motion.div>
    );
} 