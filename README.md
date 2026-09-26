# Sprout - AI Nutrition Assistant

Sprout is a specialized AI assistant strictly focused on food, nutrition, cooking, and food safety. It is designed with rigid guardrails to prevent it from providing medical advice, prescribing diets, or engaging in out-of-scope conversations.

---

## 1. System Prompt

Our current system prompt forces the AI to stay within its domain and strictly structure its output for our frontend to parse claims.

```text
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
```

## 2. Response Schema

The backend uses the Vercel AI SDK combined with Zod to enforce a strict JSON schema on the LLM's output. This allows our frontend to dynamically render citations.

```typescript
export const ClaimSchema = z.object({
  claim: z.string().describe("An individual factual claim extracted from the answer"),
  source: z.null().describe("Always set to null for Milestone 1"),
});

export const AIResponseSchema = z.object({
  answer: z.string().describe("The conversational reply to the user"),
  claims: z.array(ClaimSchema).describe("An array of distinct factual claims"),
});
```

## 3. What Changed Across Prompt Versions and Why

*   **Version 1 (Initial Setup):** We started with a basic "You are a helpful nutrition assistant" prompt.
    *   *Why it changed:* We noticed the LLM was far too eager to provide exact (but hallucinated) daily calorie limits and attempted to diagnose diet-related diseases. It also provided answers as unstructured markdown, which made our specific frontend "Sources Panel" design impossible to build.
*   **Version 2 (Safety & Structure):** We added strict safety boundaries explicitly forbidding medical advice and calorie targets. We also enforced JSON structure to map directly to our Zod schema.
    *   *Why it changed:* To establish a foundation for our Milestone 2 Retrieval-Augmented Generation (RAG). By separating the conversational `answer` from the factual `claims`, our UI can clearly show users *what* the AI is claiming, paving the way for us to inject real `source` citations in the next phase.

## 4. How the Scope Limit is Enforced

We enforce the scope limit using a **Dual-Layer Safety System**:

1.  **Layer 1: Code-Level Regex Interception (`src/lib/safety.ts`)**
    Before the user's message is even sent to the LLM, we check it against a list of restricted keywords (e.g., `medical, diagnose, cancer, diabetes, ideal weight, prescription`). If a match is found, the backend bypasses the LLM entirely and immediately returns a hardcoded refusal response. This guarantees safety and saves API costs.
2.  **Layer 2: Prompt-Level Boundaries**
    If the prompt passes Layer 1 but is highly vague or off-topic (e.g., "Write me a python script" or "Who won the super bowl?"), the System Prompt instructs the LLM to politely refuse to answer and leave the claims array empty.

## 5. Tech Stack

*   **Framework:** Next.js (App Router)
*   **Frontend UI:** React, Tailwind CSS, Lucide React icons
*   **AI Engine:** Vercel AI SDK (`generateObject`)
*   **LLM Provider:** Groq API (`openai/gpt-oss-120b` or `mixtral-8x7b-32768`)
*   **Data Validation:** Zod
*   **Deployment:** Vercel (Frontend Global CDN) & Railway (Backend API routing with CORS enabled)
