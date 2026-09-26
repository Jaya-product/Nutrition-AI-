import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { groq } from '@ai-sdk/groq';
import { AIResponseSchema } from '@/lib/schemas';
import { isRestricted, SAFE_REFUSAL_RESPONSE } from '@/lib/safety';

const SYSTEM_PROMPT = `
You are an AI assistant focused on food, nutrition, cooking, and food safety questions.
Provide concise, helpful answers (max 3-4 sentences).

SAFETY BOUNDARIES:
- DO NOT provide specific calorie targets.
- DO NOT provide weight recommendations.
- DO NOT provide medical advice or prescribe diets for medical conditions.
- DO NOT answer off-topic questions. If a query is entirely unrelated to food, nutrition, cooking, or food safety (e.g., politics, history, coding), you must politely refuse to answer.

If a user asks about a restricted or off-topic subject, you must refuse politely inside the "answer" field and leave the "claims" array empty.

OUTPUT FORMAT INSTRUCTIONS:
- You must structure your response strictly matching the schema.
- Extract individual factual statements from your answer and place them in the "claims" array.
- The "source" field for every claim MUST be explicitly set to null.
`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allows access from the Vercel frontend
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    // Get the latest user message
    const userMessage = messages[messages.length - 1].content;

    // Code-Level Safety Check (Phase 4)
    if (isRestricted(userMessage)) {
      return NextResponse.json(SAFE_REFUSAL_RESPONSE, { headers: corsHeaders });
    }

    // Use Vercel AI SDK's generateObject for strict schema enforcement
    const { object } = await generateObject({
      model: groq('openai/gpt-oss-120b'),
      schema: AIResponseSchema,
      system: SYSTEM_PROMPT,
      prompt: userMessage,
    });

    // The 'object' is now guaranteed to match AIResponseSchema at runtime
    return NextResponse.json(object, { headers: corsHeaders });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    
    // Graceful fallback for schema breaks or API timeouts
    return NextResponse.json({
      answer: "I encountered an error processing your request. This may be a schema mismatch or API timeout.",
      claims: [],
      source: null
    }, { status: 500, headers: corsHeaders });
  }
}
