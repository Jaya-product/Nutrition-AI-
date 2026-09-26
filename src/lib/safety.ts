const RESTRICTED_PATTERNS = [
  /(how many|target|daily).*calories/i,
  /ideal weight/i,
  /(lose|gain|target).*weight/i,
  /diabetes|cancer|cure|treat|medicine|prescription/i
];

export function isRestricted(query: string): boolean {
  return RESTRICTED_PATTERNS.some(pattern => pattern.test(query));
}

export const SAFE_REFUSAL_RESPONSE = {
  answer: "I cannot provide personalized calorie targets, weight recommendations, or medical advice. For personalized guidance, please consult a qualified healthcare professional.",
  claims: [],
  source: null
};
