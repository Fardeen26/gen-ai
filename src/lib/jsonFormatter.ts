export function extractJsonFromAIResponse(aiOutput: string) {
    const jsonMatch = aiOutput.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
    } else {
        throw new Error("Invalid JSON format from AI response");
    }
}