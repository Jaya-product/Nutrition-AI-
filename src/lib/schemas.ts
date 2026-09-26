import { z } from 'zod';

export const ClaimSchema = z.object({
  claim: z.string().describe("A single factual statement extracted from the answer"),
  source: z.null().describe("Always null for Milestone 1 as per requirements"),
});

export const AIResponseSchema = z.object({
  answer: z.string().describe("The concise, natural-language response intended for the user"),
  claims: z.array(ClaimSchema).describe("A list of factual statements extracted from the answer. Must be an array."),
});

export type Claim = z.infer<typeof ClaimSchema>;
export type AIResponse = z.infer<typeof AIResponseSchema>;
