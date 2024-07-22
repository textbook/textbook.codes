import { getGithubFact } from "./github.js";
import { getStackOverflowFact } from "./stackOverflow.js";
import { Fact, Summary } from "./types.js";

export interface Sources {
  description?: string;
  githubUsername?: string;
  name: string;
  stackOverflowId?: number;
}

export async function createSummary({ description, githubUsername, name, stackOverflowId }: Sources): Promise<Summary> {
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
  return { description, facts, name };
}
