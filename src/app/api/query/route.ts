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

        1. For queries that need card recommendations or comparisons, return a JSON response with:
           - For regular recommendations: 
             {
               "type": "cards",
               "results": [array of cards],
               "summary": "Detailed summary of each card's key features and benefits"
             }
           - For comparisons (up to 4 cards):
             {
               "type": "comparison",
               "results": [array of cards to compare],
               "summary": "Detailed comparison summary highlighting key differences and recommendations",
               "missing_cards": ["list of card names that were requested but not found in data"]
             }
        2. For general questions or explanations, return a JSON response with "type": "text" and "content" containing the explanation.

        The credit card data is:
        ${JSON.stringify(creditCards, null, 2)}
        
        User query: "${query}"
        
        Examples:
        - For "Show me cards with lounge access" -> Return type: "cards" with filtered cards and summary
        - For "What is a credit card annual fee?" -> Return type: "text" with explanation
        - For "Compare Axis Magnus vs HDFC Regalia vs ICICI Amazon Pay" -> Return type: "comparison" with array of cards and comparison summary
        - For "How do credit card rewards work?" -> Return type: "text" with explanation
        
        For comparison queries:
        1. Support up to 4 cards in a single comparison
        2. Use fuzzy matching to find cards
        3. List any requested cards that weren't found in missing_cards
        4. Provide a detailed comparison summary highlighting key differences
        
        For card recommendations:
        1. Provide a detailed summary of each card's key features and benefits
        2. Highlight what makes each card unique
        
        Important formatting instructions:
        1. Use plain text only - do not use markdown symbols like *, -, or any other special formatting characters
        2. Write in clear, well-structured paragraphs
        3. Use proper spacing and line breaks for readability
        4. Avoid using any special characters or symbols for emphasis
        5. Keep the language simple and professional
        
        Always wrap your response in a JSON object with appropriate type and fields.
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