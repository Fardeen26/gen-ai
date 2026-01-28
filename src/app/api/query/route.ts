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

    const url = new URL(req.url);
    const shouldStream = url.searchParams.get("stream") === "1";
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
        
        Important formatting instructions for the VISIBLE (user-facing) part of the response:
        1. Use SIMPLE HTML ONLY (no markdown). You may use these tags: <p>, <br>, <ul>, <ol>, <li>, <strong>, <b>, <em>, <i>, <h3>, <h4>, <span>.
        2. Use <p> for paragraphs, <ul>/<ol>/<li> for bullet or numbered lists.
        3. Use <strong> or <b> for bold emphasis and <em> or <i> for slight emphasis.
        4. Structure the explanation into short paragraphs and bullet lists where helpful.
        5. Avoid using any other HTML tags, inline styles, or scripts.
        
        Output format requirements (IMPORTANT):
        1. The FIRST line of your response must be EXACTLY one of:
             TYPE: cards
             TYPE: comparison
             TYPE: text
        2. After that first line, write ONLY the user-facing response as simple HTML using the allowed tags above.
        3. Then, on a new line AFTER the HTML, include a JSON code block exactly in this form:
           \`\`\`json
           { "type": "...", ... }
           \`\`\`
        4. The JSON must contain the full structured payload (type + fields described above).
      `;

    if (!shouldStream) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT],
        },
      });

      const content = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error("Invalid response format from AI model");
      }

      return Response.json({ results: content });
    }

    const encoder = new TextEncoder();
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT],
      },
    });

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk?.candidates?.[0]?.content?.parts
              ?.map((p) => p.text ?? "")
              .join("");

            if (!text) continue;

            controller.enqueue(
              encoder.encode(JSON.stringify({ type: "delta", text }) + "\n")
            );
          }

          controller.enqueue(encoder.encode(JSON.stringify({ type: "done" }) + "\n"));
        } catch (error) {
          console.error("Error streaming query response:", error);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ type: "error", error: "Failed to process query" }) + "\n"
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error('Error processing query:', error);
    return Response.json({ error: "Failed to process query" }, { status: 500 });
  }
}