export function extractJsonFromAIResponse(aiOutput: string) {
    // Prefer fenced JSON blocks, but be tolerant to minor formatting differences.
    const fencedMatch = aiOutput.match(/```json\s*([\s\S]*?)\s*```/i);
    const candidate = (fencedMatch?.[1] ?? aiOutput).trim();

    // If there is surrounding text, extract the first full JSON object.
    const firstBrace = candidate.indexOf("{");
    const lastBrace = candidate.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonText = candidate.slice(firstBrace, lastBrace + 1);
        return JSON.parse(jsonText);
    }

    throw new Error("Invalid JSON format from AI response");
}