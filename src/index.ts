import { getStackOverflowFact } from "./stackOverflow.js";
import type { Fact } from "./types.js";

export interface Sources {
  gitHubUsername: string;
  stackOverflowId: number;
}

export async function createSummary({ stackOverflowId }: Partial<Sources>): Promise<Fact[]> {
  const facts: Fact[] = [];
  if (stackOverflowId) {
    const fact = await getStackOverflowFact(stackOverflowId);
    if (fact) {
      facts.push(fact);
    }
  }
  return facts;
};
