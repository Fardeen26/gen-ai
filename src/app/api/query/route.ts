import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import creditCards from "@/data/data.json";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
    const { query } = await req.json();

    const prompt = `
    You are a credit card recommendation assistant. Based on the user's query and the provided credit card data, return a JSON response with filtered cards or a comparison. The data is:
    ${JSON.stringify(creditCards, null, 2)}
    
    User query: "${query}"
    
    For queries like "Show me cards with lounge access and high cashback on fuel," filter cards that match both criteria.
    For queries like "Compare Axis Magnus vs HDFC Regalia," provide a side-by-side comparison with key benefits.
    For queries like "Best credit cards for first-time users with no annual fee," filter cards with no annual fee and suitable for beginners.
    Return the response in JSON format with a "results" array or "comparison" object.
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        console.log("response", response)

        return Response.json({ result: response.text });
    } catch (error) {
        console.log(error)
        return Response.json({ error: "Failed to process query" }, { status: 500 });
    }
}