import { getGithubFact } from "./github.js";
import { getStackOverflowFact } from "./stackOverflow.js";
import type { Fact } from "./types.js";

export interface Sources {
  githubUsername: string;
  stackOverflowId: number;
}

export async function createSummary({ githubUsername, stackOverflowId }: Partial<Sources>): Promise<Fact[]> {
  const facts: Fact[] = [];
  let fact: Fact | undefined;
  if (githubUsername) {
    fact = await getGithubFact(githubUsername);
    if (fact) {
      facts.push(fact);
    }
  }
  if (stackOverflowId) {
    fact = await getStackOverflowFact(stackOverflowId);
    if (fact) {
      facts.push(fact);
    }
  }
  return facts;
}
