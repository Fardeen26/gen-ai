import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import creditCards from "@/data/data.json";
import { checkRateLimit } from "@/lib/rateLimiter";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Too many requests. Please try again in a minute." },
                { status: 429 }
            );
        }

        const { query } = await req.json();

        const prompt = `
        You are a credit card recommendation assistant. Based on the user's query and the provided credit card data, provide a response in one of these formats:

        1. For queries that need card recommendations or comparisons, return a JSON response with a "type": "cards" and "results" array containing the filtered cards.
        2. For general questions or explanations, return a JSON response with "type": "text" and "content" containing the explanation.

        The credit card data is:
        ${JSON.stringify(creditCards, null, 2)}
        
        User query: "${query}"
        
        Examples:
        - For "Show me cards with lounge access" -> Return type: "cards" with filtered cards
        - For "What is a credit card annual fee?" -> Return type: "text" with explanation
        - For "Compare Axis Magnus vs HDFC Regalia" -> Return type: "cards" with comparison
        - For "How do credit card rewards work?" -> Return type: "text" with explanation
        
        Always wrap your response in a JSON object with "type" and either "results" or "content" field.
      `;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                responseModalities: [Modality.TEXT],
            },
        });

        const content = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) {
            throw new Error('Invalid response format from AI model');
        }

        return Response.json({ results: content || [] });
    } catch (error) {
        console.error('Error processing query:', error);
        return Response.json({ error: "Failed to process query" }, { status: 500 });
    }
}