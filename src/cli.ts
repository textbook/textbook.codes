#!/usr/bin/env node
import { parseArgs } from "node:util";

import chalk from "chalk";

import { createSummary } from "./index.js";

const { values: { json }  } = parseArgs({
  options: {
    json: {
      short: "j",
      type: "boolean",
    },
  }
});

const facts = await createSummary({
  gitHubUsername: "textbook",
  stackOverflowId: 3001761,
});

if (json) {
  console.log(JSON.stringify(facts, null, 2));
} else {
  for (const fact of facts) {
    console.log(chalk.bold.underline(fact.title));
    if (fact.details) {
      for (const line of fact.details) {
        console.log(line);
      }
    }
    console.log("🔗", chalk.cyan.underline(fact.url.toString()));
    console.log("\n");
  }
}
